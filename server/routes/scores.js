// server/routes/scores.js
const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createScore,
  getScores,
  updateScore,
  deleteScore
} = require('../controllers/scoreController');

// All routes require authentication
router.use(protect);

// Admin-only create, update, delete
router.post('/', authorize('admin'), createScore);
router.put('/:id', authorize('admin'), updateScore);
router.delete('/:id', authorize('admin'), deleteScore);

// Any authenticated user can list (with optional studentId filter)
router.get('/', getScores);

module.exports = router;
