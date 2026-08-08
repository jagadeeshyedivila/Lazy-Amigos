const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  monthId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MonthlyBudget',
    required: true
  },
  expenseType: {
    type: String,
    enum: ['ROOM', 'OWN'],
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please select or enter a category'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an expense amount'],
    min: [0.01, 'Amount must be greater than zero']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please add an expense description']
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expenseDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for database optimization
expenseSchema.index({ monthId: 1 });
expenseSchema.index({ expenseType: 1 });
expenseSchema.index({ expenseDate: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
