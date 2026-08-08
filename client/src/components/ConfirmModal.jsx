import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, requireTextConfirm }) => {
  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setConfirmInput('');
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireTextConfirm && confirmInput !== requireTextConfirm) {
      setError(`Please type "${requireTextConfirm}" to confirm`);
      return;
    }
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="flex justify-between items-center p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-slate-300 text-sm leading-relaxed">{message}</p>

          {requireTextConfirm && (
            <div className="space-y-1.5 pt-2">
              <label className="text-slate-400 text-xs font-semibold block">
                Type <span className="text-rose-450 font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="Type DELETE here"
                className="glass-input w-full px-3 py-2 rounded-lg bg-slate-950 border-slate-800 text-white"
              />
              {error && <div className="text-rose-400 text-xs mt-1">{error}</div>}
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
