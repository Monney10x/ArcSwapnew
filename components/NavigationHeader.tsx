'use client';

import React from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { formatAddress } from '@/lib/web3';
import { WalletSelectorModal } from '@/components/WalletSelectorModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { isAuthorizedWallet } from '@/lib/admin.config';
import Link from 'next/link';

interface NavigationHeaderProps {
  currentPage: 'swap' | 'liquidity' | 'faucet' | 'quests' | 'leaderboard';
  onPageChange: (page: 'swap' | 'liquidity' | 'faucet' | 'quests' | 'leaderboard') => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({ currentPage, onPageChange }) => {
  const {
    address,
    isConnected,
    isLoading,
    isCorrectChain,
    connect,
    disconnect,
    switchNetwork,
    showWalletSelector,
    openWalletSelector,
    closeWalletSelector,
  } = useWeb3();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleSelectWallet = async (walletId: string) => {
    await connect(walletId);
  };

  const handleDisconnect = () => {
    disconnect();
    setShowMenu(false);
  };

  const handleSwitchNetwork = async () => {
    await switchNetwork();
    setShowMenu(false);
  };

  const navItems = [
    { id: 'swap', label: 'Swap' },
    { id: 'liquidity', label: 'Liquidity' },
    { id: 'faucet', label: 'Faucet' },
    { id: 'quests', label: 'Quests' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ] as const;

  return (
    <header className="w-full sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top row: Logo and Wallet */}
        <div className="py-3 sm:py-4 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-primary/30 blur-lg" aria-hidden="true" />
              <img
                src="/arc-logo.png"
                alt="Arc Network"
                className="relative w-8 sm:w-9 h-8 sm:h-9 object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
              Arc<span className="text-yellow-400">Swap</span>
            </h1>
          </div>

          {!isConnected ? (
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ThemeToggle />
              <button
                onClick={openWalletSelector}
                disabled={isLoading}
                className="btn-gradient rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm disabled:opacity-50 whitespace-nowrap"
              >
                {isLoading ? (
                  <span className="animate-spin" aria-hidden="true">⚙️</span>
                ) : (
                  <span className="hidden sm:inline" aria-hidden="true">👛</span>
                )}
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </button>
            </div>
          ) : isCorrectChain ? (
            <div className="relative flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {isAuthorizedWallet(address || '') && (
                <Link
                  href="/admin"
                  className="hidden sm:block text-sm font-semibold text-primary hover:text-primary/80 transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isLoading}
                className="rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-mono text-white hover:bg-white/10 transition-colors disabled:opacity-50 truncate"
              >
                {isLoading ? (
                  <span className="animate-spin" aria-hidden="true">⚙️</span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse-soft" aria-hidden="true" />
                )}
                {formatAddress(address!)}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-60 glass-card rounded-xl overflow-hidden z-50">
                  <div className="p-4 border-b border-white/10 bg-black/40">
                    <p className="text-xs text-gray-400 mb-1">Connected Address</p>
                    <p className="text-sm font-mono text-white break-all">{address}</p>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-400 font-medium text-sm transition-colors"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ThemeToggle />
              <button
                onClick={handleSwitchNetwork}
                disabled={isLoading}
                className="btn-primary rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap"
              >
                {isLoading && <span className="animate-spin" aria-hidden="true">⚙️</span>}
                <span className="hidden sm:inline">Switch Network</span>
                <span className="sm:hidden">Switch</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation tabs */}
        <nav className="flex gap-0.5 sm:gap-1 overflow-x-auto pb-0 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`relative px-2 sm:px-4 py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                currentPage === item.id
                  ? 'text-yellow-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
              {currentPage === item.id && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary shadow-[0_0_12px_rgba(255,165,0,0.7)]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {showMenu && isConnected && isCorrectChain && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}

      <WalletSelectorModal
        isOpen={showWalletSelector}
        onSelect={handleSelectWallet}
        onClose={closeWalletSelector}
        isLoading={isLoading}
      />
    </header>
  );
};
