const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: String,
    fileSize: Number,
    fileHash: {
      type: String,
      required: true,
    },
    encryptedData: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accessControl: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        canView: Boolean,
        canDownload: Boolean,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
