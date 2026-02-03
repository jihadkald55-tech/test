const AuditLog = require('../models/AuditLog');

const logAction = async (userId, action, resourceType, resourceId, details = {}) => {
  try {
    const log = new AuditLog({
      userId,
      action,
      resourceType,
      resourceId,
      details,
      timestamp: new Date(),
      ipAddress: details.ipAddress || 'unknown',
      userAgent: details.userAgent || 'unknown',
    });
    await log.save();
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

module.exports = { logAction };
