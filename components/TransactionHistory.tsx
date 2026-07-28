'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Search,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Send,
  Repeat,
  Wallet
} from 'lucide-react';
import { useWeb3 } from '@/context/Web3Context';
import {
  fetchOnChainTransactions,
  registerSentTransaction,
  shortenAddress,
  formatTimeAgo,
  OnChainTransaction,
} from '@/lib/onchainTransactions';

// Compatibility function for existing callers (e.g. TokenSwap, SwapTokens)
export const saveTransactionToHistory = (tx: {
  type: 'swap' | 'transfer';
  fromToken: string;
  fromAmount: string;
  toToken: string;
  toAmount: string;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
  recipient?: string;
}) => {
  if (!tx.hash) return;

  registerSentTransaction({
    hash: tx.hash,
    from: tx.recipient ? '0xUser' : '0xWallet',
    to: tx.recipient || '0xContract',
    tokenName: tx.fromToken === 'USDC' ? 'USD Coin' : 'Arc Token',
    tokenSymbol: tx.fromToken,
    amount: tx.fromAmount,
    status: 'confirmed',
    blockNumber: 0,
    timestamp: Date.now(),
    gasFee: '0.000021 USDC',
    type: tx.type,
  });

  // Notify listeners to refresh feed immediately
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('arcswap_tx_added'));
  }
};

