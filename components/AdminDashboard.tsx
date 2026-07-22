'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '@/context/Web3Context';

interface AnalyticsData {
  totalVisitors: number;
  walletConnections: number;
  activeUsers: number;
  totalSwaps: number;
  totalVolume: string;
  uniqueWallets: string[];
}

export const AdminDashboard: React.FC = () => {
  const { address } = useWeb3();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisitors: 0,
    walletConnections: 0,
    activeUsers: 0,
    totalSwaps: 0,
    totalVolume: '0',
    uniqueWallets: [],
  });

  useEffect(() => {
    // Load analytics data from localStorage (mock implementation)
    // In production, this would fetch from a backend/database
    const loadAnalytics = () => {
      const stored = localStorage.getItem('arcswap_analytics');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setAnalytics(data);
        } catch {
          // Initialize with default values
          initializeAnalytics();
        }
      } else {
        initializeAnalytics();
      }
    };

    const initializeAnalytics = () => {
      const defaultData: AnalyticsData = {
        totalVisitors: Math.floor(Math.random() * 5000) + 1000,
        walletConnections: Math.floor(Math.random() * 500) + 50,
        activeUsers: Math.floor(Math.random() * 200) + 20,
        totalSwaps: Math.floor(Math.random() * 1000) + 100,
        totalVolume: (Math.random() * 100000 + 10000).toFixed(2),
        uniqueWallets: generateMockWallets(Math.floor(Math.random() * 100) + 20),
      };
      setAnalytics(defaultData);
      localStorage.setItem('arcswap_analytics', JSON.stringify(defaultData));
    };

    loadAnalytics();
  }, []);

  const generateMockWallets = (count: number): string[] => {
    const wallets: string[] = [];
    for (let i = 0; i < count; i++) {
      wallets.push(`0x${Math.random().toString(16).slice(2).padEnd(40, '0')}`);
    }
    return wallets;
  };

  const MetricCard: React.FC<{ label: string; value: string | number; description?: string }> = ({
    label,
    value,
    description,
  }) => (
    <div className="glass-card rounded-2xl p-6 space-y-2">
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="text-3xl font-bold text-gradient">{value.toLocaleString()}</p>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Key Metrics */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            label="Total Visitors"
            value={analytics.totalVisitors}
            description="Unique page visits"
          />
          <MetricCard
            label="Wallet Connections"
            value={analytics.walletConnections}
            description="Total connected wallets"
          />
          <MetricCard
            label="Active Users"
            value={analytics.activeUsers}
            description="Users active this session"
          />
          <MetricCard
            label="Total Swaps"
            value={analytics.totalSwaps}
            description="Token swaps executed"
          />
          <MetricCard
            label="Trading Volume"
            value={`$${analytics.totalVolume}`}
            description="Total USD value swapped"
          />
          <MetricCard
            label="Unique Wallets"
            value={analytics.uniqueWallets.length}
            description="Unique wallet addresses"
          />
        </div>
      </div>

      {/* Wallet Activity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Recent Wallet Activity</h2>
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-2">
            {analytics.uniqueWallets.length > 0 ? (
              analytics.uniqueWallets.slice(0, 10).map((wallet, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-card/50 border border-border text-sm font-mono text-muted-foreground hover:bg-card/80 transition-colors"
                >
                  {wallet}
                  <span className="ml-2 text-xs text-primary">#{idx + 1}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No wallet activity recorded</p>
            )}
          </div>
          {analytics.uniqueWallets.length > 10 && (
            <p className="text-xs text-muted-foreground text-center pt-4">
              +{analytics.uniqueWallets.length - 10} more wallets
            </p>
          )}
        </div>
      </div>

      {/* System Information */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">System Information</h2>
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Status</span>
            <span className="text-green-400 font-semibold">● Online</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Network</span>
            <span className="text-foreground font-semibold">Arc Testnet (5042002)</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="text-foreground font-semibold">{new Date().toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Admin User</span>
            <span className="text-foreground font-mono text-sm">{address || 'Not connected'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
