const express = require('express');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/rbac');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;
