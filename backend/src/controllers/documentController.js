const Document = require('../models/Document');
const Case = require('../models/Case');
const { encrypt, hashFile } = require('../utils/encryption');
const { logAction } = require('../utils/auditLogger');

const uploadDocument = async (req, res) => {
  try {
    const { caseId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size exceeds limit' });
    }

    // Allowed file types
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'File type not allowed' });
    }

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check access
    if (caseData.victimId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const fileHash = hashFile(file.buffer);
    const encryptedData = encrypt(file.buffer.toString('base64'));

    const document = new Document({
      caseId,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      fileHash,
      encryptedData,
      uploadedBy: req.user.id,
      accessControl: [
        {
          userId: caseData.victimId,
          canView: true,
          canDownload: true,
        },
      ],
    });

    await document.save();
    caseData.documents.push(document._id);
    await caseData.save();

    await logAction(req.user.id, 'DOCUMENT_UPLOADED', 'Document', document._id, {
      caseId,
      fileName: file.originalname,
      fileHash,
    });

    res.status(201).json({ message: 'Document uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const { caseId } = req.params;

    const documents = await Document.find({ caseId });

    await logAction(req.user.id, 'DOCUMENTS_VIEWED', 'Document', caseId);

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadDocument, getDocuments };
