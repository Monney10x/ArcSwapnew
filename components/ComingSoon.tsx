'use client';

import React from 'react';

interface ComingSoonProps {
  title: string;
  description?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass-card rounded-3xl px-8 py-14 sm:px-16 text-center max-w-lg mx-auto">
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" aria-hidden="true" />
          <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-panel">
            <span className="text-3xl" aria-hidden="true">🚀</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gradient mb-3 text-balance">{title}</h2>
        {description && (
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed text-pretty">{description}</p>
        )}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel text-primary font-medium text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" aria-hidden="true" />
          Coming Soon
        </div>
      </div>
    </div>
  );
};
