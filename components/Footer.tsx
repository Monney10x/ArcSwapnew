'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 py-6 border-t border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Brand info */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <h3 className="text-sm font-bold tracking-tight">
              Arc<span className="text-primary">Swap</span>
            </h3>
          </div>

          {/* Center - Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/Moneyz0x"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost group rounded-full px-4 py-2 text-xs"
            >
              <span aria-hidden="true">𝕏</span>
              <span>@Moneyz0x</span>
            </a>
          </div>

          {/* Right side - Stats */}
          <div className="text-right">
            <p className="text-xs text-muted-foreground">© 2026 ArcSwap</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
