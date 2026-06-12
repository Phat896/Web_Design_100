const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/User');

const router = express.Router();
const ALLOWED_PLANETS = new Set(['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']);
const MAX_TEXT_LENGTH = 1200;

const getUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  try {
    const decoded = jwt.verify(
      authHeader.slice(7),
      process.env.JWT_SECRET || 'stellar_mind_cosmic_secret_key_999'
    );
    return User.findById(decoded.id).select('-password');
  } catch (error) {
    return null;
  }
};

const normalizeText = (value) => typeof value === 'string' ? value.trim() : '';
const normalizeAuthor = (value) => typeof value === 'string' ? value.trim().slice(0, 40) : '';
const safeAvatar = (author) => Array.from(author || 'S')[0].toUpperCase();

const serializeComment = (comment, userId) => {
  const raw = typeof comment.toObject === 'function'
    ? comment.toObject({ getters: false, virtuals: false })
    : { ...comment };
  const likedBy = Array.isArray(raw.likedBy) ? raw.likedBy : [];
  const currentUserId = userId ? String(userId) : null;

  delete raw.likedBy;
  raw.likeCount = likedBy.length;
  raw.likedByMe = Boolean(currentUserId && likedBy.some((id) => String(id) === currentUserId));
  raw.replies = Array.isArray(raw.replies) ? raw.replies : [];
  return raw;
};

// Returns the complete community stream by default, including old records
// without a planet. A valid ?planet=id query narrows the database result.
// VERSION: 2026-06-12 — planet filter fix
router.get('/', async (req, res) => {
  try {
    const requestedPlanet = req.query.planet;
    if (requestedPlanet && !ALLOWED_PLANETS.has(requestedPlanet)) {
      return res.status(400).json({ success: false, message: 'Hành tinh không hợp lệ' });
    }

    const user = await getUserFromToken(req);
    // When planet param given, match exactly; otherwise return all
    const filter = requestedPlanet ? { planet: { $eq: requestedPlanet } } : {};
    const comments = await Comment.find(filter)
      .select('+likedBy')
      .sort({ timestamp: -1 })
      .limit(100);
    const data = comments.map((comment) => serializeComment(comment, user && user._id));

    return res.json({ success: true, count: data.length, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { text, isAnon, author: customNickname, planet, signalLevel } = req.body;
    const normalizedText = normalizeText(text);
    const normalizedPlanet = planet === undefined || planet === null || planet === ''
      ? null
      : (ALLOWED_PLANETS.has(planet) ? planet : undefined);
    const normalizedLevel = signalLevel === undefined || signalLevel === null || signalLevel === ''
      ? null
      : Number(signalLevel);

    if (!normalizedText) {
      return res.status(400).json({ success: false, message: 'Nội dung tín hiệu không được bỏ trống' });
    }
    if (normalizedText.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ success: false, message: `Tín hiệu không được vượt quá ${MAX_TEXT_LENGTH} ký tự` });
    }
    if (normalizedPlanet === undefined) {
      return res.status(400).json({ success: false, message: 'Hành tinh không hợp lệ' });
    }
    if (normalizedLevel !== null && (!Number.isInteger(normalizedLevel) || normalizedLevel < 1 || normalizedLevel > 5)) {
      return res.status(400).json({ success: false, message: 'Cường độ tín hiệu phải từ 1 đến 5' });
    }

    const user = await getUserFromToken(req);
    let finalAuthor = normalizeAuthor(customNickname) || 'Người ngắm sao';
    let finalAuthorId = null;

    if (user && isAnon !== true) {
      finalAuthor = user.username;
      finalAuthorId = user._id;
    }

    const newComment = await Comment.create({
      author: finalAuthor,
      authorId: finalAuthorId,
      avatar: safeAvatar(finalAuthor),
      text: normalizedText,
      isAnon: isAnon === true,
      planet: normalizedPlanet,
      signalLevel: normalizedLevel,
      likedBy: [],
      replies: []
    });

    return res.status(201).json({
      success: true,
      data: serializeComment(newComment, user && user._id)
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/reply', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Mã bình luận không hợp lệ' });
    }

    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để phản hồi' });
    }

    const text = normalizeText(req.body.text);
    if (!text) {
      return res.status(400).json({ success: false, message: 'Nội dung phản hồi không được bỏ trống' });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({ success: false, message: `Phản hồi không được vượt quá ${MAX_TEXT_LENGTH} ký tự` });
    }

    const comment = await Comment.findById(req.params.id).select('+likedBy');
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận gốc' });
    }

    const reply = {
      author: user.username,
      authorId: user._id,
      avatar: safeAvatar(user.username),
      text,
      timestamp: new Date()
    };

    comment.replies.push(reply);
    await comment.save();

    return res.status(201).json({
      success: true,
      data: serializeComment(comment, user._id)
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Toggle a like for the authenticated user. User ids are stored in MongoDB,
// while the public response exposes only the count and current-user state.
router.post('/:id/like', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Mã bình luận không hợp lệ' });
    }

    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để thích bình luận' });
    }

    const comment = await Comment.findById(req.params.id).select('+likedBy');
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
    }

    const userId = String(user._id);
    const index = comment.likedBy.findIndex((id) => String(id) === userId);
    let liked;
    if (index >= 0) {
      comment.likedBy.splice(index, 1);
      liked = false;
    } else {
      comment.likedBy.push(user._id);
      liked = true;
    }
    await comment.save();

    return res.json({
      success: true,
      liked,
      likeCount: comment.likedBy.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
