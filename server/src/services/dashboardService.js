const MonthlyBudget = require('../models/MonthlyBudget');
const MonthlyMember = require('../models/MonthlyMember');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');

const getMonthlyDashboard = async (monthId) => {
  // 1. Get Monthly Budget
  const budget = await MonthlyBudget.findById(monthId);
  if (!budget) {
    const error = new Error('Monthly budget configuration not found');
    error.statusCode = 404;
    throw error;
  }

  const monthNameMap = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = `${monthNameMap[budget.month - 1]} ${budget.year}`;

  // 2. Get Monthly Members snapshot for this month
  const monthlyMembers = await MonthlyMember.find({ monthId });
  const memberCount = monthlyMembers.length;

  // 3. Get Payments
  const payments = await Payment.find({ monthId });

  // 4. Get Expenses
  const expenses = await Expense.find({ monthId });

  // Calculate totals
  const expectedCollection = monthlyMembers.reduce((sum, m) => sum + m.finalPayable, 0);
  const collected = payments.reduce((sum, p) => sum + p.amount, 0);

  const roomExpenses = expenses
    .filter(e => e.expenseType === 'ROOM')
    .reduce((sum, e) => sum + e.amount, 0);

  const ownExpenses = expenses
    .filter(e => e.expenseType === 'OWN')
    .reduce((sum, e) => sum + e.amount, 0);

  const roomBalance = collected - roomExpenses;

  // Calculate member-wise status
  const memberDetails = monthlyMembers.map(m => {
    // Get all payments for this member
    const memberPayments = payments.filter(p => p.memberId.toString() === m.memberId.toString());
    const paid = memberPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const finalPayable = m.finalPayable;
    const remaining = paid < finalPayable ? finalPayable - paid : 0;
    const extra = paid > finalPayable ? paid - finalPayable : 0;

    let status = 'PENDING';
    if (paid >= finalPayable) {
      status = 'PAID';
    } else if (paid > 0) {
      status = 'PARTIAL';
    }

    return {
      monthlyMemberId: m._id,
      memberId: m.memberId,
      name: m.memberNameSnapshot,
      baseAmount: m.baseAmount,
      additionAmount: m.additionAmount,
      deductionAmount: m.deductionAmount,
      finalPayable,
      paid,
      remaining,
      extra,
      status
    };
  });

  const pending = memberDetails.reduce((sum, m) => sum + m.remaining, 0);

  return {
    monthId: budget._id,
    month: monthName,
    monthNum: budget.month,
    year: budget.year,
    monthlyAmount: budget.monthlyAmount,
    status: budget.status,
    memberCount,
    expectedCollection,
    collected,
    pending,
    roomExpenses,
    roomBalance,
    ownExpenses,
    members: memberDetails,
    expenses
  };
};

module.exports = { getMonthlyDashboard };
