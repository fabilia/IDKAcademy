const Score = require('../models/Score');

exports.createScore = async (req, res) => {
  const { student, subject, score, feedback } = req.body;
  const record = await Score.create({ student, subject, score, feedback });
  res.status(201).json(record);
};

exports.getScores = async (req, res) => {
  const { studentId, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const docs = await Score.find({ student: studentId })
    .sort('-createdAt')
    .skip(skip)
    .limit(parseInt(limit));
  const total = await Score.countDocuments({ student: studentId });
  res.json({ docs, total, page: parseInt(page), totalPages: Math.ceil(total/limit) });
};

exports.updateScore = async (req, res) => {
  const { id } = req.params;
  const { subject, score, feedback } = req.body;
  try {
    const updated = await Score.findByIdAndUpdate(
      id,
      { subject, score, feedback },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Score not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating score' });
  }
};

exports.deleteScore = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Score.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Score not found' });
    res.json({ message: 'Score deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting score' });
  }
};