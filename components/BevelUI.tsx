import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50 ${className} ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-200' : ''}`}>
    {children}
  </div>
);

export const PrimaryButton: React.FC<{ onClick: () => void; children: React.ReactNode; disabled?: boolean }> = ({ onClick, children, disabled }) => (
  <button onClick={onClick} disabled={disabled} className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg ${disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl active:scale-[0.98]'}`}>
    {children}
  </button>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string; date?: string }> = ({ title, subtitle, date }) => (
  <div className="mb-6 px-2">
    <div className="flex justify-between items-end">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
      {date && <span className="text-sm font-medium text-slate-400 mb-1">{date}</span>}
    </div>
    {subtitle && <p className="text-slate-500 font-medium mt-1">{subtitle}</p>}
  </div>
);

export const CircularGauge: React.FC<{ value: number; label: string; subLabel: string; colorClass?: string }> = ({ value, label, subLabel, colorClass = "text-emerald-500" }) => {
  const radius = 60, stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center justify-center relative py-4">
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          <circle className="stroke-gray-100" strokeWidth={stroke} fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
          <circle className={`${colorClass} transition-all duration-1000 ease-out`} stroke="currentColor" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset }} strokeLinecap="round" fill="transparent" r={normalizedRadius} cx={radius} cy={radius} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-800">{value}%</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{subLabel}</span>
        </div>
      </div>
      <div className="mt-2 text-center font-medium text-slate-600">{label}</div>
    </div>
  );
};

export const ListItem: React.FC<{ icon: React.ReactNode; label: string; value: string; subValue?: string; color?: string }> = ({ icon, label, value, subValue, color = "bg-blue-100" }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-xl`}>{icon}</div>
      <div className="flex flex-col">
        <span className="font-semibold text-slate-800">{label}</span>
        {subValue && <span className="text-xs text-slate-400">{subValue}</span>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-bold text-slate-700">{value}</span>
      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </div>
  </div>
);