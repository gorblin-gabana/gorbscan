"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { BarChart3, LineChart, PieChart, TrendingUp, Activity, Zap, Users, DollarSign, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { useGorbchainData } from '@/contexts/GorbchainDataContext';

// Add mockChartData for topTokens only (for Top Tokens section)
const mockChartData = {
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

  const { networkStats, loading, txChartData } = useGorbchainData();

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

  // Helper: get last N days from chartData
  const getLastNDays = (n: number) => {
    if (!txChartData?.chartData) return [];
    return txChartData.chartData.slice(-n);
  };

  // Helper: format date (YYYY-MM-DD to readable)
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  // Line chart rendering (simple SVG, no external lib)
  const renderLineChart = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400 mb-2" />
          <span className="text-muted-foreground text-sm">Loading chart data...</span>
        </div>
      );
    }
    if (!txChartData?.chartData?.length) {
      return <div className="text-center text-muted-foreground">No chart data available.</div>;
    }
    const data = getLastNDays(30);
    const max = Math.max(...data.map(d => d.count));
    const min = Math.min(...data.map(d => d.count));
    const chartHeight = 220;
    const chartWidth = 500;
    const padding = 30;
    const accent = '#22c55e'; // Tailwind green-500
    const bgLine = '#e5e7eb'; // Tailwind border
    const dotColor = '#fff';
    const dotStroke = accent;
    const labelColor = '#6b7280'; // Tailwind text-muted-foreground
    const areaGradientId = 'tx-green-gradient';
    // Points for polyline
    const points = data.map((d, i) => {
      const x = padding + (i * (chartWidth - 2 * padding)) / (data.length - 1);
      const y = chartHeight - padding - ((d.count - min) / (max - min || 1)) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    }).join(' ');
    // Area under line
    const areaPoints = [
      ...data.map((d, i) => {
        const x = padding + (i * (chartWidth - 2 * padding)) / (data.length - 1);
        const y = chartHeight - padding - ((d.count - min) / (max - min || 1)) * (chartHeight - 2 * padding);
        return `${x},${y}`;
      }),
      `${padding + (data.length - 1) * (chartWidth - 2 * padding) / (data.length - 1)},${chartHeight - padding}`,
      `${padding},${chartHeight - padding}`
    ].join(' ');
    return (
      <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
        <defs>
          <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = padding + t * (chartHeight - 2 * padding);
          return (
            <line key={i} x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke={bgLine} strokeDasharray="4 4" strokeWidth="1" />
          );
        })}
        {/* Axes */}
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke={bgLine} strokeWidth="1.5" />
        <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke={bgLine} strokeWidth="1.5" />
        {/* Area under line */}
        <polygon points={areaPoints} fill={`url(#${areaGradientId})`} />
        {/* Line */}
        <polyline
          fill="none"
          stroke={accent}
          strokeWidth="3"
          points={points}
        />
        {/* Dots with shadow */}
        {data.map((d, i) => {
          const x = padding + (i * (chartWidth - 2 * padding)) / (data.length - 1);
          const y = chartHeight - padding - ((d.count - min) / (max - min || 1)) * (chartHeight - 2 * padding);
          return (
            <g key={d.date}>
              <circle cx={x} cy={y} r={2} fill={dotColor} stroke={dotStroke} strokeWidth="2" opacity="0.9" />
              <circle cx={x} cy={y} r={3} fill={accent} />
            </g>
          );
        })}
        {/* X Labels (every 5th) */}
        {data.map((d, i) => {
          if (i % 5 !== 0) return null;
          const x = padding + (i * (chartWidth - 2 * padding)) / (data.length - 1);
          return (
            <text key={d.date} x={x} y={chartHeight - 10} fontSize="11" textAnchor="middle" fill={labelColor}>{formatDate(d.date)}</text>
          );
        })}
        {/* Y-axis labels (min/max) */}
        <text x={8} y={chartHeight - padding + 4} fontSize="11" fill={labelColor}>{min}</text>
        <text x={8} y={padding + 8} fontSize="11" fill={labelColor}>{max}</text>
      </svg>
    );
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
              {/* No trend icon for TPS, as no trend data in txChartData */}
            </div>
            <div>
              <p className="body-sm text-muted-foreground mb-1">Network TPS</p>
              <p className="heading-lg text-secondary mb-2">
                {loading ? '---' : networkStats?.networkHealth.tps?.toString() ?? '---'}
              </p>
              {/* No change/trend info available from txChartData, so omit */}
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="section-icon bg-primary/20">
                <DollarSign className="icon-lg text-primary" />
              </div>
              {/* No trend icon for gas price */}
            </div>
            <div>
              <p className="body-sm text-muted-foreground mb-1">Avg Gas Price</p>
              <p className="heading-lg text-primary mb-2">
                {loading ? '---' : '0.000005'} GORB
              </p>
              {/* No change/trend info available from txChartData, so omit */}
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="section-icon bg-yellow-500/20">
                <Activity className="icon-lg text-yellow-400" />
              </div>
              {/* No trend icon for block time */}
            </div>
            <div>
              <p className="body-sm text-muted-foreground mb-1">Block Time</p>
              <p className="heading-lg text-yellow-400 mb-2">
                {loading ? '---' : networkStats?.networkHealth.blockTime ?? '---'}ms
              </p>
              {/* No change/trend info available from txChartData, so omit */}
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="section-icon bg-green-500/20">
                <TrendingUp className="icon-lg text-green-400" />
              </div>
              {/* No trend icon for total supply */}
            </div>
            <div>
              <p className="body-sm text-muted-foreground mb-1">Total Supply</p>
              <p className="heading-lg text-green-400 mb-2">
                {loading ? '---' : (Number(networkStats?.supply.total) / 1_000_000_000_000).toFixed(1)}T
              </p>
              {/* No change/trend info available from txChartData, so omit */}
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedChart === chart.value
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
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTimeframe === timeframe.value
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

              {/* Chart Visualization */}
              <div className="h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border flex items-center justify-center">
                <div className="w-full h-full flex items-end">
                  {renderLineChart()}
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
                {/* Use mockChartData.topTokens for now, as txChartData does not provide topTokens */}
                {mockChartData.topTokens.map((token: { name: string; symbol: string; price: string; change: number; volume: string }, index: number) => (
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
                  <th className="text-right py-3 px-4 body-sm font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                {getLastNDays(7).map((data, index, arr) => {
                  const prev = index > 0 ? arr[index - 1].count : null;
                  const change = prev !== null && prev !== 0 ? ((data.count - prev) / prev) * 100 : 0;
                  return (
                    <tr key={data.date} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-4 body-sm text-foreground">{formatDate(data.date)}</td>
                      <td className="py-3 px-4 body-sm text-right font-semibold">{data.count.toLocaleString()}</td>
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