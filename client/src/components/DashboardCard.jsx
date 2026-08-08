import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon: Icon, color = 'brand' }) => {
  const getColorClass = () => {
    switch (color) {
      case 'green':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'red':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'blue':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'purple':
        return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20';
      case 'brand':
      default:
        return 'text-brand-400 bg-brand-500/10 border-brand-500/20';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl flex items-center justify-between shadow-lg border border-slate-800">
      <div className="space-y-1">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</span>
        <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
        {subtitle && <div className="text-slate-500 text-xs">{subtitle}</div>}
      </div>
      <div className={`p-3 rounded-xl border ${getColorClass()}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default DashboardCard;
