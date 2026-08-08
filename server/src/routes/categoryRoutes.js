const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus
} = require('../controllers/categoryController');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.use(requireAuth);

router.route('/')
  .get(getCategories)
  .post(requireAdmin, createCategory);

router.route('/:id')
  .put(requireAdmin, updateCategory);

router.patch('/:id/status', requireAdmin, toggleCategoryStatus);

module.exports = router;
