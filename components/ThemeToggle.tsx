'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-muted" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 transition-colors duration-300"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-foreground transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 text-foreground transition-transform duration-300 -rotate-90 scale-100" />
      )}
    </button>
  );
};

