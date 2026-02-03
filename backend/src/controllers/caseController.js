const Case = require('../models/Case');
const { logAction } = require('../utils/auditLogger');
const crypto = require('crypto');

const generateCaseNumber = () => {
  return 'CASE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

const generateAnonymousId = () => {
  return 'ANON-' + crypto.randomBytes(8).toString('hex').toUpperCase();
};

const submitCase = async (req, res) => {
  try {
    const { title, description, severity, isAnonymous } = req.body;

    const newCase = new Case({
      caseNumber: generateCaseNumber(),
      title,
      description,
      victimId: req.user.id,
      severity: severity || 'medium',
      isAnonymous: isAnonymous || false,
      anonymousCaseId: isAnonymous ? generateAnonymousId() : null,
      caseTimeline: [
        {
          event: 'Case submitted',
          date: new Date(),
          createdBy: req.user.id,
        },
      ],
    });

    await newCase.save();

    await logAction(req.user.id, 'CASE_CREATED', 'Case', newCase._id, {
      caseNumber: newCase.caseNumber,
      isAnonymous: newCase.isAnonymous,
    });

    res.status(201).json({
      message: 'Case submitted successfully',
      case: newCase,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCasesByUser = async (req, res) => {
  try {
    const { role } = req.user;
    let cases;

    if (role === 'victim') {
      cases = await Case.find({ victimId: req.user.id }).populate('assignedJudgeId assignedLawyers');
    } else if (role === 'judge') {
      cases = await Case.find({ assignedJudgeId: req.user.id }).populate('victimId assignedLawyers');
    } else if (role === 'lawyer') {
      cases = await Case.find({ assignedLawyers: req.user.id }).populate('victimId assignedJudgeId');
    } else if (role === 'admin') {
      cases = await Case.find().populate('victimId assignedJudgeId assignedLawyers');
    }

    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCaseDetails = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.caseId)
      .populate('victimId')
      .populate('assignedJudgeId')
      .populate('assignedLawyers')
      .populate('documents');

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Check access control
    const { role } = req.user;
    const userId = req.user.id;

    if (role === 'victim' && caseData.victimId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (role === 'judge' && caseData.assignedJudgeId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (role === 'lawyer' && !caseData.assignedLawyers.some(l => l._id.toString() === userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await logAction(req.user.id, 'CASE_VIEWED', 'Case', req.params.caseId);

    res.json(caseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCaseStatus = async (req, res) => {
  try {
    const { status, event } = req.body;
    const caseData = await Case.findById(req.params.caseId);

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    // Only judges and admins can update status
    if (req.user.role !== 'judge' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    caseData.status = status;
    if (event) {
      caseData.caseTimeline.push({
        event,
        date: new Date(),
        createdBy: req.user.id,
      });
    }

    await caseData.save();

    await logAction(req.user.id, 'CASE_STATUS_UPDATED', 'Case', req.params.caseId, {
      newStatus: status,
      event,
    });

    res.json({ message: 'Case updated successfully', case: caseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitCase, getCasesByUser, getCaseDetails, updateCaseStatus };
