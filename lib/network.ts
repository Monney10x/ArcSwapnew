// Arc Testnet Configuration
export const ARC_TESTNET = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
      webSocket: ['wss://rpc.testnet.arc.network'],
    },
    public: {
      http: ['https://rpc.testnet.arc.network'],
      webSocket: ['wss://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
};

// USDC Token Configuration
export const USDC_TOKEN = {
  address: '0x3600000000000000000000000000000000000000',
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
};

// Arc Testnet Faucet Configuration
export const FAUCET_CONFIG = {
  apiUrl: 'https://faucet.circle.com/api',
  claimAmount: '1000', // 1000 USDC in smallest units (6 decimals)
  claimInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

// Faucet Configuration - Official Circle Faucet
export const FAUCET_URL = 'https://faucet.circle.com';

// RPC URLs
export const RPC_URL = 'https://rpc.testnet.arc.network';
export const RPC_WSS_URL = 'wss://rpc.testnet.arc.network';

// Explorer Base URL
export const EXPLORER_URL = 'https://testnet.arcscan.app';

// EIP-6963 Configuration
export const SUPPORTED_CHAINS = [ARC_TESTNET.id];
