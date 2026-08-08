import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSubmit, members, selectedMember, currentUser }) => {
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (selectedMember) {
      setMemberId(selectedMember.memberId || selectedMember._id);
    } else if (!isAdmin && currentUser) {
      setMemberId(currentUser._id);
    } else {
      setMemberId('');
    }
    setAmount('');
    setNote('');
    setError('');
  }, [selectedMember, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!memberId) {
      setError('Please select a member');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than zero');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        memberId,
        amount: parseFloat(amount),
        paymentDate,
        note
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="flex justify-between items-center p-5 border-b border-slate-800">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white">💸 Entha vesav ra?</h3>
            <span className="text-[10px] text-brand-400 font-semibold mt-0.5">Room ki share ivvadam kuda oka achievement eh.</span>
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
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Member</label>
            {isAdmin ? (
              <select
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-lg bg-slate-900 border-slate-700 text-white"
              >
                <option value="">Select Member</option>
                {members.map((m) => (
                  <option key={m.memberId || m._id} value={m.memberId || m._id}>
                    {m.name || m.memberNameSnapshot}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={currentUser?.name || ''}
                disabled
                className="glass-input w-full px-3 py-2 rounded-lg bg-slate-950 border-slate-800 text-slate-400 cursor-not-allowed"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 2000"
              className="glass-input w-full px-3 py-2 rounded-lg"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Payment Date</label>
            <div className="relative">
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="glass-input w-full px-3 py-2 pl-10 rounded-lg"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. GPay / Cash / Split electricity"
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
              {loading ? 'Kattesa Bro...' : 'Kattesa Bro 💸'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
