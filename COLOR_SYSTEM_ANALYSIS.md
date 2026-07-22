# ArcSwap Color System Analysis

## Overview
The ArcSwap application uses a centralized, CSS-variable-based color system implemented through Tailwind CSS v4 with `@theme` directives. There is NO separate Tailwind config file - all color definitions are in `app/globals.css`.

---

## Primary Color System File

### **`app/globals.css` (MAIN SOURCE)**
**Location:** `/vercel/share/v0-project/app/globals.css`

This is the **ONLY** file that defines the global color palette. It uses Tailwind CSS v4's `@theme` block syntax.

#### **Dark Mode Color Palette (Default)**
Lines 5-36 in `@theme` block:

```css
@theme {
  /* Core palette - Dark mode (default) */
  --color-background: #050816;          /* Deep navy-black base */
  --color-foreground: #ffffff;          /* Pure white text */
  
  --color-card: rgba(255, 255, 255, 0.03);          /* Transparent white overlay for cards */
  --color-card-foreground: #ffffff;                 /* White text on cards */
  --color-popover: #0a0f24;                         /* Slightly lighter navy for popovers */
  --color-popover-foreground: #ffffff;              /* White text on popovers */
  
  --color-primary: #00e5ff;             /* Bright cyan - main accent */
  --color-primary-foreground: #050816;  /* Dark text on cyan buttons */
  
  --color-secondary: rgba(255, 255, 255, 0.05);    /* Subtle white overlay */
  --color-secondary-foreground: #ffffff;            /* White text */
  
  --color-muted: rgba(255, 255, 255, 0.04);        /* Very subtle overlay */
  --color-muted-foreground: #94a3b8;                /* Slate grey text */
  
  --color-accent: #7c3aed;              /* Purple accent */
  --color-accent-foreground: #ffffff;   /* White text on purple */
  
  --color-destructive: #f43f5e;         /* Red for destructive actions */
  --color-destructive-foreground: #ffffff;
  
  --color-success: #22d3a7;             /* Green for success states */
  
  --color-border: rgba(255, 255, 255, 0.08);       /* Subtle white borders */
  --color-input: rgba(255, 255, 255, 0.04);        /* Input background */
  --color-ring: rgba(0, 229, 255, 0.5);            /* Focus ring (cyan) */
  
  --font-sans: var(--font-inter), 'Inter Fallback', system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), 'Geist Mono Fallback', monospace;
  
  --radius: 1rem;
}
```

#### **Light Mode Color Palette Overrides**
Lines 39-68 in `html.light` selector:

```css
html.light {
  --color-background: #f8fafc;          /* Very light slate */
  --color-foreground: #0f172a;          /* Dark navy text */
  
  --color-card: #ffffff;                /* Pure white cards */
  --color-card-foreground: #0f172a;     /* Dark text on white */
  --color-popover: #eef2ff;             /* Light lavender popovers */
  --color-popover-foreground: #0f172a;
  
  --color-primary: #00b8d9;             /* Teal cyan (darker for light mode) */
  --color-primary-foreground: #ffffff;  /* White text on teal */
  
  --color-secondary: #eef2ff;           /* Light lavender */
  --color-secondary-foreground: #0f172a;
  
  --color-muted: #f1f5f9;               /* Light slate background */
  --color-muted-foreground: #475569;    /* Medium slate text */
  
  --color-accent: #7c3aed;              /* Same purple accent */
  --color-accent-foreground: #ffffff;
  
  --color-destructive: #e11d48;         /* Darker red */
  --color-destructive-foreground: #ffffff;
  
  --color-success: #059669;             /* Darker green */
  
  --color-border: #e2e8f0;              /* Light grey borders */
  --color-input: #f1f5f9;               /* Light input background */
  --color-ring: rgba(0, 184, 217, 0.5); /* Teal focus ring */
}
```

#### **CSS Variables used:**
The color system maps Tailwind utilities like:
- `bg-background` → `var(--color-background)`
- `text-foreground` → `var(--color-foreground)`
- `bg-card` → `var(--color-card)`
- `bg-primary` → `var(--color-primary)`
- `text-muted-foreground` → `var(--color-muted-foreground)`
- `border-border` → `var(--color-border)`

