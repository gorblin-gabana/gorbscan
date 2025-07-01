"use client";

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Wallet, TrendingUp, Activity, Coins } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Tag } from '@/components/atoms/Tag';
import { StatBox } from '@/components/atoms/StatBox';
import { TransactionRow } from '@/components/molecules/TransactionRow';

interface AddressDetailsProps {
  address: string;
}

export const AddressDetails: React.FC<AddressDetailsProps> = ({ address }) => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [copied, setCopied] = useState(false);

  // Mock address data
  const addressData = {
    balance: '1,247.85 GORB',
    balanceUSD: '$2,847.92',
    totalTransactions: 1,247,
    firstSeen: 'Block #8,429,234',
    lastActivity: '2 hours ago',
    tokens: [
      { symbol: 'GORB', balance: '1,247.85', value: '$2,847.92' },
      { symbol: 'USDC', balance: '500.00', value: '$500.00' },
      { symbol: 'WETH', balance: '0.25', value: '$847.50' }
    ]
  };

  const mockTransactions = [
    {
      hash: '0x8f4e2a1b9c3d5e7f8a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f',
      from: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      to: address,
      value: '125.75',
      status: 'success' as const,
      timestamp: '2 hours ago',
      gasUsed: '21,000',
    },
    {
      hash: '0x1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b',
      from: address,
      to: '0xC6634C0532925a3b8D4742d35Cc6634C0532925a',
      value: '50.00',
      status: 'success' as const,
      timestamp: '5 hours ago',
      gasUsed: '65,432',
    }
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'transactions', label: 'Transactions', count: addressData.totalTransactions },
    { id: 'tokens', label: 'Token Holdings', count: addressData.tokens.length },
    { id: 'nfts', label: 'NFTs', count: 0 },
    { id: 'defi', label: 'DeFi Positions', count: 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron text-foreground mb-2">
            Address Details
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg text-foreground">
              {address.slice(0, 8)}...{address.slice(-8)}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-5 h-5 text-gorb-green" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              )}
            </button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </Button>
          </div>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox
          label="GORB Balance"
          value={addressData.balance}
          icon={Wallet}
        />
        <StatBox
          label="USD Value"
          value={addressData.balanceUSD}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatBox
          label="Total Transactions"
          value={addressData.totalTransactions.toLocaleString()}
          icon={Activity}
        />
        <StatBox
          label="Token Holdings"
          value={addressData.tokens.length}
          icon={Coins}
        />
      </div>

      {/* Address Info */}
      <div className="gorb-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Full Address:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-foreground">{address}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <Copy className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">First Seen:</span>
              <span className="text-sm text-foreground">{addressData.firstSeen}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Activity:</span>
              <span className="text-sm text-foreground">{addressData.lastActivity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Address Type:</span>
              <Tag status="info">EOA</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="gorb-card p-6">
        <div className="flex items-center gap-6 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                  {tab.count.toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <TransactionRow key={tx.hash} {...tx} />
              ))}
            </div>
          </div>
        )}

        {/* Token Holdings Tab */}
        {activeTab === 'tokens' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Token Holdings</h3>
            <div className="space-y-3">
              {addressData.tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{token.symbol[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.balance}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{token.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NFTs Tab */}
        {activeTab === 'nfts' && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No NFTs found for this address</p>
          </div>
        )}

        {/* DeFi Positions Tab */}
        {activeTab === 'defi' && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No DeFi positions found for this address</p>
          </div>
        )}
      </div>
    </div>
  );
};