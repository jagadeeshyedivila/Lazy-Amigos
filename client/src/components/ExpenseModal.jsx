import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const ExpenseModal = ({ isOpen, onClose, onSubmit, members, categories, currentUser }) => {
  const [expenseType, setExpenseType] = useState('ROOM');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setExpenseType('ROOM');
    setCategory('');
    setAmount('');
    setDescription('');
    setPaidBy(currentUser?._id || '');
    setError('');
  }, [currentUser, isOpen]);

  // Set default category when categories list loads
  useEffect(() => {
    const activeCats = categories.filter(c => c.isActive);
    if (activeCats.length > 0 && !category) {
      setCategory(activeCats[0].name);
    }
  }, [categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!expenseType) {
      setError('Please select an expense type');
      return;
    }
    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than zero');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!paidBy) {
      setError('Please select who paid this expense');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        expenseType,
        category,
        amount: parseFloat(amount),
        description: description.trim(),
        paidBy,
        expenseDate
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const activeCategories = categories.filter(c => c.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="flex justify-between items-center p-5 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">🧾 Ekkada mingindi dabbu?</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Expense Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setExpenseType('ROOM')}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${
                  expenseType === 'ROOM'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🏠 Mana Andaridi
              </button>
              <button
                type="button"
                onClick={() => setExpenseType('OWN')}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${
                  expenseType === 'OWN'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                👤 Nee Own Gola
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold italic">
              {expenseType === 'ROOM'
                ? 'Common room money nundi pothundi ra.'
                : 'Nee dabbu. Nee problem. 😂'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-lg bg-slate-900 border-slate-700 text-white"
            >
              {activeCategories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1500"
              className="glass-input w-full px-3 py-2 rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Paid By</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="glass-input w-full px-3 py-2 rounded-lg bg-slate-900 border-slate-700 text-white"
            >
              <option value="">Select Roommate</option>
              {members.map((m) => (
                <option key={m.memberId || m._id} value={m.memberId || m._id}>
                  {m.name || m.memberNameSnapshot}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Date</label>
            <div className="relative">
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="glass-input w-full px-3 py-2 pl-10 rounded-lg"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Internet bill / Rahul snacks"
              className="glass-input w-full px-3 py-2 rounded-lg"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 text-white font-semibold rounded-lg transition flex items-center justify-center cursor-pointer"
            >
              {loading ? 'Adding...' : 'Add Chey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
