const express = require('express');
const router = express.Router();
const {
  getAdjustments,
  createAdjustment,
  updateAdjustment,
  deleteAdjustment
} = require('../controllers/adjustmentController');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.use(requireAuth);

router.route('/')
  .get(getAdjustments)
  .post(requireAdmin, createAdjustment);

router.route('/:id')
  .put(requireAdmin, updateAdjustment)
  .delete(requireAdmin, deleteAdjustment);

module.exports = router;
