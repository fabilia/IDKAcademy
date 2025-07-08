const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const { updateRole, getStudents } = require('../controllers/userController');

router.get('/', authorize('admin'), getStudents);
router.put('/:id/role', protect, updateRole);

module.exports = router;