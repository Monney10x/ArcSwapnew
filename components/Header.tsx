'use client';

import React, { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { formatAddress } from '@/lib/web3';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  const { 
    address, 
    isConnected, 
    isLoading, 
    isCorrectChain, 
    error, 
    connect, 
    disconnect, 
    switchNetwork,
    walletId,
  } = useWeb3();
  const [showMenu, setShowMenu] = useState(false);

  const handleSelectWallet = async (walletId: string) => {
    await connect(walletId);
  };

  const handleDisconnect = () => {
    disconnect();
    setShowMenu(false);
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork();
      setShowMenu(false);
    } catch (err: any) {
      console.log('[v0] Switch network error:', err.message);
    }
  };

  const getWalletDisplayName = (): string => {
    if (!walletId) return 'Connect Wallet';
    const names: { [key: string]: string } = {
      metamask: '🦊 MetaMask',
      okx: '⬜ OKX',
      rabby: '🐰 Rabby',
    };
    return names[walletId] || 'Connected';
  };

  return (
    <>
      <header className="w-full border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
              <h1 className="text-xl font-bold text-foreground">Arc Testnet</h1>
            </div>

            {/* Wallet buttons - shown when not connected */}
            {!isConnected && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectWallet('metamask')}
                  disabled={isLoading}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <span>🦊</span>
                  <span>MetaMask</span>
                </button>
                <button
                  onClick={() => handleSelectWallet('okx')}
                  disabled={isLoading}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <span>⬜</span>
                  <span>OKX</span>
                </button>
                <button
                  onClick={() => handleSelectWallet('rabby')}
                  disabled={isLoading}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <span>🐰</span>
                  <span>Rabby</span>
                </button>
              </div>
            )}

            {/* Status and account info - shown when connected */}
            {isConnected && (
              <div className="flex items-center gap-3">
                {error && (
                  <div className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 max-w-xs">
                    {error}
                  </div>
                )}
                {isCorrectChain && (
                  <div className="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
                    Connected
                  </div>
                )}
                {!isCorrectChain && (
                  <div className="px-3 py-1.5 bg-amber-50 text-amber-700 text-sm rounded-lg border border-amber-200">
                    Wrong Network
                  </div>
                )}

                {isCorrectChain ? (
                  <div className="relative">
                    <Button
                      onClick={() => setShowMenu(!showMenu)}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading && <span className="animate-spin">⚙️</span>}
                      {getWalletDisplayName().split(' ')[0]} {formatAddress(address!)}
                    </Button>
                    
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50">
                        <div className="p-3 border-b border-border">
                          <p className="text-xs text-muted-foreground">Connected Address</p>
                          <p className="text-sm font-mono text-foreground break-all">{address}</p>
                          <p className="text-xs text-muted-foreground mt-2">{getWalletDisplayName()}</p>
                        </div>
                        <button
                          onClick={handleDisconnect}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium text-sm border-t border-border"
                        >
                          Disconnect Wallet
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={handleSwitchNetwork}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading && <span className="animate-spin">⚙️</span>}
                    Switch Network
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {showMenu && isConnected && isCorrectChain && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowMenu(false)}
          />
        )}
      </header>
    </>
  );
};