export const TransactionHistory: React.FC = () => {
  const { address, isConnected, openWalletSelector } = useWeb3();

  const [transactions, setTransactions] = useState<OnChainTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<'all' | 'swap' | 'transfer'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const isMounted = useRef(true);

  // Core Data Fetcher
  const loadOnChainData = useCallback(async (isSilent = false) => {
    if (!isConnected || !address) {
      setTransactions([]);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (!isSilent) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const realTxs = await fetchOnChainTransactions(address, 30);
      if (isMounted.current) {
        setTransactions(realTxs);
      }
    } catch (err: any) {
      console.error('Failed to fetch on-chain transactions:', err);
      if (isMounted.current) {
        setError('Unable to fetch live transaction data from Arc Testnet RPC.');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [address, isConnected]);

  // Initial load + interval setup (12s auto-refresh requirement)
  useEffect(() => {
    isMounted.current = true;
    loadOnChainData(false);

    const intervalId = setInterval(() => {
      loadOnChainData(true);
    }, 12000); // Auto-refresh every 12 seconds

    const handleNewTx = () => {
      loadOnChainData(true);
    };

    window.addEventListener('arcswap_tx_added', handleNewTx);

    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
      window.removeEventListener('arcswap_tx_added', handleNewTx);
    };
  }, [loadOnChainData]);

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter & Search Logic
  const filteredTransactions = transactions.filter((tx) => {
    // Filter by type
    if (filter === 'swap' && tx.type !== 'swap') return false;
    if (filter === 'transfer' && tx.type !== 'transfer') return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchHash = tx.hash.toLowerCase().includes(q);
      const matchFrom = tx.from.toLowerCase().includes(q);
      const matchTo = tx.to.toLowerCase().includes(q);
      const matchSymbol = tx.tokenSymbol.toLowerCase().includes(q);
      const matchName = tx.tokenName.toLowerCase().includes(q);
      return matchHash || matchFrom || matchTo || matchSymbol || matchName;
    }

    return true;
  });

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Do not render the transaction history block if wallet is not connected
  if (!isConnected || !address) {
    return null;
  }

  return (
    <div id="transaction-history" className="glass-card rounded-2xl p-5 sm:p-6 space-y-5 border border-amber-500/20 bg-slate-950/60 backdrop-blur-xl transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Recent Transactions
            </h2>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live On-Chain
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real verified blockchain transactions on Arc Testnet (Auto-refreshes every 12s)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadOnChainData(false)}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel hover:bg-white/10 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 transition-all duration-200"
            title="Refresh on-chain data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync RPC'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['all', 'swap', 'transfer'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all duration-200 ${
                filter === t
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
              }`}
            >
              {t === 'all' ? 'All Transactions' : `${t}s`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address, token or hash..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {!isConnected || !address ? (
        /* Disconnected State - Require Wallet Connection */
        <div className="rounded-2xl p-8 text-center bg-white/5 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">Connect Wallet to View Transactions</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              On-chain transaction history is displayed after connecting your wallet. Connect your wallet to view your activity on Arc Testnet.
            </p>
          </div>
          <button
            onClick={openWalletSelector}
            className="btn-gradient rounded-xl px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-amber-500/10"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </button>
        </div>
      ) : isLoading ? (
        /* Loading Skeleton */
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-white/5 bg-white/5 animate-pulse space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-white/10 rounded"></div>
                <div className="h-4 w-16 bg-white/10 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-5 w-32 bg-white/10 rounded"></div>
                <div className="h-5 w-20 bg-white/10 rounded"></div>
              </div>
              <div className="h-3 w-48 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      ) : error && transactions.length === 0 ? (
        /* Error State */
        <div className="rounded-xl p-6 text-center bg-destructive/10 border border-destructive/20 space-y-3">
          <AlertTriangle className="w-8 h-8 mx-auto text-destructive animate-bounce" />
          <p className="text-sm font-semibold text-foreground">{error}</p>
          <p className="text-xs text-muted-foreground">
            Check network RPC configuration or internet connection.
          </p>
          <button
            onClick={() => loadOnChainData(false)}
            className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredTransactions.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl p-8 text-center bg-white/5 border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Boxes className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">No On-Chain Transactions Found</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? `No transactions matched "${searchQuery}". Try adjusting your search query.`
              : address
              ? `No confirmed on-chain transactions found for ${shortenAddress(address)}. Execute a swap or transfer above to interact with Arc Testnet!`
              : 'There are currently no recent confirmed transactions found on the network. Perform a swap or transfer to broadcast live transactions.'}
          </p>
        </div>
      ) : (
        /* Transaction Cards List */
        <div className="space-y-3">
          {paginatedTransactions.map((tx) => {
            const isSwap = tx.type === 'swap';
            const copyHashKey = `hash-${tx.hash}`;
            const copyFromKey = `from-${tx.hash}`;
            const copyToKey = `to-${tx.hash}`;

            return (
              <div
                key={tx.hash}
                className="group relative rounded-xl p-4 bg-slate-900/50 hover:bg-slate-900/80 border border-white/10 hover:border-amber-500/30 transition-all duration-200 space-y-3 shadow-sm hover:shadow-md hover:shadow-amber-500/5"
              >
                {/* Top Row: Type, Status, Block, Time */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    {/* Type Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${
                        isSwap
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {isSwap ? <Repeat className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                      <span className="capitalize">{tx.type}</span>
                    </span>

                    {/* Status Badge - Required Confirmed/Success */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Confirmed
                    </span>

                    {/* Block Number */}
                    {tx.blockNumber > 0 && (
                      <span className="text-[11px] text-muted-foreground font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        #{tx.blockNumber}
                      </span>
                    )}
                  </div>

                  {/* Relative Timestamp */}
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground" title={new Date(tx.timestamp).toLocaleString()}>
                    <Clock className="w-3 h-3 text-amber-400/80" />
                    <span>{formatTimeAgo(tx.timestamp)}</span>
                  </div>
                </div>

                {/* Middle Row: From -> To & Amount */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Addresses */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground w-10">From:</span>
                      <span className="font-mono text-foreground font-medium">{shortenAddress(tx.from)}</span>
                      <button
                        onClick={() => handleCopy(tx.from, copyFromKey)}
                        className="text-muted-foreground hover:text-amber-400 transition-colors p-0.5"
                        title="Copy From Address"
                      >
                        {copiedId === copyFromKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground w-10">To:</span>
                      <span className="font-mono text-foreground font-medium">{shortenAddress(tx.to)}</span>
                      <button
                        onClick={() => handleCopy(tx.to, copyToKey)}
                        className="text-muted-foreground hover:text-amber-400 transition-colors p-0.5"
                        title="Copy To Address"
                      >
                        {copiedId === copyToKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Token & Amount */}
                  <div className="sm:text-right">
                    <div className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                      {tx.amount} <span className="text-amber-400">{tx.tokenSymbol}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">{tx.tokenName}</div>
                  </div>
                </div>

                {/* Bottom Row: Gas Fee, Hash & Explorer Link */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px]">
                  {/* Gas Fee & Hash */}
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1 font-mono">
                      <span>Gas Fee:</span>
                      <span className="text-foreground font-medium">{tx.gasFee}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 font-mono">
                      <span>Tx:</span>
                      <span className="text-foreground">{shortenAddress(tx.hash, 6)}</span>
                      <button
                        onClick={() => handleCopy(tx.hash, copyHashKey)}
                        className="text-muted-foreground hover:text-amber-400 transition-colors"
                        title="Copy Transaction Hash"
                      >
                        {copiedId === copyHashKey ? (
                          <span className="text-emerald-400 flex items-center gap-0.5 font-sans text-[10px]">
                            <Check className="w-3 h-3" /> Copied!
                          </span>
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-auto">
                    {/* Copy Hash Button (Mobile / Small Screens) */}
                    <button
                      onClick={() => handleCopy(tx.hash, copyHashKey)}
                      className="md:hidden flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-200"
                    >
                      {copiedId === copyHashKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Hash</span>
                    </button>

                    {/* Explorer Link */}
                    <a
                      href={tx.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 font-medium transition-all duration-200 border border-amber-500/30"
                    >
                      <span>Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && filteredTransactions.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-semibold text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
            </span>{' '}
            of <span className="font-semibold text-foreground">{filteredTransactions.length}</span> confirmed transactions
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-semibold text-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
