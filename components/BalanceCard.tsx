'use client';

import React from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';

export const BalanceCard: React.FC = () => {
  const { address, isConnected, isCorrectChain, balance, isLoading, refreshBalance } = useWeb3();

  return (
    <div className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Wallet Balance</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your current Arc Testnet USDC balance
          </p>
        </div>
        <div className="text-2xl">💰</div>
      </div>

      {!isConnected ? (
        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Connect wallet to view balance
          </p>
        </div>
      ) : !isCorrectChain ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-sm text-red-900 font-medium mb-3">Wrong Network</p>
          <p className="text-xs text-red-700 mb-4">
            You need to be on Arc Testnet to see your balance
          </p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-4 border border-blue-200">
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className="text-4xl font-bold text-foreground">
              {isLoading ? '...' : balance ? `${parseFloat(balance).toFixed(6)}` : '0'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">USDC</p>
          </div>

          <div className="bg-muted rounded-lg p-3 mb-4">
            <p className="text-xs text-muted-foreground font-semibold">Wallet Address</p>
            <p className="text-sm font-mono text-foreground mt-1 break-all">
              {address}
            </p>
          </div>

          <Button
            onClick={refreshBalance}
            disabled={isLoading}
            variant="outline"
            className="w-full gap-2"
          >
            {isLoading && <span className="animate-spin">⟳</span>}
            {isLoading ? 'Refreshing...' : 'Refresh Balance'}
          </Button>

          {balance && parseFloat(balance) === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <p className="text-xs text-amber-900">
                Your balance is empty. Use the faucet to claim testnet tokens.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
