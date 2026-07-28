import { ethers } from 'ethers';
import { RPC_URL, EXPLORER_URL, USDC_TOKEN } from './network';

export interface OnChainTransaction {
  hash: string;
  from: string;
  to: string;
  tokenName: string;
  tokenSymbol: string;
  amount: string;
  status: 'confirmed';
  blockNumber: number;
  timestamp: number; // Unix timestamp in ms
  gasFee: string; // Formatted string with symbol, e.g. "0.000021 USDC"
  type: 'swap' | 'transfer' | 'contract_interaction';
  explorerUrl: string;
}

// In-memory cache to avoid redundant RPC calls
const txCache = new Map<string, OnChainTransaction>();
let lastFetchedBlock = 0;

// ERC-20 Transfer Event Signature: Transfer(address,address,uint256)
const TRANSFER_EVENT_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

/**
 * Format address to short form: 0x1234...5678
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format timestamp to relative "time ago" string
 */
export function formatTimeAgo(timestampMs: number): string {
  const seconds = Math.floor((Date.now() - timestampMs) / 1000);
  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Process a single transaction and its receipt into an OnChainTransaction object
 */
async function processTransaction(
  provider: ethers.JsonRpcProvider,
  tx: ethers.TransactionResponse | string,
  blockTimestampMs: number,
  userAddress?: string
): Promise<OnChainTransaction | null> {
  try {
    const txHash = typeof tx === 'string' ? tx : tx.hash;

    // Check cache
    if (txCache.has(txHash)) {
      return txCache.get(txHash)!;
    }

    let txObj: ethers.TransactionResponse | null = typeof tx === 'string' ? null : tx;
    if (!txObj) {
      txObj = await provider.getTransaction(txHash);
    }
    if (!txObj) return null;

    // Get receipt to verify status & gas used
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) return null;

    // REQUIREMENT: Display ONLY successful and confirmed transactions
    if (receipt.status !== 1) {
      return null;
    }

    // Calculate Gas Fee
    const gasUsed = receipt.gasUsed ?? 0n;
    const gasPrice = receipt.gasPrice ?? txObj.gasPrice ?? 0n;
    const gasFeeWei = gasUsed * gasPrice;
    const gasFeeFormatted = parseFloat(ethers.formatUnits(gasFeeWei, 6)).toFixed(6); // USDC has 6 decimals on Arc
    const gasFeeDisplay = `${gasFeeFormatted} USDC`;

    let tokenName = 'USD Coin';
    let tokenSymbol = 'USDC';
    let amountFormatted = '0.00';
    let txType: 'swap' | 'transfer' | 'contract_interaction' = 'transfer';

    // Check value transfer
    const nativeValue = txObj.value ?? 0n;

    // Inspect logs for ERC-20 transfers or Dex events
    const transferLogs = receipt.logs.filter(
      (log) => log.topics && log.topics[0] === TRANSFER_EVENT_TOPIC
    );

    if (transferLogs.length > 0) {
      if (transferLogs.length > 1) {
        txType = 'swap';
      } else {
        txType = 'transfer';
      }

      // Pick the primary transfer log
      const primaryLog = transferLogs[0];
      try {
        const valBigInt = BigInt(primaryLog.data);
        // Default to 6 decimals for USDC/Arc testnet tokens
        amountFormatted = parseFloat(ethers.formatUnits(valBigInt, 6)).toFixed(2);
      } catch {
        amountFormatted = '0.00';
      }

      if (primaryLog.address.toLowerCase() === USDC_TOKEN.address.toLowerCase()) {
        tokenName = USDC_TOKEN.name;
        tokenSymbol = USDC_TOKEN.symbol;
      } else {
        tokenName = 'Arc Token';
        tokenSymbol = 'ARC';
      }
    } else if (nativeValue > 0n) {
      txType = 'transfer';
      tokenName = 'USD Coin';
      tokenSymbol = 'USDC';
      amountFormatted = parseFloat(ethers.formatUnits(nativeValue, 6)).toFixed(2);
    } else {
      txType = 'contract_interaction';
      tokenName = 'Arc Network';
      tokenSymbol = 'ARC';
      amountFormatted = '0.00';
    }

    const onChainTx: OnChainTransaction = {
      hash: txHash,
      from: txObj.from,
      to: txObj.to || receipt.to || '0x0000000000000000000000000000000000000000',
      tokenName,
      tokenSymbol,
      amount: amountFormatted,
      status: 'confirmed',
      blockNumber: receipt.blockNumber,
      timestamp: blockTimestampMs,
      gasFee: gasFeeDisplay,
      type: txType,
      explorerUrl: `${EXPLORER_URL}/tx/${txHash}`,
    };

    txCache.set(txHash, onChainTx);
    return onChainTx;
  } catch (err) {
    console.warn(`Failed to process transaction:`, err);
    return null;
  }
}

