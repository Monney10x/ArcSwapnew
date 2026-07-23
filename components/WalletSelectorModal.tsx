'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { MetaMaskIcon, RabbyIcon, OKXIcon, WalletConnectIcon } from '@/components/WalletIcons';

export interface WalletProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export const SUPPORTED_WALLETS: WalletProvider[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: <MetaMaskIcon className="w-8 h-8" />,
    description: 'Popular Web3 wallet browser extension',
  },
  {
    id: 'rabby',
    name: 'Rabby Wallet',
    icon: <RabbyIcon className="w-8 h-8" />,
    description: 'User-friendly wallet for DeFi',
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    icon: <OKXIcon className="w-8 h-8" />,
    description: 'OKX multichain crypto wallet',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: <WalletConnectIcon className="w-8 h-8" />,
    description: 'Connect any mobile wallet via QR code',
  },
];

interface WalletSelectorModalProps {
  isOpen: boolean;
  onSelect: (walletId: string) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export const WalletSelectorModal: React.FC<WalletSelectorModalProps> = ({
  isOpen,
  onSelect,
  onClose,
  isLoading,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleWalletSelect = async (walletId: string) => {
    console.log('[v0] Wallet selected:', walletId);
    await onSelect(walletId);
  };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <div
          className="rounded-2xl p-6 max-w-md w-full my-auto pointer-events-auto animate-fade-in-up border border-white/10"
          style={{
            background: '#0b1228',
            boxShadow: '0 24px 70px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          <h2 className="text-xl font-bold text-foreground mb-1">Select Wallet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Choose which wallet to connect
          </p>

          <div className="space-y-3">
            {SUPPORTED_WALLETS.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleWalletSelect(wallet.id)}
                disabled={isLoading}
                className="w-full p-4 glass-panel rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">{wallet.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-base">{wallet.name}</p>
                    <p className="text-xs text-muted-foreground">{wallet.description}</p>
                  </div>
                  {isLoading && (
                    <span className="animate-spin text-xl" aria-hidden="true">⚙️</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full mt-6 py-2.5 px-4 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
};
