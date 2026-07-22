# ArcSwap - Token Swap Features

## Overview
The ArcSwap platform now features two distinct swap operations:

## 1. Swap Tokens (SwapTokens Component)
**Purpose:** Exchange between ARC, USDC, and USDT tokens

### Supported Swap Pairs:
- ARC ↔ USDC
- ARC ↔ USDT
- USDC ↔ USDT
- USDT ↔ USDC

### Features:
- **Dynamic Token Selection:** Click buttons to select "From" and "To" tokens
- **Automatic Rate Calculation:** Real-time exchange rate display
- **Bidirectional Input:** Update "From" amount or "To" amount, rates calculate automatically
- **Swap Direction Button:** Click ⇅ to quickly reverse the swap direction
- **Exchange Rate Display:** Shows current rate and calculated output amount
- **Error Handling:** Validates amounts and displays helpful error messages
- **Loading States:** Visual feedback during swap processing

### UI Flow:
1. User selects "From" token (ARC, USDC, or USDT)
2. User enters amount to swap
3. System displays real-time conversion to "To" token
4. User can swap direction or select different token
5. Click "Swap" button to execute transaction
6. Success/error feedback displayed

### Exchange Rates (Mock):
```
ARC → USDC: 0.95
ARC → USDT: 0.94
USDC → ARC: 1.05
USDC → USDT: 0.99
USDT → ARC: 1.06
USDT → USDC: 1.01
```

---

## 2. Send USDC (SendUSDC Component)
**Purpose:** Transfer USDC to another Arc Testnet wallet address

### Features:
- **Recipient Address Input:** Validate Ethereum address format (0x...)
- **Amount Input:** Select USDC amount with validation
- **Balance Display:** Shows current USDC balance in real-time
- **Validation:**
  - Valid Ethereum address (0x followed by 40 hex characters)
  - Valid amount (> 0)
  - Sufficient balance check
  - Cannot send to same address
- **Transaction Tracking:** View transaction hash on ArcScan explorer
- **Error Handling:** Clear error messages for all validation failures
- **Success Feedback:** Shows confirmation with explorer link

### UI Flow:
1. Display current USDC balance
2. User enters recipient wallet address
3. User enters transfer amount
4. System validates form
5. User clicks "Transfer USDC"
6. Transaction processed
7. Success message with ArcScan link shown
8. Form resets for next transfer

### Validation Rules:
```
- Recipient address must be valid Ethereum format
- Amount must be > 0
- Amount must not exceed available balance
- Cannot transfer to connected wallet address
```

---

## Swap Page Component (SwapPage.tsx)
Wrapper component that manages both swap features with a tab interface

### Tabs:
1. **Swap Tokens** - Shows SwapTokens component
2. **Send USDC** - Shows SendUSDC component

### Layout:
- Left column (2/3 width): Active swap component
- Right column (1/3 width): Quick stats panel (sticky)
  - 24h Volume
  - Total TVL
  - Swap Fee
  - Supported Tokens

### Tab Features:
- Visual indicator for active tab
- Smooth transitions between tabs
- Stats panel remains visible while switching tabs
- Tab state persists during browsing

---

## Files Structure
```
components/
├── SwapTokens.tsx      (ARC ↔ USDC/USDT swaps)
├── TokenSwap.tsx       (USDC transfers - renamed from old usage)
├── SendUSDC.tsx        (Export alias in TokenSwap.tsx)
└── SwapPage.tsx        (Tab wrapper component)

app/
└── page.tsx            (Uses SwapPage component)
```

---

## Integration Points
- **Web3 Context:** Uses wallet connection and network state
- **Button Component:** shadcn/ui Button component
- **Dark Theme:** Fully styled for dark mode
- **Responsive Design:** Mobile and desktop layouts supported

---

## Future Enhancements
- Real DEX integration (Uniswap/SushiSwap)
- Liquidity pool support
- Gas fee estimation
- Slippage tolerance settings
- Transaction history
- Multi-token swap routes
