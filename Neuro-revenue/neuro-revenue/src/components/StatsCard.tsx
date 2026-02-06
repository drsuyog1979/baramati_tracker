import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  colorClass: string;
  icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, colorClass, icon }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-black ${colorClass}`}>{value}</p>
    </div>
  );
};

export default StatsCard;
