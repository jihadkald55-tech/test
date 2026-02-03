const Message = require('../models/Message');
const Case = require('../models/Case');
const { encrypt, decrypt } = require('../utils/encryption');
const { logAction } = require('../utils/auditLogger');

const sendMessage = async (req, res) => {
  try {
    const { caseId, receiverId, content } = req.body;

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const encryptedContent = encrypt(content);

    const message = new Message({
      caseId,
      senderId: req.user.id,
      receiverId,
      content,
      encryptedContent,
    });

    await message.save();

    await logAction(req.user.id, 'MESSAGE_SENT', 'Message', message._id, {
      caseId,
      receiverId,
    });

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const { caseId, otherUserId } = req.params;

    const messages = await Message.find({
      caseId,
      $or: [
        { senderId: req.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        caseId,
        receiverId: req.user.id,
        senderId: otherUserId,
        isRead: false,
      },
      { isRead: true }
    );

    await logAction(req.user.id, 'CONVERSATION_VIEWED', 'Message', caseId);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getConversation };
