const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const encryptionKey = process.env.ENCRYPTION_KEY || 'your_32_char_encryption_key_here!';

// Ensure key is 32 bytes
const key = crypto
  .createHash('sha256')
  .update(String(encryptionKey))
  .digest();

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (hash) => {
  const parts = hash.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(parts[1], 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const hashFile = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

module.exports = { encrypt, decrypt, hashFile };
