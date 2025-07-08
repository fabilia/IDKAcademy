const mongoose = require('mongoose');
const scoreSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: String,
  score: { type: Number, min: 0, max: 100 },
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Score', scoreSchema);