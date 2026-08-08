const express = require('express');
const router = express.Router();
const {
  getMonths,
  startNewMonth,
  updateMonthlyAmount,
  resetMonth,
  deleteMonth,
  getDashboard
} = require('../controllers/monthController');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.use(requireAuth);

router.route('/')
  .get(getMonths)
  .post(requireAdmin, startNewMonth);

router.route('/:id')
  .put(requireAdmin, updateMonthlyAmount)
  .delete(requireAdmin, deleteMonth);

router.post('/:id/reset', requireAdmin, resetMonth);
router.get('/:id/dashboard', getDashboard);

module.exports = router;
