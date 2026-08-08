const mongoose = require('mongoose');

const monthlyMemberSchema = new mongoose.Schema({
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
  memberNameSnapshot: {
    type: String,
    required: true
  },
  baseAmount: {
    type: Number,
    required: true,
    min: 0
  },
  additionAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  deductionAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalPayable: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Unique index to prevent duplicate member enrollment in the same month
monthlyMemberSchema.index({ monthId: 1, memberId: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyMember', monthlyMemberSchema);
