"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { BarChart3, LineChart, PieChart, TrendingUp, Activity, Zap, Users, DollarSign, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

// Mock chart data - replace with actual API calls
const mockChartData = {
  transactionVolume: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    transactions: Math.floor(Math.random() * 50000) + 80000,
    volume: (Math.random() * 5000000 + 2000000).toFixed(0),
  })),
  networkStats: {
    tps: { current: 2847, change: 12.5, trend: 'up' },
    gasPrice: { current: 0.000023, change: -8.2, trend: 'down' },
    blockTime: { current: 6.2, change: 1.8, trend: 'up' },
    totalSupply: { current: 124500000, change: 0.8, trend: 'up' },
  },
  topTokens: [
    { name: 'GORB', symbol: 'GORB', price: '$2.34', change: 8.7, volume: '$124M' },
    { name: 'GToken', symbol: 'GTK', price: '$0.89', change: -2.1, volume: '$45M' },
    { name: 'GorbSwap', symbol: 'GSWAP', price: '$12.45', change: 15.3, volume: '$78M' },
    { name: 'GStable', symbol: 'GSTB', price: '$1.00', change: 0.1, volume: '$23M' },
  ]
};

export default function ChartsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedChart, setSelectedChart] = useState('transactions');

  const timeframes = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: '1y', label: '1Y' },
  ];

  const chartTypes = [
    { value: 'transactions', label: 'Transactions', icon: Activity },
    { value: 'volume', label: 'Volume', icon: BarChart3 },
    { value: 'gas', label: 'Gas Fees', icon: Zap },
    { value: 'validators', label: 'Validators', icon: Users },
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ArrowUp className="icon-sm text-green-400" />
    ) : (
      <ArrowDown className="icon-sm text-red-400" />
    );
  };

  const getTrendColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="relative w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="section-icon bg-secondary/20">
                <Zap className="icon-lg text-secondary" />
              </div>
              {getTrendIcon(mockChartData.networkStats.tps.trend)}
            </div>
            <div>
              <p className="body-sm text-muted-foreground mb-1">Network TPS</p>
              <p className="heading-lg text-secondary mb-2">
                {mockChartData.networkStats.tps.current.toLocaleString()}
              </p>
              <p className={`body-sm ${getTrendColor(mockChartData.networkStats.tps.change)}`}>
                {mockChartData.networkStats.tps.change >= 0 ? '+' : ''}{mockChartData.networkStats.tps.change}% (24h)
              </p>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="section-icon bg-primary/20">
                <DollarSign className="icon-lg text-primary" />
              </div>
              {getTrendIcon(mockChartData.networkStats.gasPrice.trend)}
            </div>
            <div>
              <p className="body-sm text-muted-foreground mb-1">Avg Gas Price</p>
              <p className="heading-lg text-primary mb-2">
                {mockChartData.networkStats.gasPrice.current} GORB
              </p>
              <p className={`body-sm ${getTrendColor(mockChartData.networkStats.gasPrice.change)}`}>
                {mockChartData.networkStats.gasPrice.change >= 0 ? '+' : ''}{mockChartData.networkStats.gasPrice.change}% (24h)
              </p>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="section-icon bg-yellow-500/20">
                <Activity className="icon-lg text-yellow-400" />
              </div>
              {getTrendIcon(mockChartData.networkStats.blockTime.trend)}
            </div>
            <div>
              <p className="body-sm text-muted-foreground mb-1">Block Time</p>
              <p className="heading-lg text-yellow-400 mb-2">
                {mockChartData.networkStats.blockTime.current}s
              </p>
              <p className={`body-sm ${getTrendColor(mockChartData.networkStats.blockTime.change)}`}>
                {mockChartData.networkStats.blockTime.change >= 0 ? '+' : ''}{mockChartData.networkStats.blockTime.change}% (24h)
              </p>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="section-icon bg-green-500/20">
                <TrendingUp className="icon-lg text-green-400" />
              </div>
              {getTrendIcon(mockChartData.networkStats.totalSupply.trend)}
            </div>
            <div>
              <p className="body-sm text-muted-foreground mb-1">Total Supply</p>
              <p className="heading-lg text-green-400 mb-2">
                {(mockChartData.networkStats.totalSupply.current / 1000000).toFixed(1)}M
              </p>
              <p className={`body-sm ${getTrendColor(mockChartData.networkStats.totalSupply.change)}`}>
                {mockChartData.networkStats.totalSupply.change >= 0 ? '+' : ''}{mockChartData.networkStats.totalSupply.change}% (24h)
              </p>
            </div>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {chartTypes.map((chart) => {
              const IconComponent = chart.icon;
              return (
                <button
                  key={chart.value}
                  onClick={() => setSelectedChart(chart.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedChart === chart.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <IconComponent className="icon-sm" />
                  {chart.label}
                </button>
              );
            })}
          </div>
          
          <div className="flex gap-2">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2">
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading-md">
                  {chartTypes.find(c => c.value === selectedChart)?.label} Over Time
                </h3>
                <div className="flex items-center gap-2">
                  <LineChart className="icon-md text-primary" />
                  <span className="body-sm text-muted-foreground">
                    Last {selectedTimeframe}
                  </span>
                </div>
              </div>
              
              {/* Mock Chart Visualization */}
              <div className="h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="icon-4xl text-primary/20 mx-auto mb-4" />
                  <p className="heading-md text-muted-foreground mb-2">Chart Visualization</p>
                  <p className="body-sm text-muted-foreground">
                    {chartTypes.find(c => c.value === selectedChart)?.label} data for {selectedTimeframe}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Statistics */}
          <div className="space-y-6">
            {/* Top Tokens */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-6">
                <PieChart className="icon-lg text-secondary" />
                <h3 className="heading-md">Top Tokens</h3>
              </div>
              
              <div className="space-y-4">
                {mockChartData.topTokens.map((token, index) => (
                  <div key={token.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{token.symbol}</p>
                        <p className="caption text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{token.price}</p>
                      <p className={`caption ${getTrendColor(token.change)}`}>
                        {token.change >= 0 ? '+' : ''}{token.change}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Health */}
            <div className="card-base p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="icon-lg text-green-400" />
                <h3 className="heading-md">Network Health</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="body-sm text-muted-foreground">Uptime</span>
                  <span className="font-semibold text-green-400">99.98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-sm text-muted-foreground">Active Nodes</span>
                  <span className="font-semibold text-primary">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-sm text-muted-foreground">Consensus</span>
                  <span className="font-semibold text-secondary">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="body-sm text-muted-foreground">Mempool</span>
                  <span className="font-semibold text-yellow-400">2,847 TXs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data Table */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading-md">Historical Data</h3>
            <div className="flex items-center gap-2">
              <Calendar className="icon-md text-primary" />
              <span className="body-sm text-muted-foreground">Last 7 days</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 body-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 body-sm font-medium text-muted-foreground">Transactions</th>
                  <th className="text-right py-3 px-4 body-sm font-medium text-muted-foreground">Volume (GORB)</th>
                  <th className="text-right py-3 px-4 body-sm font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                {mockChartData.transactionVolume.slice(-7).map((data, index) => {
                  const change = index > 0 ? 
                    ((data.transactions - mockChartData.transactionVolume[mockChartData.transactionVolume.length - 7 + index - 1].transactions) / 
                     mockChartData.transactionVolume[mockChartData.transactionVolume.length - 7 + index - 1].transactions * 100) : 0;
                  
                  return (
                    <tr key={data.date} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-4 body-sm text-foreground">{data.date}</td>
                      <td className="py-3 px-4 body-sm text-right font-semibold">
                        {data.transactions.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 body-sm text-right font-semibold">
                        {parseInt(data.volume).toLocaleString()}
                      </td>
                      <td className={`py-3 px-4 body-sm text-right font-semibold ${getTrendColor(change)}`}>
                        {index > 0 ? `${change >= 0 ? '+' : ''}${change.toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 