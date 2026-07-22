// Admin configuration - Secure admin wallet and password
export const ADMIN_CONFIG = {
  // Admin wallet address - only this wallet can access admin panel
  ADMIN_WALLET: '0xc199a683C4935Cc6f5bb01BCBFBb6D9Df53038e8',
  
  // Admin password SHA-256 hash
  ADMIN_PASSWORD_HASH: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
  
  // Session timeout in milliseconds (24 hours)
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
  
  // Session storage keys
  SESSION_KEYS: {
    TOKEN: 'admin_session',
    LOGIN_TIME: 'admin_login_time',
    WALLET: 'admin_wallet',
  },
};

// Verify if wallet is authorized
export const isAuthorizedWallet = (walletAddress: string): boolean => {
  if (!walletAddress) return false;
  return walletAddress.toLowerCase() === ADMIN_CONFIG.ADMIN_WALLET.toLowerCase();
};

// Check if session is valid
export const isValidSession = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = sessionStorage.getItem(ADMIN_CONFIG.SESSION_KEYS.TOKEN);
  const loginTime = sessionStorage.getItem(ADMIN_CONFIG.SESSION_KEYS.LOGIN_TIME);
  
  if (!token || !loginTime) return false;
  
  const elapsed = Date.now() - parseInt(loginTime);
  if (elapsed > ADMIN_CONFIG.SESSION_TIMEOUT) {
    clearAdminSession();
    return false;
  }
  
  return true;
};

// Clear admin session
export const clearAdminSession = (): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_CONFIG.SESSION_KEYS.TOKEN);
  sessionStorage.removeItem(ADMIN_CONFIG.SESSION_KEYS.LOGIN_TIME);
  sessionStorage.removeItem(ADMIN_CONFIG.SESSION_KEYS.WALLET);
};

// Set admin session
export const setAdminSession = (wallet: string): void => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_CONFIG.SESSION_KEYS.TOKEN, 'authenticated');
  sessionStorage.setItem(ADMIN_CONFIG.SESSION_KEYS.LOGIN_TIME, Date.now().toString());
  sessionStorage.setItem(ADMIN_CONFIG.SESSION_KEYS.WALLET, wallet);
};
