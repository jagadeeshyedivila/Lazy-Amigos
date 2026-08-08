const Payment = require('../models/Payment');
const MonthlyBudget = require('../models/MonthlyBudget');
const MonthlyMember = require('../models/MonthlyMember');

// @desc    Get payments for a month
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const { monthId } = req.query;
    if (!monthId) {
      return res.status(400).json({ success: false, message: 'Please provide a monthId' });
    }
    const payments = await Payment.find({ monthId })
      .populate('memberId', 'name phone')
      .sort({ paymentDate: -1 });
    return res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record new payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
  try {
    const { monthId, memberId, amount, paymentDate, note } = req.body;

    if (!monthId || !memberId || !amount) {
      return res.status(400).json({ success: false, message: 'Please provide monthId, memberId and amount' });
    }

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero' });
    }

    // Role check: Normal members can only record payments for themselves
    if (req.user.role !== 'admin' && req.user._id.toString() !== memberId) {
      return res.status(403).json({ success: false, message: 'You can only record payments for yourself' });
    }

    // Check if month budget exists
    const budget = await MonthlyBudget.findById(monthId);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Month budget not found' });
    }

    // Check if member is enrolled in this month
    const enrolledMember = await MonthlyMember.findOne({ monthId, memberId });
    if (!enrolledMember) {
      return res.status(400).json({ success: false, message: 'Member is not enrolled in this month' });
    }

    const payment = await Payment.create({
      monthId,
      memberId,
      amount,
      paymentDate: paymentDate || Date.now(),
      note,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Payment added successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a payment
// @route   PUT /api/payments/:id
// @access  Private/Admin
const updatePayment = async (req, res, next) => {
  try {
    const { amount, paymentDate, note } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
      }
      payment.amount = amount;
    }

    if (paymentDate) payment.paymentDate = paymentDate;
    if (note !== undefined) payment.note = note;

    await payment.save();

    return res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    await payment.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member payment history
// @route   GET /api/payments/member/:memberId
// @access  Private
const getMemberPaymentHistory = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    
    // Normal members can only view their own payment history
    if (req.user.role !== 'admin' && req.user._id.toString() !== memberId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const payments = await Payment.find({ memberId })
      .populate('monthId', 'month year')
      .sort({ paymentDate: -1 });

    return res.status(200).json({
      success: true,
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getMemberPaymentHistory
};
