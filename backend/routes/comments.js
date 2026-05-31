const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Comment = require('../models/Comment');
const User = require('../models/User');

// Helper to check user from token
const getUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stellar_mind_cosmic_secret_key_999');
      return await User.findById(decoded.id).select('-password');
    } catch (err) {
      return null;
    }
  }
  return null;
};

// @desc    Get all comments
// @route   GET /api/comments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ timestamp: -1 });
    res.json({ success: true, count: comments.length, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Post a comment
// @route   POST /api/comments
// @access  Public (Optional Authentication)
router.post('/', async (req, res) => {
  try {
    const { text, isAnon, author: customNickname } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Nội dung bình luận không được bỏ trống' });
    }

    const user = await getUserFromToken(req);
    let finalAuthor = customNickname || 'Người ngắm sao';
    let finalAuthorId = null;
    let finalAvatar = finalAuthor.charAt(0).toUpperCase();

    // If logged in and choosing NOT to post anonymously
    if (user && isAnon !== true) {
      finalAuthor = user.username;
      finalAuthorId = user._id;
      finalAvatar = user.username.charAt(0).toUpperCase();
    }

    const newComment = await Comment.create({
      author: finalAuthor,
      authorId: finalAuthorId,
      avatar: finalAvatar,
      text: text,
      isAnon: isAnon === true,
      replies: []
    });

    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    Add a reply to a comment
// @route   POST /api/comments/:id/reply
// @access  Public (Optional Authentication)
router.post('/:id/reply', async (req, res) => {
  try {
    const { text, author: customNickname } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Nội dung phản hồi không được bỏ trống' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận gốc' });
    }

    const user = await getUserFromToken(req);
    let finalAuthor = customNickname || 'Người ngắm sao';
    let finalAuthorId = null;
    let finalAvatar = finalAuthor.charAt(0).toUpperCase();

    // If logged in, we use their username
    if (user) {
      finalAuthor = user.username;
      finalAuthorId = user._id;
      finalAvatar = user.username.charAt(0).toUpperCase();
    }

    const newReply = {
      author: finalAuthor,
      authorId: finalAuthorId,
      avatar: finalAvatar,
      text: text,
      timestamp: new Date()
    };

    comment.replies.push(newReply);
    await comment.save();

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
