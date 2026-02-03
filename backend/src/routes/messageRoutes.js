const express = require('express');
const auth = require('../middleware/auth');
const { sendMessage, getConversation } = require('../controllers/messageController');

const router = express.Router();

router.post('/send', auth, sendMessage);
router.get('/:caseId/:otherUserId', auth, getConversation);

module.exports = router;
