const nodemailer = require('nodemailer');

let transporter;

const getMailConfig = () => {
  const smtpUrl = process.env.SMTP_URL;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!smtpUrl && (!host || !user || !pass)) return null;

  return {
    transport: smtpUrl || {
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: { user, pass },
      requireTLS: String(process.env.SMTP_REQUIRE_TLS || 'true').toLowerCase() === 'true',
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      disableFileAccess: true,
      disableUrlAccess: true
    },
    from: process.env.MAIL_FROM || user,
    to: process.env.MAIL_TO || 'stellarmind.team@gmail.com'
  };
};

const getTransporter = () => {
  const config = getMailConfig();
  if (!config) return null;
  if (!transporter) transporter = nodemailer.createTransport(config.transport);
  return { transporter, config };
};

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const sendTeamMessage = async ({ name, email, subject, message, username }) => {
  const mailer = getTransporter();
  if (!mailer) {
    const error = new Error('Dịch vụ email chưa được cấu hình trên máy chủ');
    error.code = 'MAIL_NOT_CONFIGURED';
    throw error;
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const safeUsername = escapeHtml(username);

  return mailer.transporter.sendMail({
    from: mailer.config.from,
    to: mailer.config.to,
    replyTo: email,
    subject: `[StellarMind] ${subject}`,
    text: [
      `Người gửi: ${name}`,
      `Tài khoản: ${username}`,
      `Email liên kết: ${email}`,
      `Chủ đề: ${subject}`,
      '',
      message
    ].join('\n'),
    html: `
      <h2>Tín hiệu mới từ StellarMind</h2>
      <p><strong>Người gửi:</strong> ${safeName}</p>
      <p><strong>Tài khoản:</strong> ${safeUsername}</p>
      <p><strong>Email liên kết:</strong> ${safeEmail}</p>
      <p><strong>Chủ đề:</strong> ${safeSubject}</p>
      <hr>
      <p>${safeMessage}</p>
    `
  });
};

module.exports = { getMailConfig, sendTeamMessage };
