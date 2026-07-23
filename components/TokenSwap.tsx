'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { transferUSDC, getExplorerTxUrl } from '@/lib/web3';
import { saveTransactionToHistory } from '@/components/TransactionHistory';

export const SendUSDC: React.FC = () => {
  const { address, isConnected, isCorrectChain, balance, isLoading, refreshBalance } = useWeb3();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
    setError(null);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setError(null);
  };

  const handlePercentage = (percentage: number) => {
    if (!balance) return;
    
    const balanceNum = parseFloat(balance);
    const calculatedAmount = (balanceNum * percentage / 100).toFixed(6);
    setAmount(calculatedAmount);
    setError(null);
  };

  const validateForm = (): boolean => {
    setError(null);

    if (!recipientAddress.trim()) {
      setError('Please enter a recipient address');
      return false;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      setError('Invalid Ethereum address format');
      return false;
    }

    if (!amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid amount');
      return false;
    }

    const amountNum = parseFloat(amount);
    if (amountNum <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    if (balance && amountNum > parseFloat(balance)) {
      setError(`Insufficient balance. Available: ${balance} USDC`);
      return false;
    }

    if (recipientAddress.toLowerCase() === address?.toLowerCase()) {
      setError('Cannot transfer to the same address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsTransferring(true);
    setSuccess(null);

    try {
      const txHash = await transferUSDC(recipientAddress, amount);
      saveTransactionToHistory({
        type: 'transfer',
        fromToken: 'USDC',
        fromAmount: amount,
        toToken: 'USDC',
        toAmount: amount,
        status: 'completed',
        hash: txHash,
        recipient: recipientAddress,
      });

      setTransactionHash(txHash);
      setSuccess(`Transfer successful! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Reset form
      setRecipientAddress('');
      setAmount('');

      // Refresh balance
      await refreshBalance();
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">Transfer USDC</h3>
        <p className="text-sm text-muted-foreground">
          Send testnet USDC to another Arc Testnet wallet
        </p>
      </div>

      {!isConnected ? (
        <div className="rounded-xl p-4 text-center bg-accent/10 border border-accent/30">
          <p className="text-sm text-foreground">
            Connect your wallet to transfer tokens
          </p>
        </div>
      ) : !isCorrectChain ? (
        <div className="rounded-xl p-4 text-center bg-destructive/10 border border-destructive/30">
          <p className="text-sm text-foreground">
            Please switch to Arc Testnet to transfer tokens
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Your Balance
            </label>
            <div className="glass-panel rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gradient-brand">
                {balance ? `${parseFloat(balance).toFixed(2)} USDC` : 'Loading...'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={handleAddressChange}
              placeholder="0x..."
              className="input-premium rounded-xl px-4 py-3 font-mono text-sm"
              disabled={isTransferring}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Amount (USDC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              step="0.000001"
              min="0"
              className="input-premium rounded-xl px-4 py-3 text-lg font-medium"
              disabled={isTransferring}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => handlePercentage(25)}
                className="flex-1 px-2 py-1.5 text-xs font-medium glass-panel text-muted-foreground rounded-lg hover:text-primary transition-colors disabled:opacity-40"
                disabled={isTransferring || !balance}
              >
                25%
              </button>
              <button
                type="button"
                onClick={() => handlePercentage(50)}
                className="flex-1 px-2 py-1.5 text-xs font-medium glass-panel text-muted-foreground rounded-lg hover:text-primary transition-colors disabled:opacity-40"
                disabled={isTransferring || !balance}
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => handlePercentage(100)}
                className="flex-1 px-2 py-1.5 text-xs font-medium glass-panel text-muted-foreground rounded-lg hover:text-primary transition-colors disabled:opacity-40"
                disabled={isTransferring || !balance}
              >
                100%
              </button>
            </div>
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
                  View on ArcScan →
                </a>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isTransferring || isLoading || !recipientAddress || !amount}
            className="btn-gradient w-full rounded-xl py-3.5 text-base"
          >
            {isTransferring && <span className="animate-spin">⏳</span>}
            {isTransferring ? 'Processing...' : 'Transfer USDC'}
          </button>
        </form>
      )}
    </div>
  );
};
