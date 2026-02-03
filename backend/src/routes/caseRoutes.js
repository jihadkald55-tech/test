const express = require('express');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/rbac');
const {
  submitCase,
  getCasesByUser,
  getCaseDetails,
  updateCaseStatus,
} = require('../controllers/caseController');

const router = express.Router();

router.post('/submit', auth, submitCase);
router.get('/my-cases', auth, getCasesByUser);
router.get('/:caseId', auth, getCaseDetails);
router.put('/:caseId/status', auth, authorizeRole('judge', 'admin'), updateCaseStatus);

module.exports = router;