/**
 * Try fetching transactions via ArcScan Explorer API if available
 */
async function fetchFromExplorerApi(userAddress?: string): Promise<OnChainTransaction[]> {
  try {
    const baseUrl = `${EXPLORER_URL}/api`;
    const params = new URLSearchParams({
      module: 'account',
      action: 'txlist',
      sort: 'desc',
      page: '1',
      offset: '20',
    });

    if (userAddress) {
      params.append('address', userAddress);
    } else {
      // General recent transactions endpoint or fallback
      params.append('address', USDC_TOKEN.address);
    }

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 10 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (data.status !== '1' || !Array.isArray(data.result)) return [];

    const results: OnChainTransaction[] = [];
    for (const item of data.result) {
      // Ensure only successful / confirmed transactions
      if (item.txreceipt_status !== '1' && item.isError !== '0') continue;

      const hash = item.hash;
      if (!hash) continue;

      if (txCache.has(hash)) {
        results.push(txCache.get(hash)!);
        continue;
      }

      const timestampMs = item.timeStamp ? parseInt(item.timeStamp, 10) * 1000 : Date.now();
      const gasUsed = BigInt(item.gasUsed || '0');
      const gasPrice = BigInt(item.gasPrice || '0');
      const gasFeeWei = gasUsed * gasPrice;
      const gasFeeFormatted = parseFloat(ethers.formatUnits(gasFeeWei, 6)).toFixed(6);

      let val = '0.00';
      try {
        val = parseFloat(ethers.formatUnits(BigInt(item.value || '0'), 6)).toFixed(2);
      } catch {
        val = '0.00';
      }

      const txRecord: OnChainTransaction = {
        hash,
        from: item.from,
        to: item.to || '0x0000000000000000000000000000000000000000',
        tokenName: 'USD Coin',
        tokenSymbol: 'USDC',
        amount: val,
        status: 'confirmed',
        blockNumber: parseInt(item.blockNumber, 10) || 0,
        timestamp: timestampMs,
        gasFee: `${gasFeeFormatted} USDC`,
        type: item.input && item.input !== '0x' ? 'contract_interaction' : 'transfer',
        explorerUrl: `${EXPLORER_URL}/tx/${hash}`,
      };

      txCache.set(hash, txRecord);
      results.push(txRecord);
    }

    return results;
  } catch (err) {
    console.log('[v0] Explorer API fetch skipped:', err);
    return [];
  }
}

/**
 * Fetch real on-chain transactions directly from Arc Testnet RPC
 */
