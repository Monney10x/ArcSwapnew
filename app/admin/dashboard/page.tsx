'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '@/components/AdminDashboard';
import { isValidSession, clearAdminSession } from '@/lib/admin.config';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if session is valid (wallet + password verified)
    if (!isValidSession()) {
      // No valid session, redirect to login
      clearAdminSession();
      router.push('/admin');
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  const handleLogout = async () => {
    clearAdminSession();
    // Force a hard redirect to home page
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will redirect
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="absolute inset-0 z-0">
        <div className="glow-cyan" />
        <div className="glow-purple" />
        <div className="glow-blue" />
      </div>

      <div className="relative z-10">
        {/* Admin Header */}
        <div className="border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <AdminDashboard />
      </div>
    </main>
  );
}
