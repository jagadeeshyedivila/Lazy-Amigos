import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import api from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Admin from './pages/Admin';
import MonthSelector from './components/MonthSelector';
import { 
  Home, 
  Users, 
  IndianRupee, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  User,
  Shield,
  RefreshCw
} from 'lucide-react';

const AppContent = () => {
  const { user, token, loading, logout, isAdmin } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [months, setMonths] = useState([]);
  const [selectedMonthId, setSelectedMonthId] = useState('');
  const [monthsLoading, setMonthsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchMonthsList();
    }
  }, [token]);

  const fetchMonthsList = async () => {
    setMonthsLoading(true);
    try {
      const res = await api.get('/months');
      setMonths(res.data.data);
      if (res.data.data.length > 0) {
        // Default to the latest month configuration (sorted desc)
        setSelectedMonthId(res.data.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load months list', err);
    } finally {
      setMonthsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-brand-500 animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Bootstrapping session...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Login />;
  }

  const renderTab = () => {
    switch (currentTab) {
      case 'roommates':
        return <Members />;
      case 'payments':
        return <Payments monthId={selectedMonthId} />;
      case 'expenses':
        return <Expenses monthId={selectedMonthId} />;
      case 'admin':
        return isAdmin ? (
          <Admin 
            currentMonthId={selectedMonthId} 
            onMonthAction={fetchMonthsList} 
          />
        ) : (
          <Dashboard 
            globalMonthId={selectedMonthId} 
            onMonthChange={setSelectedMonthId} 
            monthsList={months}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard 
            globalMonthId={selectedMonthId} 
            onMonthChange={setSelectedMonthId} 
            monthsList={months}
          />
        );
    }
  };

  const handleLogout = () => {
    const confirm = window.confirm("Logout aa?\n\nSare ra, vellostha ani cheppi malli payment reminder vachinappudu login avvu. 😂");
    if (confirm) {
      logout();
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 md:pl-64 text-slate-100 bg-[#070b19]">
      {/* Sidebar (Desktop only) */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col w-64 glass-panel border-r border-slate-800 bg-slate-950/80 p-6 space-y-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white leading-tight font-sans">Lazy Amigos</h1>
            <span className="text-[9px] text-brand-400 font-bold tracking-tight">Evadu kattadu ra ee month? 😂</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-350">
            <User className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-semibold text-sm text-white truncate">{user.name}</h4>
            <div className="flex items-center text-[10px] text-slate-500 uppercase font-bold mt-0.5">
              {user.role === 'admin' ? (
                <span className="flex items-center text-purple-400">
                  <Shield className="w-3 h-3 mr-0.5" /> Boss Mode
                </span>
              ) : (
                <span className="text-brand-400">Amigo</span>
              )}
            </div>
          </div>
        </div>

        {months.length > 0 && (
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Month</label>
            <MonthSelector
              months={months}
              selectedMonthId={selectedMonthId}
              onChange={setSelectedMonthId}
            />
          </div>
        )}

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              currentTab === 'dashboard'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/15'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('roommates')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              currentTab === 'roommates'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/15'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Amigos</span>
          </button>

          <button
            onClick={() => setCurrentTab('payments')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              currentTab === 'payments'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/15'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
            }`}
          >
            <IndianRupee className="w-5 h-5" />
            <span>Payments</span>
          </button>

          <button
            onClick={() => setCurrentTab('expenses')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              currentTab === 'expenses'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/15'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Expenses</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                currentTab === 'admin'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/30'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Boss Mode 👑</span>
            </button>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden glass-panel border-b border-slate-800 bg-slate-950/70 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Home className="w-5 h-5 text-brand-400" />
          <h1 className="font-extrabold text-base text-white">Lazy Amigos</h1>
        </div>
        <div className="flex items-center space-x-3">
          {months.length > 0 && (
            <MonthSelector
              months={months}
              selectedMonthId={selectedMonthId}
              onChange={setSelectedMonthId}
            />
          )}
          <button 
            onClick={handleLogout} 
            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 py-6 md:py-8 overflow-y-auto">
        {renderTab()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 bg-slate-950/90 py-2 px-4 flex justify-around items-center">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
            currentTab === 'dashboard' ? 'text-brand-400' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('roommates')}
          className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
            currentTab === 'roommates' ? 'text-brand-400' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Amigos</span>
        </button>

        <button
          onClick={() => setCurrentTab('payments')}
          className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
            currentTab === 'payments' ? 'text-brand-400' : 'text-slate-500'
          }`}
        >
          <IndianRupee className="w-5 h-5" />
          <span>Payments</span>
        </button>

        <button
          onClick={() => setCurrentTab('expenses')}
          className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
            currentTab === 'expenses' ? 'text-brand-400' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Expenses</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
              currentTab === 'admin' ? 'text-brand-400' : 'text-slate-500'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Boss</span>
          </button>
        )}
      </nav>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
