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
          value={loading ? "..." : networkStats.networkTPS}
          icon={Zap}
          tooltip="Transactions per second across all L2 chains"
        />
        <StatBox 
          label="Active L2 Chains" 
          value={loading ? "..." : networkStats.totalL2Chains}
          icon={Users}
          tooltip="Number of active Layer 2 solutions"
        />
        <StatBox 
          label="Total Blocks" 
          value={loading ? "..." : networkStats.totalBlocks}
          icon={Activity}
          tooltip="Total blocks processed since genesis"
        />
        <StatBox 
          label="Total Value Locked" 
          value={loading ? "..." : networkStats.totalValueLocked}
          icon={TrendingUp}
          tooltip="Combined TVL across all L2 chains"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        <StatBox 
          label="Market Cap" 
          value={loading ? "..." : networkStats.marketCap}
          icon={DollarSign}
          tooltip="Current market valuation"
        />
        <StatBox 
          label="Network Uptime" 
          value={loading ? "..." : networkStats.networkUptime}
          icon={Activity}
          tooltip="Network availability in the last 30 days"
        />
        <StatBox 
          label="Avg Block Time" 
          value={loading ? "..." : networkStats.avgBlockTime}
          icon={Clock}
          tooltip="Average time between block production"
        />
        <StatBox 
          label="Avg Commission" 
          value={loading ? "..." : networkStats.avgCommission}
          icon={TrendingUp}
          tooltip="Average commission rate across the network"
        />
      </div>
    </section>
  );
};