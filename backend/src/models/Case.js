const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    victimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedJudgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedLawyers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'court_session_scheduled', 'closed'],
      default: 'submitted',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    anonymousCaseId: String,
    caseTimeline: [
      {
        event: String,
        date: Date,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Case', caseSchema);
