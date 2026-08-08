import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { RefreshCw, Trash2, Calendar, ShoppingBag, User, Tag, HelpCircle } from 'lucide-react';

const Expenses = ({ monthId }) => {
  const { user, isAdmin } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [activeTab, setActiveTab] = useState('ROOM');
  const [filterCategory, setFilterCategory] = useState('');

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    if (monthId) {
      fetchExpenses();
      fetchCategories();
    }
  }, [monthId]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/expenses?monthId=${monthId}`);
      setExpenses(res.data.data);
    } catch (err) {
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/expense-categories');
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDelete = (id) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/expenses/${deletingId}`);
      setSuccess('Expense deleted successfully!');
      fetchExpenses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
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

  const filteredExpenses = expenses.filter((e) => {
    const matchesTab = e.expenseType === activeTab;
    const matchesCategory = filterCategory ? e.category === filterCategory : true;
    return matchesTab && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const canDelete = (expense) => {
    if (isAdmin) return true;
    return expense.createdBy === user?._id;
  };

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
          <h2 className="text-2xl font-extrabold text-white tracking-tight">🧾 Dabbulu ekkadiki poyayi ra?</h2>
          <p className="text-brand-400 text-sm font-semibold">Bill vachinda? Ikada vey ra. 😂</p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Tag className="w-4 h-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-lg text-sm bg-slate-900 border-slate-700 text-white font-medium cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
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

      <div className="border-b border-slate-800">
        <div className="flex space-x-6 text-sm font-semibold">
          <button
            onClick={() => { setActiveTab('ROOM'); setFilterCategory(''); }}
            className={`pb-4 border-b-2 transition ${
              activeTab === 'ROOM'
                ? 'border-brand-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex flex-col items-start">
              <span>🏠 Mana Andaridi</span>
              <span className="text-[10px] font-normal text-slate-500">Common room pool ra.</span>
            </div>
          </button>
          <button
            onClick={() => { setActiveTab('OWN'); setFilterCategory(''); }}
            className={`pb-4 border-b-2 transition ${
              activeTab === 'OWN'
                ? 'border-brand-500 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex flex-col items-start">
              <span>👤 Nee Own Gola</span>
              <span className="text-[10px] font-normal text-slate-505">Nee dabbu. Nee bokka. 😂</span>
            </div>
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl flex justify-between items-center bg-slate-900/30 border border-slate-800/80">
        <span className="text-slate-400 text-sm font-medium">
          Total {activeTab === 'ROOM' ? 'Room' : 'Own'} Expenses in View:
        </span>
        <span className={`text-xl font-bold ${activeTab === 'ROOM' ? 'text-amber-400' : 'text-fuchsia-400'}`}>
          ₹{totalAmount.toLocaleString()}
        </span>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="glass-panel p-10 text-center text-slate-350 font-bold rounded-2xl whitespace-pre-line">
          😳 Wowww...
          {"\n"}Inka expenses emi levu.
          {"\n\n"}<span className="text-slate-500 font-semibold text-xs">Idi nijama? Leka evaru enter cheyyaledaa? 👀</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map((exp) => (
            <div
              key={exp._id}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-slate-800 shadow-md space-y-4 hover:border-slate-700/80 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-855 text-[10px] font-bold rounded text-slate-400 uppercase tracking-wider">
                    {exp.category}
                  </span>
                  <h4 className="text-white font-bold text-base mt-2">{exp.description}</h4>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-extrabold ${activeTab === 'ROOM' ? 'text-amber-400' : 'text-fuchsia-400'}`}>
                    ₹{exp.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-805">
                <div className="flex flex-col space-y-1">
                  <span className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Paid by: <strong className="text-slate-300 ml-1">{exp.paidBy?.name || 'Unknown'}</strong>
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {formatDate(exp.expenseDate)}
                  </span>
                </div>

                {canDelete(exp) && (
                  <button
                    onClick={() => handleOpenDelete(exp._id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-405 hover:text-rose-350 transition"
                    title="Delete Expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Log"
        message="Are you sure you want to permanently delete this expense log? This action will adjust the room balance totals immediately."
      />
    </div>
  );
};

export default Expenses;
