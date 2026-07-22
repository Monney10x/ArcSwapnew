'use client';

import React from 'react';
import { EXPLORER_URL, RPC_URL } from '@/lib/network';

export const NetworkInfo: React.FC = () => {
  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Arc Testnet Configuration</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Network Name</p>
          <p className="text-sm font-mono text-foreground">Arc Testnet</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Chain ID</p>
          <p className="text-sm font-mono text-foreground">5042002</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">RPC URL</p>
          <p className="text-xs font-mono text-foreground break-all">{RPC_URL}</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Currency</p>
          <p className="text-sm font-mono text-foreground">USDC</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">USDC Contract</p>
          <p className="text-xs font-mono text-foreground break-all">0x3600000000000000000000000000000000000000</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Explorer</p>
          <a
            href={EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline font-mono"
          >
            testnet.arcscan.app →
          </a>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>Note:</strong> This is a testnet environment. All transactions use testnet USDC.
          Use the faucet to get free tokens for testing.
        </p>
      </div>
    </div>
  );
};
