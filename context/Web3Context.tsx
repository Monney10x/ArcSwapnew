'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  connectWallet,
  switchToArcTestnet,
  getCurrentChainId,
  getUSDCBalance,
  isWalletConnected,
  getWalletProvider,
  getAvailableWallets,
} from '@/lib/web3';
import { ARC_TESTNET } from '@/lib/network';

interface Web3ContextType {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  balance: string | null;
  chainId: number | null;
  isCorrectChain: boolean;
  error: string | null;
  walletId: string | null;
  showWalletSelector: boolean;
  connect: (walletId?: string) => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  openWalletSelector: () => void;
  closeWalletSelector: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export { Web3Context };
export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  const isCorrectChain = chainId === ARC_TESTNET.id;

  // Check if wallet is already connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Don't set loading state during initial check - only for user actions
      try {
        const connectedAddress = await isWalletConnected();
        if (connectedAddress) {
          setAddress(connectedAddress);
          setIsConnected(true);

          // Get current chain
          const currentChainId = await getCurrentChainId();
          setChainId(currentChainId);

          // Get balance if on correct chain
          if (currentChainId === ARC_TESTNET.id) {
            const bal = await getUSDCBalance(connectedAddress);
            setBalance(bal);
          }
        }
      } catch (err: any) {
        // Silently fail on initial check
      }
    };

    checkWalletConnection();

    // Listen for account changes only if provider exists
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            setAddress(null);
            setIsConnected(false);
            setBalance(null);
            setError(null);
          } else {
            setAddress(accounts[0]);
            setIsConnected(true);
          }
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } catch (err) {
        console.log('[v0] Provider listeners not available');
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          window.ethereum.removeAllListeners('accountsChanged');
          window.ethereum.removeAllListeners('chainChanged');
        } catch (err) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const connect = async (selectedWalletId: string = 'metamask') => {
    setIsLoading(true);
    setError(null);
    try {
      const walletProvider = getWalletProvider(selectedWalletId);
      
      if (!walletProvider) {
        const walletNames = { metamask: 'MetaMask', okx: 'OKX Wallet', rabby: 'Rabby' };
        const errorMsg = `${walletNames[selectedWalletId as keyof typeof walletNames] || 'Wallet'} not installed`;
        setError(errorMsg);
        setIsConnected(false);
        setShowWalletSelector(false);
        setIsLoading(false);
        return;
      }

      const connectedAddress = await connectWallet(selectedWalletId);
      
      setAddress(connectedAddress);
      setIsConnected(true);
      setWalletId(selectedWalletId);
      setShowWalletSelector(false);

      // Get current chain first
      try {
        const currentChainId = await getCurrentChainId(walletProvider);
        setChainId(currentChainId);
      } catch (chainErr) {
        // Still continue even if chain check fails
      }

      // Try to switch to Arc Testnet if not already on it
      try {
        await switchToArcTestnet(walletProvider);
        const updatedChainId = await getCurrentChainId(walletProvider);
        setChainId(updatedChainId);
      } catch (switchErr) {
        // Still continue - user may not have approved network switch
      }

      // Get balance
      try {
        const bal = await getUSDCBalance(connectedAddress);
        setBalance(bal);
      } catch (balErr) {
        setBalance('0');
      }
    } catch (err: any) {
      // In preview environment without wallet, show helpful error
      if (err.message?.includes('not installed')) {
        setError(err.message);
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
      setIsConnected(false);
      setAddress(null);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance(null);
    setChainId(null);
    setWalletId(null);
    setError(null);
  };

  const switchNetwork = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await switchToArcTestnet();
      const currentChainId = await getCurrentChainId();
      setChainId(currentChainId);

      if (address) {
        const bal = await getUSDCBalance(address);
        setBalance(bal);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!address || !isCorrectChain) return;

    try {
      const bal = await getUSDCBalance(address);
      setBalance(bal);
    } catch (err: any) {
      // Silently fail for balance refresh
      setBalance(null);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected,
        isLoading,
        balance,
        chainId,
        isCorrectChain,
        error,
        walletId,
        showWalletSelector,
        connect,
        disconnect,
        switchNetwork,
        refreshBalance,
        openWalletSelector: () => setShowWalletSelector(true),
        closeWalletSelector: () => setShowWalletSelector(false),
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};
