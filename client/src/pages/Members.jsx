import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, UserCheck, UserX, Edit, Phone, RefreshCw, X } from 'lucide-react';

const Members = () => {
  const { isAdmin } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members');
      setMembers(res.data.data);
    } catch (err) {
      setError('Failed to fetch roommates');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName('');
    setPhone('');
    setPassword('');
    setRole('member');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setName(member.name);
    setPhone(member.phone);
    setPassword('');
    setRole(member.role);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (member) => {
    try {
      const newStatus = !member.isActive;
      await api.patch(`/members/${member._id}/status`, { isActive: newStatus });
      showSuccess(newStatus ? 'Roommate status active!' : 'Ee amigo room nundi exit ayyadu.');
      fetchMembers();
    } catch (err) {
      setError(err.message || 'Failed to update roommate status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name || !phone) {
      setFormError('Name and Phone number are required');
      return;
    }

    if (!editingMember && !password) {
      setFormError('Password is required for new roommates');
      return;
    }

    setFormLoading(true);
    try {
      const payload = { name, phone, role };
      if (password) payload.password = password;

      if (editingMember) {
        await api.put(`/members/${editingMember._id}`, payload);
        showSuccess('Roommate details updated successfully!');
      } else {
        await api.post('/members', payload);
        showSuccess('Kotha member aa?\n\nSare ra, welcome to the financial suffering. 😂');
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      setFormError(err.message || 'Action failed');
    } finally {
      setFormLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">👨👨👦 Mana Amigos</h2>
          <p className="text-brand-400 text-sm font-semibold">Flat members layout ra.</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-1.5 py-2 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-brand-600/15 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Inko Amigo</span>
          </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div
            key={m._id}
            className="glass-panel p-5 rounded-2xl flex flex-col justify-between border border-slate-800 shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-white">{m.name}</h4>
                <div className="flex items-center text-slate-405 text-xs mt-1">
                  <Phone className="w-3.5 h-3.5 mr-1 text-slate-550" />
                  <span>{m.phone}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                m.role === 'admin' 
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                  : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
              }`}>
                {m.role.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/40">
              <div className="flex items-center space-x-1.5">
                {m.isActive ? (
                  <span className="flex items-center text-xs text-emerald-400 font-semibold">
                    <UserCheck className="w-4 h-4 mr-1 text-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center text-xs text-rose-400 font-semibold">
                    <UserX className="w-4 h-4 mr-1 text-rose-500" />
                    Inactive
                  </span>
                )}
              </div>

              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white transition"
                    title="Edit Member"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(m)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-bold border transition ${
                      m.isActive 
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 border-rose-500/20' 
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 border-emerald-500/20'
                    }`}
                  >
                    {m.isActive ? 'Deactivate' : 'Reactivate'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="flex justify-between items-center p-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingMember ? 'Edit Roommate' : 'welcome to financial suffering 😂'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg">
                  {formError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul"
                  className="glass-input w-full px-3 py-2 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="glass-input w-full px-3 py-2 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">
                  Password {editingMember && '(Leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="glass-input w-full px-3 py-2 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="glass-input w-full px-3 py-2 rounded-lg bg-slate-900 border-slate-700 text-white"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-2 px-4 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-850 text-white font-semibold rounded-lg transition flex items-center justify-center"
                >
                  {formLoading ? 'Saving...' : 'Save Roommate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
