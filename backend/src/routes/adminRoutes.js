const express = require('express');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/rbac');
const {
  getAllUsers,
  updateUserRole,
  assignCaseToJudge,
  getAuditLogs,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/users', auth, authorizeRole('admin'), getAllUsers);
router.put('/users/:userId/role', auth, authorizeRole('admin'), updateUserRole);
router.post('/cases/assign-judge', auth, authorizeRole('admin'), assignCaseToJudge);
router.get('/audit-logs', auth, authorizeRole('admin'), getAuditLogs);

module.exports = router;
