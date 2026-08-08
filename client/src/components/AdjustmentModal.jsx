import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AdjustmentModal = ({ isOpen, onClose, onSubmit, selectedMember }) => {
  const [type, setType] = useState('ADDITION');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setType('ADDITION');
    setAmount('');
    setReason('');
    setError('');
  }, [selectedMember, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!reason.trim()) {
      setError('Please enter a reason for this adjustment');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        memberId: selectedMember.memberId,
        type,
        amount: parseFloat(amount),
        reason: reason.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add adjustment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="flex justify-between items-center p-5 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Add Adjustment</h3>
            <p className="text-xs text-slate-400 mt-0.5">For {selectedMember?.name}</p>
          </div>
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
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Adjustment Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('ADDITION')}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${
                  type === 'ADDITION'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                ➕ Addition (Charge Extra)
              </button>
              <button
                type="button"
                onClick={() => setType('DEDUCTION')}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${
                  type === 'DEDUCTION'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                ➖ Deduction (Discount)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 300"
              className="glass-input w-full px-3 py-2 rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Paid electricity bill separately"
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
              className="flex-1 py-2 px-4 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 text-white font-semibold rounded-lg transition flex items-center justify-center"
            >
              {loading ? 'Adding...' : 'Apply Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustmentModal;
