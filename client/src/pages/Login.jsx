import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Phone, Home } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(phone, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-2">
            <Home className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Lazy Amigos</h2>
          <div className="text-brand-400 text-sm font-bold">Evadu kattadu ra ee month? 😂</div>
          <div className="text-slate-500 text-xs font-semibold">Because nobody remembers who paid.</div>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Welcome back, amigo.</h3>
            <p className="text-slate-450 text-xs">Enter your details to log in.</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg font-medium">
              😬 Login avvaledu ra. Phone number/password check chey.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="glass-input w-full px-3 py-2.5 pl-10 rounded-xl"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="glass-input w-full px-3 py-2.5 pl-10 rounded-xl"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 hover:shadow-brand-600/35 transition-all flex items-center justify-center cursor-pointer"
            >
              {loading ? 'Entering...' : 'LET ME IN 🚪'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/40">
            <span className="text-[11px] text-slate-450">
              Forgot password? <strong className="text-slate-350">Room lo evaraina Boss ni adagandi. 😂</strong>
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs text-slate-500">
            For development, use admin phone: <span className="text-slate-400 font-bold">9999999999</span> and password: <span className="text-slate-400 font-bold">adminpassword123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
