'use client';

import React from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { addArcNetwork } from '@/lib/web3';
import { Button } from '@/components/ui/button';

export const NetworkActionButton: React.FC = () => {
  const { isConnected, isLoading, isCorrectChain, disconnect } = useWeb3();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDisconnectAndAddNetwork = async () => {
    setIsProcessing(true);
    try {
      // Disconnect wallet
      disconnect();
      
      // Add network to wallet
      await addArcNetwork();
    } catch (error: any) {
      console.error('[v0] Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-8 px-4">
      <button
        onClick={handleDisconnectAndAddNetwork}
        disabled={isProcessing || isLoading || (isConnected && isCorrectChain)}
        className={`inline-flex items-center gap-3 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed ${
          isConnected && isCorrectChain
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-300 shadow-lg shadow-green-500/20 disabled:opacity-100'
            : isConnected && !isCorrectChain
            ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/50 text-orange-300 hover:shadow-orange-500/30 shadow-lg shadow-orange-500/20 hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-yellow-500/30'
            : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20'
        }`}
      >
        {isProcessing && <span className="animate-spin text-lg" aria-hidden="true">⚙️</span>}
        {isConnected && isCorrectChain ? (
          <>
            <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            <span>Arc Network Connected ✓</span>
          </>
        ) : isConnected && !isCorrectChain ? (
          <>
            <span className="text-lg" aria-hidden="true">🔌</span>
            <span>Disconnect &amp; Add Arc Network</span>
          </>
        ) : (
          <>
            <span className="w-3 h-3 rounded-full bg-blue-400" aria-hidden="true" />
            <span>Wallet Not Connected</span>
          </>
        )}
      </button>
    </div>
  );
};
