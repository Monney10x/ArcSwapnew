'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle2, Clock, AlertCircle, ArrowUpRight, ArrowDownLeft, RefreshCw, Trash2, Search, Copy, Check } from 'lucide-react';
import { getExplorerTxUrl } from '@/lib/web3';

export interface TransactionRecord {
  id: string;
  type: 'swap' | 'transfer';
  fromToken: string;
  fromAmount: string;
  toToken: string;
  toAmount: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: number;
  hash: string;
  recipient?: string;
}

const STORAGE_KEY = 'arcswap_transactions_history';

const INITIAL_SAMPLE_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-1',
    type: 'swap',
    fromToken: 'USDC',
    fromAmount: '25.00',
    toToken: 'ARC',
    toAmount: '26.25',
    status: 'completed',
    timestamp: Date.now() - 1000 * 60 * 12, // 12 mins ago
    hash: '0x3a8291b703e2c34d82910fae109823c892b1a823901bca0921820491823ab08c',
  },
  {
    id: 'tx-2',
    type: 'swap',
    fromToken: 'ARC',
    fromAmount: '10.00',
    toToken: 'USDT',
    toAmount: '9.40',
    status: 'completed',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    hash: '0x8b12f492019a28b0129c92e1093a8217032910bc8201a90218920148209384bc',
  },
  {
    id: 'tx-3',
    type: 'transfer',
    fromToken: 'USDC',
    fromAmount: '50.00',
    toToken: 'USDC',
    toAmount: '50.00',
    status: 'completed',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    hash: '0x1c94f102938a9018274019283749018273940182739401827394018273940182',
    recipient: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  },
  {
    id: 'tx-4',
    type: 'swap',
    fromToken: 'USDT',
    fromAmount: '100.00',
    toToken: 'ARC',
    toAmount: '106.00',
    status: 'completed',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    hash: '0x6d9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f',
  }
];

export const saveTransactionToHistory = (tx: Omit<TransactionRecord, 'id' | 'timestamp'>) => {
  try {
    const newRecord: TransactionRecord = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };

    const existingJson = localStorage.getItem(STORAGE_KEY);
    let list: TransactionRecord[] = [];
    if (existingJson) {
      list = JSON.parse(existingJson);
    } else {
      list = [...INITIAL_SAMPLE_TRANSACTIONS];
    }

    const updated = [newRecord, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event for real-time update
    window.dispatchEvent(new CustomEvent('arcswap_tx_added', { detail: newRecord }));
  } catch (err) {
    console.error('Failed to save transaction to history:', err);
  }
};

export const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'swap' | 'transfer' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const loadTransactions = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTransactions(JSON.parse(stored));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_TRANSACTIONS));
        setTransactions(INITIAL_SAMPLE_TRANSACTIONS);
      }
    } catch {
      setTransactions(INITIAL_SAMPLE_TRANSACTIONS);
    }
  };

  useEffect(() => {
    loadTransactions();

    const handleNewTx = () => {
      loadTransactions();
    };

    window.addEventListener('arcswap_tx_added', handleNewTx);
    return () => {
      window.removeEventListener('arcswap_tx_added', handleNewTx);
    };
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear your transaction history?')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setTransactions([]);
    }
  };

  const restoreSampleData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_TRANSACTIONS));
    setTransactions(INITIAL_SAMPLE_TRANSACTIONS);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatTimeAgo = (time: number) => {
    const seconds = Math.floor((Date.now() - time) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filteredTransactions = transactions.filter((tx) => {
    // Filter by type or status
    if (filter === 'swap' && tx.type !== 'swap') return false;
    if (filter === 'transfer' && tx.type !== 'transfer') return false;
    if (filter === 'completed' && tx.status !== 'completed') return false;
    if (filter === 'pending' && tx.status !== 'pending') return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchFrom = tx.fromToken.toLowerCase().includes(query);
      const matchTo = tx.toToken.toLowerCase().includes(query);
      const matchHash = tx.hash.toLowerCase().includes(query);
      const matchRecipient = tx.recipient ? tx.recipient.toLowerCase().includes(query) : false;

      return matchFrom || matchTo || matchHash || matchRecipient;
    }

    return true;
  });

  return (
    <div id="transaction-history" className="glass-card rounded-2xl p-5 sm:p-6 space-y-5 border border-yellow-500/20 bg-slate-950/40 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Recent Transactions</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {transactions.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            View your recent token swaps and transfers on Arc Testnet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadTransactions}
            className="p-2 rounded-lg glass-panel hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200"
            title="Refresh history"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {transactions.length > 0 ? (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 border border-destructive/20 transition-all duration-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          ) : (
            <button
              onClick={restoreSampleData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:bg-amber-400/10 border border-amber-400/30 transition-all duration-200"
            >
              <span>Load Examples</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'swap', 'transfer', 'completed', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all duration-200 ${
                filter === tab
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search token or hash..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-dashed border-white/10 bg-white/5 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">No transactions found</p>
            <p className="text-xs text-muted-foreground/70">
              {transactions.length === 0
                ? 'Your recent swaps and transfers will appear here.'
                : 'Try adjusting your filter or search query.'}
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/50 hover:bg-slate-900/80 border border-white/5 hover:border-amber-500/30 transition-all duration-200 gap-3"
            >
              {/* Left Side: Icon & Details */}
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl flex-shrink-0 ${
                    tx.type === 'swap'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {tx.type === 'swap' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">
                      {tx.type === 'swap' ? (
                        <>
                          Swap <span className="text-amber-400">{tx.fromAmount} {tx.fromToken}</span> for{' '}
                          <span className="text-emerald-400">{tx.toAmount} {tx.toToken}</span>
                        </>
                      ) : (
                        <>
                          Transfer <span className="text-blue-400">{tx.fromAmount} {tx.fromToken}</span>
                          {tx.recipient && (
                            <span className="text-xs text-muted-foreground font-mono ml-1">
                              to {tx.recipient.slice(0, 6)}...{tx.recipient.slice(-4)}
                            </span>
                          )}
                        </>
                      )}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                        tx.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : tx.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {tx.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                      {tx.status === 'pending' && <Clock className="w-3 h-3" />}
                      {tx.status === 'failed' && <AlertCircle className="w-3 h-3" />}
                      {tx.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatTimeAgo(tx.timestamp)}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px]">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[11px] truncate max-w-[100px] sm:max-w-[140px]">
                        {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tx.hash, tx.id)}
                        className="p-1 hover:text-foreground transition-colors"
                        title="Copy transaction hash"
                      >
                        {copiedHash === tx.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Explorer Link */}
              <div className="flex items-center justify-end sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <a
                  href={getExplorerTxUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all duration-200"
                >
                  <span>Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
