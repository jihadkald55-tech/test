const User = require('../models/User');
const Case = require('../models/Case');
const AuditLog = require('../models/AuditLog');
const { logAction } = require('../utils/auditLogger');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await logAction(req.user.id, 'USER_ROLE_CHANGED', 'User', userId, {
      oldRole,
      newRole: role,
    });

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignCaseToJudge = async (req, res) => {
  try {
    const { caseId, judgeId } = req.body;

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const judge = await User.findById(judgeId);
    if (!judge || judge.role !== 'judge') {
      return res.status(400).json({ message: 'Invalid judge' });
    }

    caseData.assignedJudgeId = judgeId;
    caseData.caseTimeline.push({
      event: `Assigned to Judge ${judge.fullName}`,
      date: new Date(),
      createdBy: req.user.id,
    });
    await caseData.save();

    await logAction(req.user.id, 'CASE_ASSIGNED_JUDGE', 'Case', caseId, {
      judgeId,
      judgeName: judge.fullName,
    });

    res.json({ message: 'Case assigned to judge', case: caseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const { userId, action, startDate, endDate } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (action) filter.action = action;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(filter).sort({ timestamp: -1 }).limit(1000);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, updateUserRole, assignCaseToJudge, getAuditLogs };
