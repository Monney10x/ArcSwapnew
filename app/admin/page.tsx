'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Web3Context } from '@/context/Web3Context';
import { ADMIN_CONFIG, isAuthorizedWallet, setAdminSession } from '@/lib/admin.config';

export default function AdminLoginPage() {
  const router = useRouter();
  const web3Context = useContext(Web3Context);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentWallet = web3Context?.address;

  useEffect(() => {
    // Check if already authenticated
    const sessionToken = sessionStorage.getItem('admin_session');
    if (sessionToken) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Hash the password on client side for security
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      // Compare with stored hash
      if (hashHex !== ADMIN_CONFIG.ADMIN_PASSWORD_HASH) {
        setError('Incorrect password');
        setPassword('');
        setIsLoading(false);
        return;
      }

      // Create session (with or without wallet)
      setAdminSession(currentWallet || 'admin-no-wallet');
      
      // Redirect to dashboard with hard reload
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 500);
    } catch (err) {
      setError('Authentication error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0">
        <div className="glow-cyan" />
        <div className="glow-purple" />
        <div className="glow-blue" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-amber-400">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Enter password to access</p>
          </div>

          {currentWallet && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Connected Wallet:</p>
              <p className="text-sm font-mono text-foreground truncate break-all">
                {currentWallet}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 rounded-lg bg-input text-foreground placeholder-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Password required for admin access
          </p>
        </div>
      </div>
    </main>
  );
}
