const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  monthId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MonthlyBudget',
    required: true
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['ADDITION', 'DEDUCTION'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an adjustment amount'],
    min: [0.01, 'Amount must be greater than zero']
  },
  reason: {
    type: String,
    required: [true, 'Please add a reason for adjustment'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
adjustmentSchema.index({ monthId: 1 });
adjustmentSchema.index({ memberId: 1 });

module.exports = mongoose.model('Adjustment', adjustmentSchema);
