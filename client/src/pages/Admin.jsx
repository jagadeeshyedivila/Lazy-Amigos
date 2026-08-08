import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { 
  RefreshCw, 
  Calendar, 
  Trash2, 
  RefreshCw as ResetIcon, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Plus,
  Edit2
} from 'lucide-react';

const Admin = ({ currentMonthId, onMonthAction }) => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Start new month form state
  const [newMonth, setNewMonth] = useState(new Date().getMonth() + 1);
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [baseAmount, setBaseAmount] = useState('2000');

  // Change amount state
  const [changeAmount, setChangeAmount] = useState('');

  // Categories management state
  const [newCatName, setNewCatName] = useState('');
  const [isEditingCat, setIsEditingCat] = useState(null);
  const [editCatName, setEditCatName] = useState('');

  // Reset/Delete modals state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await fetchCategories();
      await fetchMonths();
    } catch (err) {
      setError('Failed to fetch admin settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await api.get('/expense-categories');
    setCategories(res.data.data);
  };

  const fetchMonths = async () => {
    const res = await api.get('/months');
    setMonths(res.data.data);
  };

  const handleStartMonth = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!baseAmount || parseFloat(baseAmount) < 0) {
      setError('Please provide a valid contribution amount');
      return;
    }

    try {
      await api.post('/months', {
        month: parseInt(newMonth),
        year: parseInt(newYear),
        monthlyAmount: parseFloat(baseAmount)
      });
      showSuccess('Month started successfully! Roommates enrolled.');
      await fetchMonths();
      if (onMonthAction) onMonthAction();
    } catch (err) {
      setError(err.message || 'Failed to start month');
    }
  };

  const handleChangeAmountSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!changeAmount || parseFloat(changeAmount) < 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      await api.put(`/months/${currentMonthId}`, {
        monthlyAmount: parseFloat(changeAmount)
      });
      showSuccess('Monthly base amount changed successfully!');
      setChangeAmount('');
      if (onMonthAction) onMonthAction();
    } catch (err) {
      setError(err.message || 'Failed to change monthly amount');
    }
  };

  const handleResetConfirm = async () => {
    try {
      await api.post(`/months/${currentMonthId}/reset`);
      showSuccess('Month data reset successfully! All payments and expenses cleared.');
      if (onMonthAction) onMonthAction();
    } catch (err) {
      setError(err.message || 'Failed to reset month');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/months/${currentMonthId}`);
      showSuccess('Month deleted successfully!');
      await fetchMonths();
      if (onMonthAction) onMonthAction();
    } catch (err) {
      setError(err.message || 'Failed to delete month');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await api.post('/expense-categories', { name: newCatName.trim() });
      setNewCatName('');
      showSuccess('Category added!');
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to add category');
    }
  };

  const handleToggleCategory = async (cat) => {
    try {
      const newStatus = !cat.isActive;
      await api.patch(`/expense-categories/${cat._id}/status`, { isActive: newStatus });
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to toggle category');
    }
  };

  const handleRenameCategory = async (e) => {
    e.preventDefault();
    if (!editCatName.trim() || !isEditingCat) return;

    try {
      await api.put(`/expense-categories/${isEditingCat._id}`, { name: editCatName.trim() });
      setIsEditingCat(null);
      setEditCatName('');
      showSuccess('Category renamed!');
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to rename category');
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const getMonthName = (monthNum) => {
    const names = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return names[monthNum - 1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  const selectedMonthObj = months.find(m => m._id === currentMonthId);
  const selectedMonthName = selectedMonthObj 
    ? `${getMonthName(selectedMonthObj.month)} ${selectedMonthObj.year}` 
    : 'Selected Month';

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">👑 Boss Mode</h2>
        <p className="text-brand-400 text-sm font-semibold">Configure roommates, bokka details, and erase evidence. 😂</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-brand-400" />
              💸 Start Another Financial Disaster
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              New month, same amigos, same money problems. 😂
            </p>
            <form onSubmit={handleStartMonth} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Month</label>
                  <select
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-lg bg-slate-900 border-slate-700 text-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {getMonthName(i + 1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="2026"
                    className="glass-input w-full px-3 py-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase">Base Amount (₹)</label>
                <input
                  type="number"
                  value={baseAmount}
                  onChange={(e) => setBaseAmount(e.target.value)}
                  placeholder="2000"
                  className="glass-input w-full px-3 py-2 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition cursor-pointer"
              >
                Let's Start The Damage 💸
              </button>
            </form>
          </div>

          {selectedMonthObj && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">
                💰 Set Monthly Damage
              </h3>
              <p className="text-xs text-slate-400">
                Ee month entha bokka ra? 😂 (Current base: <strong>₹{selectedMonthObj.monthlyAmount}</strong>)
              </p>
              <form onSubmit={handleChangeAmountSubmit} className="space-y-3">
                <input
                  type="number"
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(e.target.value)}
                  placeholder="New Damage Amount (e.g. 2200)"
                  className="glass-input w-full px-3 py-2 rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-lg transition cursor-pointer"
                >
                  Change Base Damage 💸
                </button>
              </form>
            </div>
          )}

          {selectedMonthObj && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-rose-455 flex items-center">
                <Trash2 className="w-5 h-5 mr-2 animate-pulse" />
                Danger Zone
              </h3>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setIsResetOpen(true)}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 font-bold rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ResetIcon className="w-4 h-4" />
                  <span>🗑️ Ee Month Evidence Erase Chey</span>
                </button>
                <button
                  onClick={() => setIsDeleteOpen(true)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>💀 Ee Month Ni History Nundi Champeddama?</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Tag className="w-5 h-5 mr-2 text-brand-400" />
            Expense Categories
          </h3>

          <form onSubmit={handleAddCategory} className="flex space-x-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New category name"
              className="glass-input flex-1 px-3 py-2 rounded-lg text-sm"
            />
            <button
              type="submit"
              className="py-2 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {isEditingCat && (
            <form onSubmit={handleRenameCategory} className="flex space-x-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <input
                type="text"
                value={editCatName}
                onChange={(e) => setEditCatName(e.target.value)}
                placeholder="Rename category"
                className="glass-input flex-1 px-3 py-2 rounded-lg text-sm"
              />
              <button
                type="submit"
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingCat(null)}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-350 rounded-lg text-xs font-bold transition"
              >
                Cancel
              </button>
            </form>
          )}

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/20 border border-slate-800/60"
              >
                <div>
                  <span className={`font-medium ${cat.isActive ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                    {cat.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => { setIsEditingCat(cat); setEditCatName(cat.name); }}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleCategory(cat)}
                    className={`py-1 px-2.5 rounded-lg text-[10px] font-bold border transition ${
                      cat.isActive
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-455 hover:bg-rose-500/20'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-455 hover:bg-emerald-500/20'
                    }`}
                  >
                    {cat.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetConfirm}
        title="🗑️ Ee Month Evidence Erase Chey"
        message={`⚠️ Orey...\n\nEe month payments, expenses and adjustments anni delete aipothayi. Tarvata "naa data ekkada?" ani adagakandi. 😂\n\nAre you sure?`}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="💀 Ee Month Ni History Nundi Champeddama?"
        message={`Once delete chesthe...\n\nEe month financial records permanently pothayi. Think twice ra. 👀`}
        requireTextConfirm="DELETE"
      />
    </div>
  );
};

export default Admin;
