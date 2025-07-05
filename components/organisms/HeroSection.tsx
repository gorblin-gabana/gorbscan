"use client";

import React from 'react';
import { StatBox } from '@/components/atoms/StatBox';
import { useGorbchainData } from '@/contexts/GorbchainDataContext';
import { Activity, Zap, Users, TrendingUp, DollarSign, Clock } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { networkStats, loading } = useGorbchainData();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-bold font-orbitron mb-6 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent leading-tight">
          Explore Gorbchain
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          The most advanced blockchain explorer for Gorbchain and its thriving L2 ecosystem.
          Track transactions, explore blocks, and monitor network activity in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatBox
          label="Network TPS"
          value={loading ? "..." : networkStats?.networkHealth?.tps?.toFixed(2) ?? "N/A"}
          icon={Zap}
          tooltip="Transactions per second (TPS)"
        />
        <StatBox
          label="Active Wallets Today"
          value={loading ? "..." : networkStats?.activeWalletsToday?.toLocaleString() ?? "N/A"}
          icon={Users}
          tooltip="Number of unique wallets active today"
        />
        <StatBox
          label="Current Slot"
          value={loading ? "..." : networkStats?.currentSlot?.toLocaleString() ?? "N/A"}
          icon={Activity}
          tooltip="Current Solana slot number"
        />
        <StatBox
          label="Circulating Supply"
          value={loading
            ? "..."
            : networkStats?.supply?.total !== undefined
              ? `${(Number(networkStats.supply.total) / 10**6).toLocaleString(undefined, { maximumFractionDigits: 2 })} M`
              : "N/A"}
          icon={DollarSign}
          tooltip="Current circulating supply of GORB (in millions)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        <StatBox
          label="Total Transactions"
          value={loading ? "..." : networkStats?.totalTransactions?.toLocaleString() ?? "N/A"}
          icon={TrendingUp}
          tooltip="Total transactions processed on Gorbchain"
        />
        <StatBox
          label="Success Rate"
          value={loading ? "..." : networkStats?.networkHealth?.successRate !== undefined ? `${(networkStats.networkHealth.successRate * 100).toFixed(2)}%` : "N/A"}
          icon={TrendingUp}
          tooltip="Transaction success rate"
        />
        <StatBox
          label="Token Count"
          value={loading ? "..." : networkStats?.tokenCount?.toLocaleString() ?? "N/A"}
          icon={TrendingUp}
          tooltip="Number of tokens on Gorbchain"
        />
        <StatBox
          label="Block Time (ms)"
          value={loading ? "..." : networkStats?.networkHealth?.blockTime?.toLocaleString() ?? "N/A"}
          icon={Clock}
          tooltip="Average block time in milliseconds"
        />
      </div>
    </section>
  );
};