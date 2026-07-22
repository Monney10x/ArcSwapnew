'use client';

import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-lg text-primary text-2xl">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