---

## Component-Level Color Definitions

### **Hardcoded Colors (Not Using Variables)**

#### **1. `NavigationHeader.tsx` - Line 52**
```tsx
<header className="w-full sticky top-0 z-50 border-b border-border bg-[#050816]/80 backdrop-blur-xl group">
```
**Color:** `#050816/80` (Dark navy at 80% opacity)
**Reason:** Arbitrary color used to override default background for navbar - should ideally use `bg-background/80`

#### **2. `ThreeDBackground.tsx` - Line 30**
```typescript
ctx.fillStyle = '#050816';  // Premium dark base
```
**Color:** `#050816` (Dark navy)
**Reason:** Canvas-based animated background using hardcoded color value. This is for the decorative grid pattern overlay.

---

## Glass Morphism Component Styles

Lines 150-190 in `app/globals.css` (`@layer components`):

### **`.glass-card` Class**

**Dark Mode:**
```css
.glass-card {
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 100%
  );
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 1px 0 0 rgba(255, 255, 255, 0.12) inset,
    0 8px 32px -8px rgba(0, 0, 0, 0.8),
    0 20px 64px -20px rgba(0, 0, 0, 0.9),
    0 0 60px -16px rgba(0, 229, 255, 0.15);    /* Cyan glow */
  position: relative;
}
```

**Light Mode Override:**
```css
html.light .glass-card {
  background: linear-gradient(
    160deg,
    #ffffff 0%,
    #f8fafc 100%
  );
  border: 1px solid #e2e8f0;
  box-shadow:
    0 1px 0 0 rgba(255, 255, 255, 0.8) inset,
    0 4px 12px -4px rgba(15, 23, 42, 0.08),
    0 12px 32px -12px rgba(15, 23, 42, 0.12),
    0 0 40px -16px rgba(0, 184, 217, 0.08);    /* Cyan teal glow */
}
```

---

## Text Gradient Classes

Lines 212-240 in `app/globals.css`:

### **`.text-gradient` Class**

