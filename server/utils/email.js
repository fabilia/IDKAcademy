const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.sendVerifyEmail = (user, token) => {
  const url = `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/verify/${token}`;
  return transporter.sendMail({
    to: user.email,
    subject: 'Verify email',
    html: `<a href="${url}">Click to verify</a>`
  });
};