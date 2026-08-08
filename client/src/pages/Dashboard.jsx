import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import DashboardCard from '../components/DashboardCard';
import MemberPaymentCard from '../components/MemberPaymentCard';
import MonthSelector from '../components/MonthSelector';
import PaymentModal from '../components/PaymentModal';
import ExpenseModal from '../components/ExpenseModal';
import AdjustmentModal from '../components/AdjustmentModal';
import { generateWhatsAppReport, shareToWhatsApp } from '../utils/whatsapp';
import { getRandomLoader } from '../constants/funMessages';
import { 
  Coins, 
  Wallet, 
  Hourglass, 
  TrendingUp, 
  UserCheck, 
  ShoppingBag, 
  Share2, 
  Copy, 
  PlusCircle, 
  Plus,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const Dashboard = ({ globalMonthId, onMonthChange, monthsList }) => {
  const { user, isAdmin } = useContext(AuthContext);
  const [months, setMonths] = useState([]);
  const [selectedMonthId, setSelectedMonthId] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Success message state
  const [successMsg, setSuccessMsg] = useState('');

  // Loader message cache
  const [loaderMessage, setLoaderMessage] = useState('');

  // Use props if provided, otherwise fallback to local state
  const activeMonthId = globalMonthId || selectedMonthId;
  const activeMonths = monthsList || months;
  const handleMonthChange = onMonthChange || setSelectedMonthId;

  useEffect(() => {
    setLoaderMessage(getRandomLoader());
    fetchInitialData();
  }, [monthsList]);

  useEffect(() => {
    if (activeMonthId) {
      fetchDashboard(activeMonthId);
    }
  }, [activeMonthId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      if (!monthsList) {
        const monthsRes = await api.get('/months');
        setMonths(monthsRes.data.data);
        if (monthsRes.data.data.length > 0) {
          setSelectedMonthId(monthsRes.data.data[0]._id);
        }
      }
      const catsRes = await api.get('/expense-categories');
      setCategories(catsRes.data.data);
    } catch (err) {
      setError('Failed to load roommate data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async (monthId) => {
    try {
      const res = await api.get(`/months/${monthId}/dashboard`);
      setDashboardData(res.data.data);
    } catch (err) {
      setError('Failed to load monthly calculations');
      console.error(err);
    }
  };

  const handleAddPayment = (member) => {
    setSelectedMember(member);
    setIsPaymentOpen(true);
  };

  const handleAddAdjustment = (member) => {
    setSelectedMember(member);
    setIsAdjustmentOpen(true);
  };

  const handlePaymentSubmit = async (data) => {
    await api.post('/payments', { ...data, monthId: activeMonthId });
    showSuccess('✅ Finallyyyy! Dabbulu vachayi ra.');
    fetchDashboard(activeMonthId);
  };

  const handleExpenseSubmit = async (data) => {
    await api.post('/expenses', { ...data, monthId: activeMonthId });
    showSuccess('😂 Sare ra, inkoka expense mana account lo.');
    fetchDashboard(activeMonthId);
  };

  const handleAdjustmentSubmit = async (data) => {
    await api.post('/adjustments', { ...data, monthId: activeMonthId });
    showSuccess('✅ Amount update ayyindi. Ippudu andariki cheppali. 👀');
    fetchDashboard(activeMonthId);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCopyReport = () => {
    if (!dashboardData) return;
    const text = generateWhatsAppReport(dashboardData);
    navigator.clipboard.writeText(text);
    showSuccess('Report copied to clipboard! Group lo share chesey ra.');
  };

  const handleShareReport = () => {
    if (!dashboardData) return;
    const text = generateWhatsAppReport(dashboardData);
    shareToWhatsApp(text);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-slate-400 text-sm font-semibold animate-pulse">{loaderMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">🏠 Lazy Amigos</h2>
          <p className="text-brand-400 text-sm font-semibold">Evadu kattadu ra ee month? 😂</p>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {!globalMonthId && activeMonths.length > 0 && (
            <MonthSelector
              months={activeMonths}
              selectedMonthId={activeMonthId}
              onChange={handleMonthChange}
            />
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl animate-pulse font-medium">
          {successMsg}
        </div>
      )}

      {/* Empty / Success State Banners */}
      {dashboardData && dashboardData.collected === 0 && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-2xl text-center font-bold">
          💀 Inka okkadu kuda dabbu veyyaledu ra. Andaru silent mode lo unnaru.
        </div>
      )}
      {dashboardData && dashboardData.collected > 0 && dashboardData.pending === 0 && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-2xl text-center font-bold flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-bounce" />
          <span>🔥 AREY WAHHH! Andaru kattesaara? Idi Lazy Amigos history lo rare moment. 🫡</span>
        </div>
      )}

      {dashboardData && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <DashboardCard
            title="Ee Month Share"
            value={`₹${dashboardData.monthlyAmount.toLocaleString()}`}
            subtitle={`${dashboardData.memberCount} Amigos`}
            icon={TrendingUp}
            color="brand"
          />
          <DashboardCard
            title="💰 Mana daggara undalsina amount"
            value={`₹${dashboardData.expectedCollection.toLocaleString()}`}
            subtitle="Expected Collection"
            icon={Coins}
            color="purple"
          />
          <DashboardCard
            title="🤑 Actually vachina amount"
            value={`₹${dashboardData.collected.toLocaleString()}`}
            subtitle="Collected"
            icon={Wallet}
            color="green"
          />
          <DashboardCard
            title="🏃 Inka raavali"
            value={`₹${dashboardData.pending.toLocaleString()}`}
            subtitle="Pending"
            icon={Hourglass}
            color="red"
          />
          <DashboardCard
            title="🧾 Dabbulu mingesina expenses"
            value={`₹${dashboardData.roomExpenses.toLocaleString()}`}
            subtitle="Room Expenses"
            icon={ShoppingBag}
            color="amber"
          />
          <DashboardCard
            title="💸 Migilina mana dabbu"
            value={`₹${dashboardData.roomBalance.toLocaleString()}`}
            subtitle="Room Balance"
            icon={UserCheck}
            color="blue"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => { setSelectedMember(null); setIsPaymentOpen(true); }}
          className="flex items-center space-x-1.5 py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-brand-600/15 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Kattesa Bro 💸</span>
        </button>
        <button
          onClick={() => setIsExpenseOpen(true)}
          className="flex items-center space-x-1.5 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold border border-slate-700 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Dabbulu Mingipoyayi</span>
        </button>
        <button
          onClick={handleCopyReport}
          className="flex items-center space-x-1.5 py-2.5 px-4 bg-slate-850 hover:bg-slate-800 text-slate-355 rounded-xl text-sm font-bold transition border border-slate-800 cursor-pointer"
        >
          <Copy className="w-4 h-4" />
          <span>Copy Report</span>
        </button>
        <button
          onClick={handleShareReport}
          className="flex items-center space-x-1.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-emerald-600/15 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Share WhatsApp</span>
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">👀 Evaru kattaru? Evaru escape?</h3>
        {dashboardData?.members?.length === 0 ? (
          <div className="glass-panel p-6 text-center text-slate-500 rounded-2xl">
            No enrolled members found for this month.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dashboardData?.members.map((member) => (
              <MemberPaymentCard
                key={member.memberId}
                member={member}
                onAddPayment={handleAddPayment}
                onAddAdjustment={handleAddAdjustment}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSubmit={handlePaymentSubmit}
        members={dashboardData?.members || []}
        selectedMember={selectedMember}
        currentUser={user}
      />

      <ExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onSubmit={handleExpenseSubmit}
        members={dashboardData?.members || []}
        categories={categories}
        currentUser={user}
      />

      <AdjustmentModal
        isOpen={isAdjustmentOpen}
        onClose={() => setIsAdjustmentOpen(false)}
        onSubmit={handleAdjustmentSubmit}
        selectedMember={selectedMember}
      />
    </div>
  );
};

export default Dashboard;
