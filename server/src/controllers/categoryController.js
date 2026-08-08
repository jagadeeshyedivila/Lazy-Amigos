const ExpenseCategory = require('../models/ExpenseCategory');

// @desc    Get all categories
// @route   GET /api/expense-categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await ExpenseCategory.find({}).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/expense-categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a category name' });
    }

    const category = await ExpenseCategory.create({
      name: name.trim(),
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Rename)
// @route   PUT /api/expense-categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide a category name' });
    }

    const category = await ExpenseCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.name = name.trim();
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle category status (Active/Inactive)
// @route   PATCH /api/expense-categories/:id/status
// @access  Private/Admin
const toggleCategoryStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (isActive === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide isActive status' });
    }

    const category = await ExpenseCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.isActive = isActive;
    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category status updated to ${isActive ? 'Active' : 'Inactive'}`,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus
};
