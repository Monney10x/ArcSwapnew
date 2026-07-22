'use client';

import React, { useState } from 'react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { SwapPage } from '@/components/SwapPage';
import { FaucetCard } from '@/components/FaucetCard';
import { ComingSoon } from '@/components/ComingSoon';
import { NetworkActionButton } from '@/components/NetworkActionButton';
import { Footer } from '@/components/Footer';
import { CosmicParallaxBg } from '@/components/CosmicParallaxBackground';

export default function Page() {
  const [currentPage, setCurrentPage] = useState<'swap' | 'liquidity' | 'faucet' | 'quests' | 'leaderboard'>('swap');

  return (
    <>
      <CosmicParallaxBg head="ArcSwap" text="Trade, Swap, Earn" loop={true} />
      <main className="min-h-screen bg-background relative z-10">
        <NavigationHeader currentPage={currentPage} onPageChange={setCurrentPage} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
        <div key={currentPage} className="animate-fade-in-up">
          {currentPage === 'swap' && <SwapPage />}

          {currentPage === 'liquidity' && (
            <ComingSoon
              title="Liquidity Pools"
              description="Provide liquidity to earn rewards. This feature will be live soon."
            />
          )}

          {currentPage === 'faucet' && (
            <div>
              <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-gradient mb-3 text-balance">Arc Testnet Faucet</h1>
                <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
                  Claim free testnet tokens to try out ArcSwap and the Arc ecosystem.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
                <FaucetCard />
              </div>
            </div>
          )}

          {currentPage === 'quests' && (
            <ComingSoon
              title="Quests"
              description="Complete tasks to earn rewards and unlock exclusive features."
            />
          )}

          {currentPage === 'leaderboard' && (
            <ComingSoon
              title="Leaderboard"
              description="Compete with other traders and earn recognition in the Arc community."
            />
          )}
        </div>
        </div>

        <NetworkActionButton />
        <Footer />
      </main>
    </>
  );
}

