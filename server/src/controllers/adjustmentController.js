const Adjustment = require('../models/Adjustment');
const MonthlyMember = require('../models/MonthlyMember');
const MonthlyBudget = require('../models/MonthlyBudget');

const updateMonthlyMemberTotals = async (monthId, memberId) => {
  const adjustments = await Adjustment.find({ monthId, memberId });
  const additionAmount = adjustments
    .filter(a => a.type === 'ADDITION')
    .reduce((sum, a) => sum + a.amount, 0);
  const deductionAmount = adjustments
    .filter(a => a.type === 'DEDUCTION')
    .reduce((sum, a) => sum + a.amount, 0);

  const monthlyMember = await MonthlyMember.findOne({ monthId, memberId });
  if (monthlyMember) {
    monthlyMember.additionAmount = additionAmount;
    monthlyMember.deductionAmount = deductionAmount;
    monthlyMember.finalPayable = Math.max(0, monthlyMember.baseAmount + additionAmount - deductionAmount);
    await monthlyMember.save();
  }
};

// @desc    Get adjustments for a month
// @route   GET /api/adjustments
// @access  Private
const getAdjustments = async (req, res, next) => {
  try {
    const { monthId } = req.query;
    if (!monthId) {
      return res.status(400).json({ success: false, message: 'Please provide a monthId' });
    }
    const adjustments = await Adjustment.find({ monthId })
      .populate('memberId', 'name phone')
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: adjustments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new adjustment
// @route   POST /api/adjustments
// @access  Private/Admin
const createAdjustment = async (req, res, next) => {
  try {
    const { monthId, memberId, type, amount, reason } = req.body;

    if (!monthId || !memberId || !type || !amount || !reason) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Adjustment amount must be greater than zero' });
    }

    if (!['ADDITION', 'DEDUCTION'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type. Must be ADDITION or DEDUCTION.' });
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

    const adjustment = await Adjustment.create({
      monthId,
      memberId,
      type,
      amount,
      reason,
      createdBy: req.user._id
    });

    // Update totals on MonthlyMember
    await updateMonthlyMemberTotals(monthId, memberId);

    return res.status(201).json({
      success: true,
      message: 'Adjustment added successfully',
      data: adjustment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update adjustment
// @route   PUT /api/adjustments/:id
// @access  Private/Admin
const updateAdjustment = async (req, res, next) => {
  try {
    const { type, amount, reason } = req.body;
    const adjustment = await Adjustment.findById(req.params.id);

    if (!adjustment) {
      return res.status(404).json({ success: false, message: 'Adjustment not found' });
    }

    if (type) {
      if (!['ADDITION', 'DEDUCTION'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid type' });
      }
      adjustment.type = type;
    }

    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
      }
      adjustment.amount = amount;
    }

    if (reason) adjustment.reason = reason;

    await adjustment.save();

    // Update totals on MonthlyMember
    await updateMonthlyMemberTotals(adjustment.monthId, adjustment.memberId);

    return res.status(200).json({
      success: true,
      message: 'Adjustment updated successfully',
      data: adjustment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete adjustment
// @route   DELETE /api/adjustments/:id
// @access  Private/Admin
const deleteAdjustment = async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ success: false, message: 'Adjustment not found' });
    }

    const { monthId, memberId } = adjustment;
    await adjustment.deleteOne();

    // Update totals on MonthlyMember
    await updateMonthlyMemberTotals(monthId, memberId);

    return res.status(200).json({
      success: true,
      message: 'Adjustment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdjustments,
  createAdjustment,
  updateAdjustment,
  deleteAdjustment
};
