# Quick Amount Percentage Buttons

## Feature Overview
Added quick-select percentage buttons (25%, 50%, 100%) to both Swap Tokens and Send USDC components for improved UX.

## Swap Tokens Component (SwapTokens.tsx)

### Added Handler
```typescript
const handlePercentage = (percentage: number) => {
  const maxAmount = 100; // Mock max balance
  const amount = (maxAmount * percentage / 100).toFixed(6);
  setFromAmount(amount);
  setError(null);

  const rate = exchangeRates[swapFrom][swapTo];
  const calculated = (parseFloat(amount) * rate).toFixed(6);
  setToAmount(calculated);
};
```

### UI Buttons
- 25% button - Selects 25 tokens of max balance
- 50% button - Selects 50 tokens of max balance
- 100% button - Selects 100 tokens of max balance (Max)

### Features
- Automatically calculates output amount based on exchange rate
- Clears any previous errors when clicked
- Disabled while swapping is in progress
- Visual feedback with hover state

---

## Send USDC Component (TokenSwap.tsx)

### Added Handler
```typescript
const handlePercentage = (percentage: number) => {
  if (!balance) return;
  
  const balanceNum = parseFloat(balance);
  const calculatedAmount = (balanceNum * percentage / 100).toFixed(6);
  setAmount(calculatedAmount);
  setError(null);
};
```

### UI Buttons
- 25% button - Sends 25% of available USDC balance
- 50% button - Sends 50% of available USDC balance
- 100% button - Sends 100% of available USDC balance (Max)

### Features
- Calculates percentage based on real wallet balance
- Disabled when no balance is available
- Disabled while transfer is in progress
- Error state cleared when percentage selected
- Prevents sending more than available balance

---

## User Experience Flow

### For Swap Tokens
1. User connects wallet
2. Sees amount input field below token selection buttons
3. Click 25%, 50%, or 100% buttons below amount field
4. Amount auto-fills with calculated percentage
5. Output amount auto-calculates based on exchange rate
6. Can now swap immediately or adjust amount

### For Send USDC
1. User connects wallet with USDC balance
2. Sees amount input field below recipient address
3. Click 25%, 50%, or 100% buttons below amount field
4. Amount auto-fills with percentage of available balance
5. Form validates against actual balance
6. Can now transfer immediately or adjust amount

---

## Styling
- Small buttons with text-xs font size
- Full width divided equally (flex-1)
- Secondary background color (matches theme)
- Hover state changes background opacity
- Disabled state grayed out

---

## Technical Details

### Swap Tokens
- Uses mock max amount of 100 tokens
- Calculates output amount using exchange rates
- Works bidirectionally (can update "From" or "To" amount)

### Send USDC
- Uses real balance from Web3 context
- Only enabled when balance exists
- Prevents sending more than available
- Can be combined with address validation

---

## Future Enhancements
- Fetch real max swap amounts from DEX
- Show selected percentage value
- Add "Max" label on 100% button
- Add custom percentage input
- Remember user's preferred percentage
- Add swap preview before confirmation
