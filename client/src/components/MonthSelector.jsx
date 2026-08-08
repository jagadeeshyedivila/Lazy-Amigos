import React from 'react';
import { Calendar } from 'lucide-react';

const MonthSelector = ({ months, selectedMonthId, onChange }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatMonthLabel = (m) => {
    return `${monthNames[m.month - 1]} ${m.year}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-5 h-5 text-brand-400" />
      <select
        value={selectedMonthId}
        onChange={(e) => onChange(e.target.value)}
        className="glass-input px-3 py-1.5 rounded-lg text-sm bg-slate-900 border-slate-700 text-white font-medium cursor-pointer"
      >
        <option value="" disabled>Select Month</option>
        {months.map((m) => (
          <option key={m._id} value={m._id}>
            {formatMonthLabel(m)} {m.status === 'CLOSED' ? '🔒' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
