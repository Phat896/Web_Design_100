const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateToken = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET || 'stellar_mind_cosmic_secret_key_999',
  { expiresIn: '30d' }
);

const normalizeUsername = (value) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const normalizeEmail = (value) => typeof value === 'string' ? value.trim().toLowerCase() : '';

const getUserFromToken = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'stellar_mind_cosmic_secret_key_999');
    return User.findById(decoded.id);
  } catch (error) {
    return null;
  }
};

// New registrations must include a unique, valid email.
// Existing accounts without email can still sign in and link one via PATCH /email.
router.post('/register', async (req, res) => {
  try {
    const username = normalizeUsername(req.body.username);
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const email = normalizeEmail(req.body.email);

    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ tên đăng nhập, email và mật khẩu' });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ success: false, message: 'Địa chỉ email không hợp lệ' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const field = existingUser.email === email && email ? 'Email' : 'Tên đăng nhập';
      return res.status(409).json({ success: false, message: `${field} đã được liên kết với một tài khoản khác` });
    }

    const user = await User.create({
      username,
      password,
      email
    });

    return res.status(201).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email || null,
      token: generateToken(user._id)
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Tên đăng nhập hoặc email đã tồn tại' });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const username = normalizeUsername(req.body.username);
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp cả tên đăng nhập và mật khẩu' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
    }

    return res.json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email || null,
      token: generateToken(user._id)
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/email', async (req, res) => {
  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để liên kết email' });
    }

    const email = normalizeEmail(req.body.email);
    if (!email || !EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ success: false, message: 'Địa chỉ email không hợp lệ' });
    }

    const owner = await User.findOne({ email, _id: { $ne: user._id } });
    if (owner) {
      return res.status(409).json({ success: false, message: 'Email đã được liên kết với một tài khoản khác' });
    }

    user.email = email;
    await user.save();

    return res.json({ success: true, username: user.username, email: user.email });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email đã được liên kết với một tài khoản khác' });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
