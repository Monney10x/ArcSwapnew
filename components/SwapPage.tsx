'use client';

import React, { useState } from 'react';
import { SwapTokens } from './SwapTokens';
import { SendUSDC } from './TokenSwap';
import { TransactionHistory } from './TransactionHistory';

export const SwapPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'swap' | 'send'>('swap');

  return (
    <div className="space-y-6">
      {/* Compact Hero - 40-50vh max */}
      <div className="min-h-[30vh] sm:min-h-[40vh] max-h-[50vh] flex flex-col justify-center">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-black dark:text-black text-balance leading-tight drop-shadow-[0_1px_6px_rgba(255,255,255,0.3)]">
            Welcome to ArcSwap
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Trade and transfer tokens securely on Arc Testnet.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="inline-flex items-center gap-0.5 sm:gap-1 p-1 rounded-lg sm:rounded-xl glass-panel">
        <button
          onClick={() => setActiveTab('swap')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'swap'
              ? 'bg-primary text-primary-foreground shadow-[0_4px_16px_-6px_rgba(255,165,0,0.6)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="hidden sm:inline">Swap Tokens</span>
          <span className="sm:hidden">Swap</span>
        </button>
        <button
          onClick={() => setActiveTab('send')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
            activeTab === 'send'
              ? 'bg-primary text-primary-foreground shadow-[0_4px_16px_-6px_rgba(255,165,0,0.6)]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="hidden sm:inline">Send USDC</span>
          <span className="sm:hidden">Send</span>
        </button>
      </div>

      {/* Full-width Swap Card & Transaction History */}
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {activeTab === 'swap' && <SwapTokens />}
        {activeTab === 'send' && <SendUSDC />}

        {/* Transaction History Section */}
        <TransactionHistory />
      </div>
    </div>
  );
};
