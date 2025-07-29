"use client";

import React, { useState, useEffect } from 'react';
import { StatBox } from '@/components/atoms/StatBox';
import { Tag } from '@/components/atoms/Tag';
import { Button } from '@/components/ui/button';
import { useGorbchainData } from '@/hooks/useGorbchainData';
import { Copy, Check, ExternalLink, Wallet, Activity, TrendingUp, Coins } from 'lucide-react';
import WalletInfo from '@/components/organisms/WalletInfo';

interface AddressDetailsProps {
  address: string;
}

function shorten(str: string, start = 6, end = 6) {
  if (!str || str.length <= start + end) return str;
  return `${str.slice(0, start)}...${str.slice(-end)}`;
}

const TransactionRowCustom: React.FC<{ tx: any }> = ({ tx }) => {
  const [copied, setCopied] = useState(false);
  const signature = tx?.transaction?.signatures?.[0] || '';
  const slot = tx?.slot;
  const blockTime = tx?.blockTime;
  const status = tx?.meta?.err === null ? 'success' : 'error';
  const fee = tx?.meta?.fee;
  const computeUnits = tx?.meta?.computeUnitsConsumed;
  const validator = tx?.transaction?.message?.accountKeys?.[0]?.pubkey || tx?.transaction?.message?.accountKeys?.[0] || '';

  const handleCopy = async () => {
    if (!signature) return;
    await navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 p-4 bg-card/50 rounded-lg border border-border">
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
        <span className="font-mono text-xs text-muted-foreground">Slot: {slot ?? 'N/A'}</span>
        <span className="font-mono text-xs text-muted-foreground">Validator: {shorten(validator)}</span>
      </div>
      <div className="flex items-center gap-2 w-full md:w-auto">
        <span className="font-mono text-xs text-foreground">{shorten(signature, 8, 8)}</span>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-muted transition-colors"
          title="Copy signature"
        >
          {copied ? <Check className="w-3 h-3 text-gorb-green" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
        </button>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
        <Tag status={status === 'success' ? 'success' : 'error'}>{status === 'success' ? 'Success' : 'Failed'}</Tag>
        <span className="font-mono text-xs text-muted-foreground">Fee: {fee ?? 'N/A'}</span>
        <span className="font-mono text-xs text-muted-foreground">CU: {computeUnits ?? 'N/A'}</span>
        <span className="font-mono text-xs text-muted-foreground">{blockTime ? new Date(blockTime * 1000).toLocaleString() : 'N/A'}</span>
      </div>
    </div>
  );
};

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

  // Tabs: Only show tokens if present, else fallback to empty array
  const tabs = [
    { id: 'transactions', label: 'Transactions', count: addressData.allTx?.length || 0 },
    { id: 'tokens', label: 'Token Holdings', count: addressData.tokenHoldings?.length || 0 },
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
           
          </div>
        </div>
      </div>

      {/* Wallet Info */}
      {addressData.accountInfo && (
        <div className="gorb-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Wallet Information</h3>
          <WalletInfo accountInfo={addressData.accountInfo} />
        </div>
      )}

      {/* Tabs */}
      <div className="gorb-card p-6">
        <div className="flex items-center gap-6 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
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
              {addressData.allTx && addressData.allTx.length > 0 ? (
                addressData.allTx.slice(0, 10).map((tx: any, idx: number) => (
                  <TransactionRowCustom key={tx?.transaction?.signatures?.[0] || idx} tx={tx} />
                ))
              ) : (
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
              {addressData.tokenHoldings && addressData.tokenHoldings.length > 0 ? (
                addressData.tokenHoldings.map((token: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{token.symbol?.[0]}</span>
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
                ))
              ) : (
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