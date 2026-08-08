const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, 'Please add a payment amount'],
    min: [0.01, 'Amount must be greater than zero']
  },
  paymentDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  note: {
    type: String,
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

// Indexes for database optimization
paymentSchema.index({ monthId: 1 });
paymentSchema.index({ memberId: 1 });
paymentSchema.index({ paymentDate: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
