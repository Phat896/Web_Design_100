const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getMailConfig, sendTeamMessage } = require('../services/mailer');

const router = express.Router();
const recentSends = new Map();
const SEND_COOLDOWN_MS = 60 * 1000;

const clean = (value, maxLength) => typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

const getAuthenticatedUser = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  try {
    const decoded = jwt.verify(
      authHeader.slice(7),
      process.env.JWT_SECRET || 'stellar_mind_cosmic_secret_key_999'
    );
    return User.findById(decoded.id).select('username email');
  } catch (error) {
    return null;
  }
};

router.get('/status', (req, res) => {
  res.json({ success: true, configured: Boolean(getMailConfig()) });
});

router.post('/', async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để gửi thư đến đội ngũ sản xuất' });
    }
    if (!user.email) {
      return res.status(409).json({ success: false, message: 'Tài khoản chưa liên kết email. Hãy liên kết email trước khi gửi thư' });
    }

    const name = clean(req.body.name, 80) || user.username;
    const subject = clean(req.body.subject, 120) || 'Góp ý từ người dùng';
    const message = clean(req.body.message, 2000);

    if (!message) {
      return res.status(400).json({ success: false, message: 'Nội dung thư không được bỏ trống' });
    }

    const rateKey = String(user._id);
    const lastSentAt = recentSends.get(rateKey) || 0;
    const waitMs = SEND_COOLDOWN_MS - (Date.now() - lastSentAt);
    if (waitMs > 0) {
      return res.status(429).json({
        success: false,
        message: `Vui lòng đợi ${Math.ceil(waitMs / 1000)} giây trước khi gửi thư tiếp theo`
      });
    }

    const info = await sendTeamMessage({
      name,
      email: user.email,
      subject,
      message,
      username: user.username
    });
    recentSends.set(rateKey, Date.now());

    return res.status(202).json({
      success: true,
      message: 'Thư đã được chuyển đến đội ngũ sản xuất',
      messageId: info.messageId || null
    });
  } catch (error) {
    console.error('[Contact Mail]', error.message);
    const status = error.code === 'MAIL_NOT_CONFIGURED' ? 503 : 502;
    return res.status(status).json({
      success: false,
      message: error.code === 'MAIL_NOT_CONFIGURED'
        ? 'Máy chủ chưa cấu hình dịch vụ gửi email'
        : 'Không thể gửi thư lúc này. Vui lòng thử lại sau'
    });
  }
});

module.exports = router;
