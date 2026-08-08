const express = require('express');
const router = express.Router();
const {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getMemberPaymentHistory
} = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.use(requireAuth);

router.route('/')
  .get(getPayments)
  .post(createPayment);

router.route('/:id')
  .put(requireAdmin, updatePayment)
  .delete(requireAdmin, deletePayment);

router.get('/member/:memberId', getMemberPaymentHistory);

module.exports = router;
