const User = require('../models/User');

exports.getStudents = async (req, res) => {
  const students = await User.find({ role: 'student' }).select('name email');
  res.json(students);
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    // Optional: you could validate role is one of ['admin','student']
    if (!['admin', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role value.' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'Role updated.', user });
  } catch (err) {
    console.error('updateRole error:', err);
    res.status(500).json({ message: 'Server error updating role.' });
  }
};