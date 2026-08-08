const express = require('express');
const router = express.Router();
const {
  getMembers,
  createMember,
  getMemberById,
  updateMember,
  toggleMemberStatus
} = require('../controllers/memberController');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.use(requireAuth);

router.route('/')
  .get(getMembers)
  .post(requireAdmin, createMember);

router.route('/:id')
  .get(getMemberById)
  .put(requireAdmin, updateMember);

router.patch('/:id/status', requireAdmin, toggleMemberStatus);

module.exports = router;
