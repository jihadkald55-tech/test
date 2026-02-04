const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error('GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

const owner = process.argv[2];
const repo = process.argv[3];
const visibility = process.argv[4] || 'public'; // 'public' or 'private'
if (!owner || !repo) {
  console.error('Usage: node push_to_github.js <owner> <repo> [public|private]');
  process.exit(1);
}

const workspaceDir = path.resolve(__dirname, '..');
const ignored = new Set([
  'node_modules', '.git', '.next', 'dist', 'out', 'build', 'mongodb_data', 'data'
]);

function shouldIgnore(relPath) {
  const parts = relPath.split(path.sep);
  for (const p of parts) {
    if (ignored.has(p)) return true;
  }
  if (relPath.endsWith('.log')) return true;
  if (relPath.endsWith('.env')) return true;
  return false;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(workspaceDir, full).replace(/\\/g, '/');
    if (shouldIgnore(rel)) continue;
    if (e.isDirectory()) {
      results = results.concat(walk(full));
    } else if (e.isFile()) {
      results.push({ full, rel });
    }
  }
  return results;
}

function request(method, urlPath, data) {
  const options = {
    hostname: 'api.github.com',
    path: urlPath,
    method: method,
    headers: {
      'User-Agent': 'e-court-uploader',
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ status: res.statusCode, body: parsed });
          }
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function createRepo() {
  const payload = {
    name: repo,
    private: visibility === 'private',
    description: 'E-Court System uploaded via script',
    auto_init: false
  };
  console.log('Creating repository:', repo);
  try {
    const res = await request('POST', '/user/repos', payload);
    console.log('Repository created:', res.full_name);
    return res;
  } catch (err) {
    if (err && err.status === 422 && err.body && err.body.message) {
      console.log('Repository creation returned 422:', err.body.message);
      return null;
    }
    console.error('Failed to create repository:', err);
    throw err;
  }
}

async function uploadFile(file) {
  const content = fs.readFileSync(file.full);
  if (content.length > 5 * 1024 * 1024) { // skip files >5MB
    console.log('Skipping large file (>5MB):', file.rel);
    return;
  }
  const b64 = content.toString('base64');
  const urlPath = `/repos/${owner}/${repo}/contents/${encodeURIComponent(file.rel)}`;
  const payload = {
    message: `Add ${file.rel}`,
    content: b64,
    branch: 'main'
  };
  try {
    await request('PUT', urlPath, payload);
    console.log('Uploaded:', file.rel);
  } catch (err) {
    if (err && err.status === 422) {
      try {
        const getRes = await request('GET', `/repos/${owner}/${repo}/contents/${encodeURIComponent(file.rel)}?ref=main`);
        const sha = getRes && getRes.sha;
        if (sha) {
          payload.sha = sha;
          await request('PUT', urlPath, payload);
          console.log('Updated:', file.rel);
        }
      } catch (err2) {
        console.error('Failed to PUT file after getting sha:', file.rel, err2);
      }
    } else {
      console.error('Failed to upload file:', file.rel, err);
    }
  }
}

(async () => {
  try {
    await createRepo();
    // Create branch main by creating a README if repo was empty
    try {
      await request('PUT', `/repos/${owner}/${repo}/contents/README.md`, {
        message: 'Initial README',
        content: Buffer.from('# E-Court System').toString('base64'),
        branch: 'main'
      });
      console.log('Created initial README');
    } catch (e) {
      console.log('README creation skipped or failed (may already exist)');
    }

    const files = walk(workspaceDir);
    console.log(`Found ${files.length} files to upload (filtered)`);
    for (const f of files) {
      if (f.rel.startsWith('node_modules') || f.rel.startsWith('.git')) continue;
      await uploadFile(f);
    }

    console.log('Done uploading files. Repository should be available at:');
    console.log(`https://github.com/${owner}/${repo}`);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
})();
