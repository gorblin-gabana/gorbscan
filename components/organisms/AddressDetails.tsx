"use client";

import React, { useState, useEffect } from 'react';
import { StatBox } from '@/components/atoms/StatBox';
import { Tag } from '@/components/atoms/Tag';
import { Button } from '@/components/ui/button';
import { TransactionRow } from '@/components/molecules/TransactionRow';
import { useGorbchainData } from '@/hooks/useGorbchainData';
import { Copy, Check, ExternalLink, Wallet, Activity, TrendingUp, Coins } from 'lucide-react';

interface AddressDetailsProps {
  address: string;
}

export const AddressDetails: React.FC<AddressDetailsProps> = ({ address }) => {
  const { getAddress, loading } = useGorbchainData();
  const [activeTab, setActiveTab] = useState('transactions');
  const [copied, setCopied] = useState(false);
  const [addressData, setAddressData] = useState<any>(null);

  useEffect(() => {
    const loadAddressData = async () => {
      const data = await getAddress(address);
      setAddressData(data);
    };
    
    loadAddressData();
  }, [address, getAddress]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !addressData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="gorb-card p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
          
          <div className="gorb-card p-6">
            <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'transactions', label: 'Transactions', count: addressData.transactions.length },
    { id: 'tokens', label: 'Token Holdings', count: addressData.tokenHoldings.length },
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
          value={addressData.transactions.length.toLocaleString()}
          icon={Activity}
        />
        <StatBox
          label="Token Holdings"
          value={addressData.tokenHoldings.length}
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
              <span className="text-sm text-foreground">Jan 15, 2024</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Activity:</span>
              <span className="text-sm text-foreground">{addressData.transactions[0]?.timestamp || 'Never'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Address Type:</span>
              <Tag status="info">{addressData.type?.toUpperCase() || 'WALLET'}</Tag>
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
              {addressData.transactions.slice(0, 5).map((tx: any) => (
                <TransactionRow key={tx.signature} {...tx} />
              ))}
              {addressData.transactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transactions found for this address</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Token Holdings Tab */}
        {activeTab === 'tokens' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Token Holdings</h3>
            <div className="space-y-3">
              {addressData.tokenHoldings.map((token: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{token.symbol[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{token.amountUSD}</p>
                    <p className="text-sm text-muted-foreground">{token.price}</p>
                  </div>
                </div>
              ))}
              {addressData.tokenHoldings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No token holdings found for this address</p>
                </div>
              )}
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