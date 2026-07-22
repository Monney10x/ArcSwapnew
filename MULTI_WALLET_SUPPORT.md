# Multi-Wallet Support - MetaMask, OKX Wallet, Rabby

## Feature Overview
ArcSwap now supports connecting with multiple Web3 wallets instead of just MetaMask!

### Supported Wallets
1. **MetaMask** 🦊 - Popular Web3 wallet browser extension
2. **OKX Wallet** ⬜ - OKX multichain crypto wallet  
3. **Rabby Wallet** 🐰 - User-friendly wallet for DeFi

## How It Works

### User Flow
1. User clicks "Connect Wallet" button
2. Wallet selector modal appears showing all 3 wallet options
3. User chooses their preferred wallet (MetaMask, OKX, or Rabby)
4. Selected wallet's connection popup appears
5. User approves connection in their wallet
6. ArcSwap detects wallet selection and displays it in header

### Header Display
- Connected users see wallet icon + shortened address
- Example: "🦊 0x1234...5678" (MetaMask connected)
- Example: "⬜ 0xabcd...ef00" (OKX Wallet connected)
- Example: "🐰 0x9999...0001" (Rabby Wallet connected)

## Technical Implementation

### New Components

#### WalletSelectorModal.tsx
Modal dialog that displays available wallets for user selection:
- Shows all 3 wallet options with icons and descriptions
- Handles wallet selection
- Displays loading state during connection
- Allows cancel action

**Structure:**
```tsx
interface WalletProvider {
  id: string;           // 'metamask' | 'okx' | 'rabby'
  name: string;         // Display name
  icon: string;         // Emoji icon
  description: string;  // Brief description
}
```

### Updated Web3 Utilities (lib/web3.ts)

#### New Functions
- `getWalletProvider(walletId)` - Returns window.ethereum, window.okxwallet, or window.rabby
- `getAvailableWallets()` - Returns array of installed wallets on device
- `connectWallet(walletId)` - Connects specific wallet instead of just MetaMask

#### Enhanced Functions
- `getSigner(walletProvider)` - Now accepts optional wallet provider
- `switchToArcTestnet(walletProvider)` - Now accepts optional wallet provider
- `getCurrentChainId(walletProvider)` - Now accepts optional wallet provider
- `addArcNetwork(walletProvider)` - Now accepts optional wallet provider

### Updated Web3Context

#### New State
```tsx
const [walletId, setWalletId] = useState<string | null>(null);
const [showWalletSelector, setShowWalletSelector] = useState(false);
```

#### New Functions
```tsx
connect(selectedWalletId: string) // With wallet selection
openWalletSelector()               // Show wallet modal
closeWalletSelector()              // Hide wallet modal
```

### Updated Header Component

#### Features
- Click "Connect Wallet" opens wallet selector modal
- Display selected wallet with icon: "🦊 MetaMask", "⬜ OKX", "🐰 Rabby"
- Connected menu shows which wallet is active
- Can disconnect and select a different wallet

**Connected Address Display:**
```
Connected Address
0x1234567890abcdef1234567890abcdef12345678

🦊 MetaMask
```

## User Benefits

✅ **Choose Your Preferred Wallet** - Not forced to use MetaMask
✅ **Better UX** - Clear wallet selection dialog
✅ **Wallet Branding** - See which wallet you're connected with  
✅ **Multi-wallet Support** - Switch between MetaMask/OKX/Rabby
✅ **Wallet Detection** - Only shows installed wallets on device

## Detection Logic

The app automatically detects which wallets are available on user's browser:
- If MetaMask installed → Shows MetaMask option
- If OKX Wallet installed → Shows OKX option  
- If Rabby installed → Shows Rabby option
- Can show multiple if user has multiple wallets installed

## Storage

Selected wallet ID is stored in localStorage:
```javascript
localStorage.getItem('selectedWalletId') 
// Returns: 'metamask' | 'okx' | 'rabby'
```

Enables remembering user's preferred wallet on next visit.

## API Compatibility

All three wallets are EIP-1193 compatible:
- eth_requestAccounts
- eth_accounts  
- wallet_addEthereumChain
- wallet_switchEthereumChain
- eth_chainId

## Error Handling

**If wallet not installed:**
- User sees "MetaMask not installed. Please install to continue."
- User sees "OKX Wallet not installed. Please install to continue."
- User sees "Rabby not installed. Please install to continue."

**If user rejects connection:**
- Silent handling (error code 4001)
- Modal closes, can try again
- No error popup shown

**If network switch rejected:**
- User kept in current state
- Can try again or use different wallet

## Future Enhancements
- Add more wallets (Coinbase Wallet, Ledger Live, etc.)
- Wallet-specific configurations
- Custom wallet icons
- Wallet settings per chain
- Persist wallet preference globally

## Files Modified
- `/components/WalletSelectorModal.tsx` (NEW)
- `/lib/web3.ts` - Added multi-wallet functions
- `/context/Web3Context.tsx` - Added wallet selection state
- `/components/Header.tsx` - Integrated wallet selector