**Dark Mode:**
```css
.text-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #8be9ff 60%, #00e5ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

**Light Mode Override:**
```css
html.light .text-gradient {
  background: linear-gradient(135deg, #0f172a 0%, #0891b2 40%, #00b8d9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

### **`.text-gradient-brand` Class**

**Dark Mode:**
```css
.text-gradient-brand {
  background: linear-gradient(135deg, #00e5ff 0%, #7c3aed 100%);
  /* ... clipping properties ... */
}
```

**Light Mode Override:**
```css
html.light .text-gradient-brand {
  background: linear-gradient(135deg, #00b8d9 0%, #7c3aed 100%);
  /* ... clipping properties ... */
}
```

---

## Button Style Definitions

Lines 243-291 in `app/globals.css`:

### **`.btn-primary` Class**

**Dark Mode:**
```css
.btn-primary {
  @apply inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200;
  background: linear-gradient(135deg, #00e5ff 0%, #38bdf8 100%);  /* Cyan to sky-blue */
  color: #050816;  /* Dark text */
  box-shadow:
    0 8px 24px -8px rgba(0, 229, 255, 0.6),
    0 0 0 1px rgba(0, 229, 255, 0.2) inset;
}
```

**Light Mode Override:**
```css
html.light .btn-primary {
  background: linear-gradient(135deg, #00b8d9 0%, #00a3c4 100%);  /* Teal shades */
  color: #ffffff;  /* White text */
  box-shadow:
    0 4px 12px -4px rgba(0, 184, 217, 0.35),
    0 0 0 1px rgba(0, 184, 217, 0.15) inset;
}
```

### **`.btn-gradient` Class**

**Dark Mode:**
```css
.btn-gradient {
  background: linear-gradient(135deg, #00e5ff 0%, #7c3aed 100%);  /* Cyan to purple */
  color: #ffffff;
  box-shadow: 0 8px 28px -10px rgba(0, 229, 255, 0.55), 0 8px 28px -14px rgba(124, 58, 237, 0.6);
}
```

**Light Mode Override:**
```css
html.light .btn-gradient {
  background: linear-gradient(135deg, #00b8d9 0%, #7c3aed 100%);  /* Teal to purple */
  color: #ffffff;
  box-shadow: 0 8px 28px -10px rgba(0, 184, 217, 0.35), 0 8px 28px -14px rgba(124, 58, 237, 0.35);
}
```

### **`.btn-ghost` Class**

**Dark Mode:**
```css
.btn-ghost {
  @apply inline-flex items-center justify-center gap-2 font-medium transition-all duration-200;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
```

**Light Mode Override:**
```css
html.light .btn-ghost {
  background: #eef2ff;  /* Light lavender */
  border: 1px solid #e2e8f0;
  color: #0f172a;  /* Dark text */
}
```

---

## Input Styles

Lines 334-354 in `app/globals.css`:

### **`.input-premium` Class**

**Dark Mode:**
```css
.input-premium {
  @apply w-full transition-all duration-200;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
.input-premium::placeholder {
  color: rgba(148, 163, 184, 0.6);  /* Slate grey */
}
.input-premium:focus {
  outline: none;
  border-color: rgba(0, 229, 255, 0.5);  /* Cyan focus */
  box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.12);
}
```

**Light Mode Override:**
```css
html.light .input-premium {
  background: #f1f5f9;  /* Light slate */
  border: 1px solid #e2e8f0;  /* Light grey */
  color: #0f172a;  /* Dark text */
}
html.light .input-premium::placeholder {
  color: rgba(71, 85, 105, 0.5);
}
html.light .input-premium:focus {
  outline: none;
  border-color: rgba(0, 184, 217, 0.5);  /* Teal focus */
  box-shadow: 0 0 0 3px rgba(0, 184, 217, 0.08);
}
```

---

## Background Gradients

Lines 391-420 in `app/globals.css`:

### **Dark Mode Background**
```css
html {
  background: linear-gradient(180deg, #030712 0%, #050816 50%, #0A1020 100%);
  background-attachment: fixed;
}
```
**Colors:**
- `#030712` (Very dark navy at top)
- `#050816` (Dark navy in middle)
- `#0A1020` (Slightly lighter navy at bottom)

### **Light Mode Background**
```css
html.light {
  background: linear-gradient(
    180deg,
    #f8fafc 0%,      /* Very light slate */
    #f1f5f9 50%,     /* Light slate */
    #eef2ff 100%     /* Light lavender */
  );
  background-attachment: fixed;
}
```

---

## Atmospheric Glow Effects

Lines 423-475 in `app/globals.css`:

### **Cyan Glow (Top-Left)**
```css
.glow-cyan {
  position: fixed;
  top: -200px;
  left: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.35) 0%, rgba(0, 229, 255, 0.1) 40%, transparent 70%);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 0;
  filter: blur(180px);
}
html.light .glow-cyan {
  display: none;  /* Hidden in light mode */
}
```

### **Purple Glow (Top-Right)**
```css
.glow-purple {
  position: fixed;
  top: -150px;
  right: -150px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(124, 58, 237, 0.08) 40%, transparent 70%);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 0;
  filter: blur(180px);
}
html.light .glow-purple {
  display: none;  /* Hidden in light mode */
}
```

### **Blue Glow (Center)**
```css
.glow-blue {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.08) 45%, transparent 70%);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 0;
  filter: blur(250px);
}
html.light .glow-blue {
  display: none;  /* Hidden in light mode */
}
```

---

## Component Files Using Color Tokens

### **Files Using `bg-background`, `text-foreground`, or `glass-card`:**

1. **`components/ThemeToggle.tsx`** - Theme toggle button styling
2. **`components/NavigationHeader.tsx`** - Header + wallet button (Line 52 has hardcoded color)
3. **`components/SwapTokens.tsx`** - Swap interface (Line 172, 198, 269 use `text-gradient-brand`, `bg-primary`)
4. **`components/SwapPage.tsx`** - Swap page layout (Lines 15, 30, 40 use text colors and button states)
5. **`components/FaucetCard.tsx`** - Faucet display
6. **`components/WalletSelectorModal.tsx`** - Modal styling (Line 98 uses `glass-panel`, `hover:border-primary`)
7. **`components/TokenSwap.tsx`** - Token swap component (Line 126 uses `text-gradient-brand`)
8. **`components/ComingSoon.tsx`** - Coming soon placeholder (Lines 15, 20, 25 use `bg-primary`, `text-gradient`)
9. **`components/NetworkActionButton.tsx`** - Network action button
10. **`components/NetworkInfo.tsx`** - Network information display
11. **`components/BalanceCard.tsx`** - Balance display
12. **`components/Header.tsx`** - Old header component (Lines 52, 121 use `bg-background`, `bg-card`)
13. **`components/ui/button.tsx`** - Button component (Line 13 hardcoded cyan colors for accessibility)
14. **`app/layout.tsx`** - Root layout (Line 49 uses `bg-background`, `text-foreground`)
15. **`app/page.tsx`** - Home page (Lines 15, 33 use `bg-background`, `text-gradient`)

---

## Theme Context & Provider

### **`context/ThemeContext.tsx`**
Manages theme state and applies `html` class:
- Reads from localStorage key `arcswap-theme`
- Sets `html.classList.add('dark')` or `html.classList.add('light')`
- All CSS variables update automatically based on `html.light` selector

### **`components/ThemeToggle.tsx`**
- Sun icon for light mode, Moon icon for dark mode
- Calls `useTheme().toggleTheme()` to switch themes
- 300ms smooth transition via CSS `transition-colors duration-300`

---

## Build Configuration

### **`postcss.config.mjs`**
```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```
**Uses:** Tailwind CSS v4 PostCSS plugin (no separate tailwind.config.js needed)

### **`package.json` Dependencies**
- `"tailwindcss": "^4.2.0"` - Tailwind CSS v4
- `"@tailwindcss/postcss": "^4.2.0"` - PostCSS integration
- `"postcss": "^8.5"` - PostCSS processor
- `"next": "16.2.6"` - Next.js 16

---

## Color Value Summary Table

| Token | Dark Mode | Light Mode | Usage |
|-------|-----------|-----------|-------|
| **background** | `#050816` | `#f8fafc` | Page/body background |
| **foreground** | `#ffffff` | `#0f172a` | Primary text color |
| **card** | `rgba(255,255,255,0.03)` | `#ffffff` | Card backgrounds |
| **primary** | `#00e5ff` | `#00b8d9` | Main CTA buttons, accents |
| **secondary** | `rgba(255,255,255,0.05)` | `#eef2ff` | Secondary UI elements |
| **muted** | `rgba(255,255,255,0.04)` | `#f1f5f9` | Muted backgrounds |
| **muted-foreground** | `#94a3b8` | `#475569` | Secondary text |
| **accent** | `#7c3aed` | `#7c3aed` | Purple accent (same in both) |
| **destructive** | `#f43f5e` | `#e11d48` | Error states |
| **success** | `#22d3a7` | `#059669` | Success states |
| **border** | `rgba(255,255,255,0.08)` | `#e2e8f0` | Borders |
| **input** | `rgba(255,255,255,0.04)` | `#f1f5f9` | Input backgrounds |

---

## Key Dark Blue Colors (#050816 variants)

The current dark blue palette consists of:

| Hex Value | Name | Usage |
|-----------|------|-------|
| `#030712` | Very Dark Navy | Background gradient (top) |
| `#050816` | Dark Navy | Primary background, navbar background |
| `#0A1020` | Slightly Lighter Navy | Background gradient (bottom), popover |
| `#0a0f24` | Alternate Navy | Popover background |

**All defined in `app/globals.css` Lines 5-36 (dark mode) and used throughout components via CSS variables.**

---

## Summary: Single Source of Truth

✅ **Primary Source:** `app/globals.css` (ONLY file defining colors)
✅ **Theme Management:** `context/ThemeContext.tsx` (toggles `html.light` class)
✅ **Component Usage:** 15+ component files reference color tokens (not hardcoding colors)
✅ **Build System:** Tailwind CSS v4 with PostCSS
❌ **No Separate Config:** No `tailwind.config.js` or `tailwind.config.ts` file exists
❌ **No Utility Classes Defined:** Colors are purely CSS variables, no arbitrary Tailwind utilities except 2 hardcoded instances
