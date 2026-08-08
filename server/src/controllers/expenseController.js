const Expense = require('../models/Expense');
const MonthlyBudget = require('../models/MonthlyBudget');

// @desc    Get all expenses for a month
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const { monthId } = req.query;
    if (!monthId) {
      return res.status(400).json({ success: false, message: 'Please provide a monthId' });
    }
    const expenses = await Expense.find({ monthId })
      .populate('paidBy', 'name phone')
      .sort({ expenseDate: -1 });
    return res.status(200).json({
      success: true,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const { monthId, expenseType, category, amount, description, paidBy, expenseDate } = req.body;

    if (!monthId || !expenseType || !category || !amount || !description || !paidBy) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: 'Expense amount must be greater than zero' });
    }

    if (!['ROOM', 'OWN'].includes(expenseType)) {
      return res.status(400).json({ success: false, message: 'Invalid expense type. Must be ROOM or OWN.' });
    }

    // Check if month exists
    const budget = await MonthlyBudget.findById(monthId);
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Month budget not found' });
    }

    const expense = await Expense.create({
      monthId,
      expenseType,
      category,
      amount,
      description,
      paidBy,
      expenseDate: expenseDate || Date.now(),
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    const { expenseType, category, amount, description, paidBy, expenseDate } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Access control: Admin can update any. Member can only update if they created it.
    if (req.user.role !== 'admin' && expense.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only edit expenses you created' });
    }

    if (expenseType) {
      if (!['ROOM', 'OWN'].includes(expenseType)) {
        return res.status(400).json({ success: false, message: 'Invalid expense type' });
      }
      expense.expenseType = expenseType;
    }

    if (category) expense.category = category;
    
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be greater than zero' });
      }
      expense.amount = amount;
    }

    if (description) expense.description = description;
    if (paidBy) expense.paidBy = paidBy;
    if (expenseDate) expense.expenseDate = expenseDate;

    await expense.save();

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    // Access control: Admin can delete any. Member can only delete if they created it.
    if (req.user.role !== 'admin' && expense.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only delete expenses you created' });
    }

    await expense.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense
};
