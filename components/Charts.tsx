import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ChartProps { data: Array<{ year: string; current: number; optimized: number }>; }

export const SavingsChart: React.FC<ChartProps> = ({ data }) => (
  <div className="w-full h-48 mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} interval={2} />
        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} labelStyle={{ color: '#6b7280', fontSize: '12px' }} />
        <Area type="monotone" dataKey="current" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" name="Facture Actuelle" />
        <Area type="monotone" dataKey="optimized" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOptimized)" name="Avec Solution" />
        <ReferenceLine y={0} stroke="#000" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);