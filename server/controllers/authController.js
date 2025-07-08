const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendVerifyEmail } = require('../utils/email');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // 1) Check all fields present:
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: 'Name, email, password & role are required.' });
    }

    // 2) Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 3) Try to create the user, catching duplicate‐key errors
    let user;
    try {
      user = await User.create({
        name,
        email,
        password: hashed,
        role,
        isVerified: false,
      });
    } catch (createErr) {
      // If Mongo reports a duplicate key on email
      if (createErr.code === 11000 && createErr.keyPattern?.email) {
        return res
          .status(400)
          .json({ message: 'That email is already registered.' });
      }
      console.error('User.create error:', createErr);
      return res
        .status(500)
        .json({ message: 'Server error during user creation.' });
    }

    // 4) Sign a verification token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // 5) Send verification email
    try {
      await sendVerifyEmail(user, token);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
      // still proceed
    }

    // 6) Respond
    res
      .status(201)
      .json({ message: 'Registered! Please check your email to verify.' });
  } catch (err) {
    console.error('Register error:', err);
    res
      .status(500)
      .json({ message: 'Server error during registration.' });
  }
};


exports.verify = async (req, res) => {
  const { token } = req.params;
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  await User.findByIdAndUpdate(id, { isVerified: true });
  res.json({ message: 'Email verified' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.isVerified) return res.status(400).json({ message: 'Invalid creds' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid creds' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, role: user.role, name: user.name, id: user._id });
};

// after your login & register exports
exports.getMe = (req, res) => {
  // protect middleware attaches req.user
  res.json({
    id: req.user._id,
    name: req.user.name,
    role: req.user.role,
    email: req.user.email
  });
};
