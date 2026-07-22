'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { getExplorerTxUrl, executeSwap, getWalletProvider } from '@/lib/web3';
import { Button } from '@/components/ui/button';

export const SwapTokens: React.FC = () => {
  const { address, isConnected, isCorrectChain, isLoading, refreshBalance, walletId, balance } = useWeb3();
  const [swapFrom, setSwapFrom] = useState<'ARC' | 'USDC' | 'USDT'>('USDC');
  const [swapTo, setSwapTo] = useState<'USDC' | 'USDT' | 'ARC'>('ARC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Get real balance from wallet
  const realBalance = parseFloat(balance) || 0;

  // Exchange rates
  const exchangeRates: Record<string, Record<string, number>> = {
    'ARC': { 'USDC': 0.95, 'USDT': 0.94 },
    'USDC': { 'ARC': 1.05, 'USDT': 0.99 },
    'USDT': { 'ARC': 1.06, 'USDC': 1.01 },
  };

  const handleFromAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setFromAmount(amount);
    setError(null);

    if (amount && !isNaN(parseFloat(amount))) {
      const rate = exchangeRates[swapFrom][swapTo];
      const calculated = (parseFloat(amount) * rate).toFixed(6);
      setToAmount(calculated);
    } else {
      setToAmount('');
    }
  };

  const handlePercentage = (percentage: number) => {
    const amount = (realBalance * percentage / 100).toFixed(6);
    setFromAmount(amount);
    setError(null);

    const rate = exchangeRates[swapFrom][swapTo];
    const calculated = (parseFloat(amount) * rate).toFixed(6);
    setToAmount(calculated);
  };

  const handleToAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setToAmount(amount);
    setError(null);

    if (amount && !isNaN(parseFloat(amount))) {
      const rate = exchangeRates[swapFrom][swapTo];
      const calculated = (parseFloat(amount) / rate).toFixed(6);
      setFromAmount(calculated);
    } else {
      setFromAmount('');
    }
  };

  const handleSwapDirection = () => {
    setSwapFrom(swapTo as any);
    setSwapTo(swapFrom as any);
    setFromAmount('');
    setToAmount('');
  };

  const handleSwapTokenTo = (token: 'USDC' | 'USDT' | 'ARC') => {
    if (token === swapFrom) {
      handleSwapDirection();
    } else {
      setSwapTo(token);
      setFromAmount('');
      setToAmount('');
    }
  };

  const validateForm = (): boolean => {
    setError(null);

    if (!fromAmount || isNaN(parseFloat(fromAmount))) {
      setError('Please enter a valid amount');
      return false;
    }

    if (parseFloat(fromAmount) <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    if (parseFloat(fromAmount) > realBalance) {
      setError(`Insufficient balance. You have ${realBalance.toFixed(6)} ${swapFrom}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSwapping(true);
    setSuccess(null);
    setError(null);

    try {
      // Get the wallet provider for real transaction
      const provider = getWalletProvider(walletId || 'metamask');
      
      if (!provider) {
        setError('Wallet provider not found. Please reconnect your wallet.');
        setIsSwapping(false);
        return;
      }

      console.log('[v0] Initiating real swap on Arc Testnet:', { 
        from: swapFrom, 
        to: swapTo, 
        amount: fromAmount,
        wallet: walletId 
      });
      
      // Execute real swap transaction on Arc Testnet
      const txHash = await executeSwap(
        swapFrom,
        swapTo,
        fromAmount,
        toAmount,
        provider
      );
      
      console.log('[v0] Swap transaction confirmed:', txHash);
      
      setTransactionHash(txHash);
      setSuccess(`Swapped ${fromAmount} ${swapFrom} for ${toAmount} ${swapTo}`);
      setFromAmount('');
      setToAmount('');

      await refreshBalance();
    } catch (err: any) {
      console.error('[v0] Swap error:', err);
      setError(err.message || 'Swap failed');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isConnected ? (
        <div className="glass-card rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground">Connect your wallet to swap tokens</p>
        </div>
      ) : !isCorrectChain ? (
        <div className="glass-card rounded-2xl p-6 text-center border border-destructive/30">
          <p className="text-sm text-foreground">Please switch to Arc Testnet</p>
        </div>
      ) : (
        <>
          {/* Balance Display */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300 font-medium">Your {swapFrom} Balance</span>
              <span className="text-xl font-bold text-yellow-400">{realBalance.toFixed(6)} {swapFrom}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative group">
            {/* Gradient glow behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 -z-10" aria-hidden="true" />
            <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-yellow-500/20 rounded-2xl p-8 space-y-6 backdrop-blur-lg">
              {/* From Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
                <div className="flex gap-2 mb-3">
                  {(['ARC', 'USDC', 'USDT'] as const).map((token) => (
                    <button
                      key={token}
                      type="button"
                      onClick={() => {
                        if (token === swapTo) {
                          handleSwapDirection();
                        } else {
                          setSwapFrom(token);
                          setFromAmount('');
                          setToAmount('');
                        }
                      }}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        swapFrom === token
                          ? 'bg-primary text-primary-foreground shadow-[0_4px_16px_-6px_rgba(0,229,255,0.6)]'
                          : 'glass-panel text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {token}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  placeholder="0.00"
                  step="0.000001"
                  min="0"
                  className="w-full bg-black/40 border border-yellow-500/30 rounded-xl px-4 py-3 text-lg font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
                  disabled={isSwapping}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handlePercentage(25)}
                    className="flex-1 px-2 py-1.5 text-xs font-medium glass-panel text-muted-foreground rounded-lg hover:text-primary transition-colors disabled:opacity-40"
                    disabled={isSwapping || realBalance === 0}
                  >
                    25% ({(realBalance * 0.25).toFixed(2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePercentage(50)}
                    className="flex-1 px-2 py-1.5 text-xs font-medium glass-panel text-muted-foreground rounded-lg hover:text-primary transition-colors disabled:opacity-40"
                    disabled={isSwapping || realBalance === 0}
                  >
                    50% ({(realBalance * 0.5).toFixed(2)})
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePercentage(100)}
                    className="flex-1 px-2 py-1.5 text-xs font-medium glass-panel text-muted-foreground rounded-lg hover:text-primary transition-colors disabled:opacity-40"
                    disabled={isSwapping || realBalance === 0}
                  >
                    100% ({realBalance.toFixed(2)})
                  </button>
                </div>
              </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSwapDirection}
              className="btn-gradient w-11 h-11 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSwapping}
              aria-label="Swap direction"
            >
              ⇅
            </button>
          </div>

          {/* To Section */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">To</label>
            <div className="flex gap-2 mb-3">
              {(['ARC', 'USDC', 'USDT'] as const).map((token) => (
                swapFrom !== token && (
                  <button
                    key={token}
                    type="button"
                    onClick={() => handleSwapTokenTo(token)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      swapTo === token
                        ? 'bg-primary text-primary-foreground shadow-[0_4px_16px_-6px_rgba(0,229,255,0.6)]'
                        : 'glass-panel text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {token}
                  </button>
                )
              ))}
            </div>
            <input
              type="number"
              value={toAmount}
              onChange={handleToAmountChange}
              placeholder="0.00"
              step="0.000001"
              min="0"
              className="w-full bg-black/40 border border-yellow-500/30 rounded-xl px-4 py-3 text-lg font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              disabled={isSwapping}
            />
          </div>

          {/* Rate Display */}
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 text-sm backdrop-blur-md">
            <div className="flex justify-between text-gray-300">
              <span>Exchange Rate</span>
              <span className="text-white font-medium">1 {swapFrom} = {exchangeRates[swapFrom][swapTo].toFixed(4)} {swapTo}</span>
            </div>
            {fromAmount && toAmount && (
              <div className="flex justify-between text-white mt-2 pt-2 border-t border-green-500/20">
                <span className="text-gray-300">You will get</span>
                <span className="font-semibold text-green-400">{toAmount} {swapTo}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-xl p-3 bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl p-3 bg-success/10 border border-success/30">
              <p className="text-sm text-success mb-2">{success}</p>
              {transactionHash && (
                <a
                  href={getExplorerTxUrl(transactionHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-success hover:underline font-medium"
                >
                  View on ArcScan Explorer →
                </a>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSwapping || isLoading || !fromAmount || !toAmount || realBalance === 0}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl py-4 text-base transition-all duration-300 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50"
          >
            {isSwapping ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Swapping...
              </span>
            ) : fromAmount ? (
              <span className="flex items-center justify-center gap-2">
                <span>{swapFrom}</span>
                <span>→</span>
                <span>{swapTo}</span>
              </span>
            ) : (
              `Swap ${swapFrom} for ${swapTo}`
            )}
          </button>

          {fromAmount && realBalance > 0 && (
            <div className="text-xs text-gray-400 text-center">
              Remaining after swap: <span className="font-semibold text-white">{(realBalance - parseFloat(fromAmount)).toFixed(6)} {swapFrom}</span>
            </div>
          )}
            </div>
          </form>
        </>
      )}
    </div>
  );
};

