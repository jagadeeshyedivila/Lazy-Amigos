import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { RefreshCw, Trash2, Calendar, User, IndianRupee, FileText } from 'lucide-react';

const Payments = ({ monthId }) => {
  const { user, isAdmin } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [filterMember, setFilterMember] = useState('');

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    if (monthId) {
      fetchPayments();
    }
  }, [monthId]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/payments?monthId=${monthId}`);
      setPayments(res.data.data);
    } catch (err) {
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/payments/${deletingId}`);
      setSuccess('Payment deleted successfully!');
      fetchPayments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete payment');
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredPayments = filterMember
    ? payments.filter((p) => p.memberId?._id === filterMember)
    : payments;

  const payingMembers = Array.from(
    new Map(
      payments
        .filter((p) => p.memberId)
        .map((p) => [p.memberId._id, p.memberId])
    ).values()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">💸 Entha vesav ra?</h2>
          <p className="text-brand-400 text-sm font-semibold">Room ki share ivvadam kuda oka achievement eh. 😂</p>
        </div>

        {payments.length > 0 && (
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <User className="w-4 h-4 text-slate-400" />
            <select
              value={filterMember}
              onChange={(e) => setFilterMember(e.target.value)}
              className="glass-input px-3 py-1.5 rounded-lg text-sm bg-slate-900 border-slate-700 text-white font-medium cursor-pointer"
            >
              <option value="">All Roommates</option>
              {payingMembers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
          {error}
        </div>
      )}

      {filteredPayments.length === 0 ? (
        <div className="glass-panel p-10 text-center text-rose-450 font-bold rounded-2xl">
          💀 Inka okkadu kuda dabbu veyyaledu ra. Andaru silent mode lo unnaru.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                  <th className="p-4">Date</th>
                  <th className="p-4">Roommate</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Note</th>
                  {isAdmin && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-350 text-sm">
                {filteredPayments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/25 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>{formatDate(p.paymentDate)}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {p.memberId?.name || 'Unknown'}
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{p.note || 'No notes'}</span>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOpenDelete(p._id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-450 hover:text-rose-350 transition"
                          title="Delete Payment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Payment Transaction"
        message="Are you sure you want to permanently delete this payment transaction? This action will subtract this amount from the roommate's contribution balance and cannot be undone."
      />
    </div>
  );
};

export default Payments;
