"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { useGorbchainData } from '@/contexts/GorbchainDataContext';
import { L2Chain } from '@/contexts/GorbchainDataContext';
import { ExternalLink, TrendingUp, Users, Clock, Activity, Globe, Zap, DollarSign, Shield } from 'lucide-react';
import { Tag } from '@/components/atoms/Tag';

export default function L2ChainsPage() {
  const { fetchL2Chains, initialized } = useGorbchainData();
  const [chains, setChains] = useState<L2Chain[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'maintenance'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChains = async () => {
      if (!initialized) return;
      
      try {
        setLoading(true);
        const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
        const chainsData = await fetchL2Chains(filters);
        setChains(chainsData);
      } catch (error) {
        console.error('Failed to load L2 chains:', error);
        setChains([]);
      } finally {
        setLoading(false);
      }
    };

    loadChains();
  }, [statusFilter, fetchL2Chains, initialized]);

  const totalStats = chains.reduce(
    (acc, chain) => ({
      tvl: acc.tvl + parseFloat(chain.tvlUSD.replace(/[^0-9.]/g, '')),
      transactions: acc.transactions + chain.dailyTransactions,
      delegators: acc.delegators + chain.delegators,
    }),
    { tvl: 0, transactions: 0, delegators: 0 }
  );

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading L2 chains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="relative w-full px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12 border-b border-border pb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-orbitron mb-4 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Gorbchain L2 Ecosystem
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore the diverse Layer 2 solutions built on Gorbchain. From DeFi protocols to gaming platforms, 
              discover the scalable future of decentralized applications.
            </p>
          </div>

          {/* Network Overview Stats - Bordered Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border-2 border-border rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-200">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                ${totalStats.tvl.toFixed(1)}B
              </div>
              <div className="text-sm text-muted-foreground font-medium">Total Value Locked</div>
              <div className="text-xs text-muted-foreground mt-1">Across all L2 chains</div>
            </div>
            
            <div className="bg-card border-2 border-border rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-200">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-500 mb-2">
                {totalStats.transactions.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground font-medium">Daily Transactions</div>
              <div className="text-xs text-muted-foreground mt-1">Combined network activity</div>
            </div>
            
            <div className="bg-card border-2 border-border rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-200">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {totalStats.delegators.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground font-medium">Total Delegators</div>
              <div className="text-xs text-muted-foreground mt-1">Active participants</div>
            </div>
          </div>

          {/* Status Filters - Bordered */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Filter by Status</h3>
            <div className="flex flex-wrap gap-3">
              {['all', 'active', 'inactive', 'maintenance'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    statusFilter === status
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-background text-muted-foreground hover:text-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {status === 'all' ? 'All Chains' : status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                      {chains.filter(c => c.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chains Grid - Enhanced Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {chains.map((chain) => (
              <div key={chain.id} className="bg-card border-2 border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                {/* Card Header */}
                <div className="bg-muted/20 border-b border-border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <span className="text-2xl font-bold text-primary">
                          {chain.name.split(' ')[0][0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{chain.name}</h3>
                        <Tag status={chain.status} className="mb-2">{chain.status.toUpperCase()}</Tag>
                        <div className="text-sm text-muted-foreground">Chain ID: {chain.chainId}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {chain.website && (
                        <a
                          href={chain.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
                          title="Visit Website"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {chain.explorer && (
                        <a
                          href={chain.explorer}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors"
                          title="View Explorer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">{chain.description}</p>
                </div>

                {/* Key Metrics */}
                <div className="p-6 border-b border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{chain.totalValueLocked}</div>
                      <div className="text-xs text-muted-foreground">Total Value Locked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500 mb-1">{chain.dailyTransactions.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Daily Transactions</div>
                    </div>
                  </div>
                </div>

                {/* Network Details */}
                <div className="p-6 border-b border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Network Details</h4>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Native Token:</span>
                      <span className="text-sm font-medium text-foreground">{chain.nativeToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Block Time:</span>
                      <span className="text-sm font-medium text-foreground">{chain.avgBlockTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Gas Price:</span>
                      <span className="text-sm font-medium text-foreground">{chain.gasPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Commission:</span>
                      <span className="text-sm font-medium text-foreground">{chain.commission}</span>
                    </div>
                  </div>
                </div>

                {/* Performance & Status */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Performance & Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Uptime</span>
                      </div>
                      <span className="text-sm font-bold text-green-500">{chain.uptime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Delegators</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{chain.delegators.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Last Seen</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{chain.lastSeen}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-muted-foreground">Total Blocks</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{chain.totalBlocks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results State */}
          {chains.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No L2 Chains Found</h3>
              <p className="text-muted-foreground">No L2 chains match your current filter criteria.</p>
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
} 