export async function fetchOnChainTransactions(
  userAddress?: string,
  limit = 20
): Promise<OnChainTransaction[]> {
  try {
    // 1. First attempt Explorer API
    const apiTxs = await fetchFromExplorerApi(userAddress);
    if (apiTxs.length >= 5) {
      return apiTxs.slice(0, limit);
    }

    // 2. Direct RPC Fetching
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const latestBlockNumber = await provider.getBlockNumber();

    const txs: OnChainTransaction[] = [];
    const processedHashes = new Set<string>();

    // Scan recent blocks
    const blocksToScan = Math.min(15, latestBlockNumber);
    const blockPromises = [];

    for (let i = 0; i < blocksToScan; i++) {
      const targetBlockNum = latestBlockNumber - i;
      if (targetBlockNum < 0) break;
      blockPromises.push(
        provider.getBlock(targetBlockNum, true).catch(() => null)
      );
    }

    const blocks = await Promise.all(blockPromises);

    for (const block of blocks) {
      if (!block) continue;
      const blockTimeMs = block.timestamp ? block.timestamp * 1000 : Date.now();

      // Get prefetched transactions from block
      const prefetched = block.prefetchedTransactions || [];

      for (const txResponse of prefetched) {
        if (!txResponse || !txResponse.hash) continue;
        if (processedHashes.has(txResponse.hash)) continue;

        // If filtering by userAddress, skip non-matching
        if (userAddress) {
          const u = userAddress.toLowerCase();
          const fromMatch = txResponse.from && txResponse.from.toLowerCase() === u;
          const toMatch = txResponse.to && txResponse.to.toLowerCase() === u;
          if (!fromMatch && !toMatch) continue;
        }

        processedHashes.add(txResponse.hash);

        const processed = await processTransaction(
          provider,
          txResponse,
          blockTimeMs,
          userAddress
        );

        if (processed && processed.status === 'confirmed') {
          txs.push(processed);
          if (txs.length >= limit) break;
        }
      }

      if (txs.length >= limit) break;
    }

    // 3. Fallback: If network is brand new or block scan found fewer than limit,
    // query ERC-20 transfer logs on recent blocks
    if (txs.length < limit) {
      try {
        const fromBlock = Math.max(0, latestBlockNumber - 100);
        const filter: ethers.Filter = {
          fromBlock,
          toBlock: latestBlockNumber,
          topics: [TRANSFER_EVENT_TOPIC],
        };

        if (userAddress) {
          // Add address topic filter if available
          const paddedAddr = ethers.zeroPadValue(userAddress, 32);
          filter.topics = [TRANSFER_EVENT_TOPIC, null, paddedAddr]; // transfer TO user
        }

        const logs = await provider.getLogs(filter).catch(() => []);
        const recentLogs = logs.slice(-limit).reverse();

        for (const log of recentLogs) {
          if (!log.transactionHash || processedHashes.has(log.transactionHash)) continue;
          processedHashes.add(log.transactionHash);

          const blockHeader = await provider.getBlock(log.blockNumber).catch(() => null);
          const timeMs = blockHeader?.timestamp ? blockHeader.timestamp * 1000 : Date.now();

          const processed = await processTransaction(
            provider,
            log.transactionHash,
            timeMs,
            userAddress
          );

          if (processed && processed.status === 'confirmed') {
            txs.push(processed);
          }
        }
      } catch (err) {
        console.warn('Log filter query error:', err);
      }
    }

    // Sort newest first
    txs.sort((a, b) => b.timestamp - a.timestamp);

    // Combine with cached transactions
    const combined = Array.from(txCache.values()).filter((tx) => {
      if (userAddress) {
        const u = userAddress.toLowerCase();
        return tx.from.toLowerCase() === u || tx.to.toLowerCase() === u;
      }
      return true;
    });

    combined.sort((a, b) => b.timestamp - a.timestamp);

    return combined.length > 0 ? combined.slice(0, limit) : txs.slice(0, limit);
  } catch (err) {
    console.error('Error fetching on-chain transactions:', err);
    // If cache has items, return them
    const cachedItems = Array.from(txCache.values()).sort((a, b) => b.timestamp - a.timestamp);
    if (cachedItems.length > 0) return cachedItems.slice(0, limit);
    throw err;
  }
}

/**
 * Register a newly sent broadcast transaction into the cache
 */
export function registerSentTransaction(tx: Omit<OnChainTransaction, 'explorerUrl'>) {
  const fullTx: OnChainTransaction = {
    ...tx,
    explorerUrl: `${EXPLORER_URL}/tx/${tx.hash}`,
  };
  txCache.set(tx.hash, fullTx);
}
