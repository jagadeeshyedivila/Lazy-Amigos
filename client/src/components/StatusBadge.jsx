import React from 'react';

const StatusBadge = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PARTIAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'PENDING':
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    }
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getColors()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
