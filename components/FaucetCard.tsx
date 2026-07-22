'use client';

import React from 'react';
import { FAUCET_URL } from '@/lib/network';

export const FaucetCard: React.FC = () => {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Get Testnet Tokens</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Claim USDC tokens from the Circle faucet
          </p>
        </div>
        <div className="flex items-center justify-center w-11 h-11 rounded-xl glass-panel text-2xl" aria-hidden="true">💧</div>
      </div>

      <div className="glass-panel rounded-xl p-4 mb-5">
        <p className="text-sm text-muted-foreground">
          Click below to open the official Circle faucet and claim tokens
        </p>
      </div>

      <a
        href={FAUCET_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gradient block w-full rounded-xl px-4 py-3.5 text-center"
      >
        Open Circle Faucet
      </a>

      <p className="text-xs text-muted-foreground mt-4 text-center leading-relaxed">
        Visit faucet.circle.com to claim 1000 USDC per wallet every 24 hours
      </p>
    </div>
  );
};
