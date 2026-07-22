'use client';

import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  change,
  changeType,
}) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-primary/20 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            <span className={`text-sm font-semibold ${
              changeType === 'positive' ? 'text-green-400' : 'text-red-400'
            }`}>
              {changeType === 'positive' ? '+' : ''}{change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
