const mongoose = require('mongoose');

const monthlyBudgetSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: [true, 'Please add a month (1-12)'],
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: [true, 'Please add a year']
  },
  monthlyAmount: {
    type: Number,
    required: [true, 'Please add the base monthly contribution amount'],
    min: 0
  },
  status: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  }
}, {
  timestamps: true
});

// Unique index on month + year to prevent duplicate budget configuration for the same month
monthlyBudgetSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyBudget', monthlyBudgetSchema);
