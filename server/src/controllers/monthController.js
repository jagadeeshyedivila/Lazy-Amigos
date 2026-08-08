const MonthlyBudget = require('../models/MonthlyBudget');
const MonthlyMember = require('../models/MonthlyMember');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const Adjustment = require('../models/Adjustment');
const { getMonthlyDashboard } = require('../services/dashboardService');

// @desc    Get all months
// @route   GET /api/months
// @access  Private
const getMonths = async (req, res, next) => {
  try {
    const budgets = await MonthlyBudget.find({}).sort({ year: -1, month: -1 });
    return res.status(200).json({
      success: true,
      data: budgets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start new month
// @route   POST /api/months
// @access  Private/Admin
const startNewMonth = async (req, res, next) => {
  try {
    const { month, year, monthlyAmount } = req.body;

    if (!month || !year || !monthlyAmount) {
      return res.status(400).json({ success: false, message: 'Please provide month, year and monthly amount' });
    }

    // Check if month already exists
    const monthExists = await MonthlyBudget.findOne({ month, year });
    if (monthExists) {
      return res.status(400).json({ success: false, message: 'This month configuration already exists' });
    }

    // Get all active members (role: 'member')
    const activeMembers = await User.find({ role: 'member', isActive: true });

    if (activeMembers.length === 0) {
      return res.status(400).json({ success: false, message: 'No active members found to enroll' });
    }

    // Create the MonthlyBudget
    const budget = await MonthlyBudget.create({
      month,
      year,
      monthlyAmount,
      status: 'OPEN'
    });

    // Create snapshots for all active members
    const enrolledMembers = [];
    for (const member of activeMembers) {
      const mm = await MonthlyMember.create({
        monthId: budget._id,
        memberId: member._id,
        memberNameSnapshot: member.name,
        baseAmount: monthlyAmount,
        additionAmount: 0,
        deductionAmount: 0,
        finalPayable: monthlyAmount
      });
      enrolledMembers.push(mm);
    }

    return res.status(201).json({
      success: true,
      message: 'Month started successfully',
      data: {
        budget,
        enrolledCount: enrolledMembers.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update monthly amount
// @route   PUT /api/months/:id
// @access  Private/Admin
const updateMonthlyAmount = async (req, res, next) => {
  try {
    const { monthlyAmount } = req.body;
    if (monthlyAmount === undefined || monthlyAmount < 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid monthly amount' });
    }

    const budget = await MonthlyBudget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Month budget not found' });
    }

    budget.monthlyAmount = monthlyAmount;
    await budget.save();

    // Update all MonthlyMembers baseAmount and finalPayable for this month
    const monthlyMembers = await MonthlyMember.find({ monthId: budget._id });
    for (const member of monthlyMembers) {
      member.baseAmount = monthlyAmount;
      member.finalPayable = monthlyAmount + member.additionAmount - member.deductionAmount;
      await member.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Monthly amount updated successfully',
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset current month data
// @route   POST /api/months/:id/reset
// @access  Private/Admin
const resetMonth = async (req, res, next) => {
  try {
    const budget = await MonthlyBudget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Month budget not found' });
    }

    // Delete payments, expenses, adjustments
    await Payment.deleteMany({ monthId: budget._id });
    await Expense.deleteMany({ monthId: budget._id });
    await Adjustment.deleteMany({ monthId: budget._id });

    // Reset MonthlyMembers additions, deductions, finalPayable
    const monthlyMembers = await MonthlyMember.find({ monthId: budget._id });
    for (const member of monthlyMembers) {
      member.additionAmount = 0;
      member.deductionAmount = 0;
      member.finalPayable = member.baseAmount;
      await member.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Month reset successfully. All payments, expenses, and adjustments have been cleared.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a month entirely
// @route   DELETE /api/months/:id
// @access  Private/Admin
const deleteMonth = async (req, res, next) => {
  try {
    const budget = await MonthlyBudget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Month budget not found' });
    }

    // Delete everything associated with this month
    await Payment.deleteMany({ monthId: budget._id });
    await Expense.deleteMany({ monthId: budget._id });
    await Adjustment.deleteMany({ monthId: budget._id });
    await MonthlyMember.deleteMany({ monthId: budget._id });
    await budget.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Month and all of its financial records deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics for a month
// @route   GET /api/months/:id/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const dashboardData = await getMonthlyDashboard(req.params.id);
    return res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMonths,
  startNewMonth,
  updateMonthlyAmount,
  resetMonth,
  deleteMonth,
  getDashboard
};
