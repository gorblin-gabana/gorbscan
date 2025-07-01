"use client";

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Clock, User, Zap, Hash, Box } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Tag } from '@/components/atoms/Tag';
import { StatBox } from '@/components/atoms/StatBox';
import { TransactionRow } from '@/components/molecules/TransactionRow';
import { DetailRow } from '@/components/molecules/DetailRow';

interface BlockDetailsProps {
  blockNumber: string;
}

export const BlockDetails: React.FC<BlockDetailsProps> = ({ blockNumber }) => {
  const [copied, setCopied] = useState(false);

  // Mock block data
  const blockData = {
    number: parseInt(blockNumber),
    hash: '0x8f4e2a1b9c3d5e7f8a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f',
    parentHash: '0x1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b',
    timestamp: '2025-01-01 12:34:56 UTC',
    timeAgo: '2 minutes ago',
    validator: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    transactionCount: 247,
    gasUsed: '29,847,392',
    gasLimit: '30,000,000',
    baseFee: '0.000000012 GORB',
    reward: '2.5 GORB',
    size: '1,247 bytes',
    difficulty: '15,847,392,847',
    totalDifficulty: '58,847,392,847,123'
  };

  const mockTransactions = [
    {
      hash: '0x8f4e2a1b9c3d5e7f8a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f',
      from: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      to: '0x8D4C0532925a3b8D4742d35Cc6634C0532925a3b',
      value: '125.75',
      status: 'success' as const,
      timestamp: '2 mins ago',
      gasUsed: '21,000',
    },
    {
      hash: '0x1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b',
      from: '0x925a3b8D4742d35Cc6634C0532925a3b8D4C0532',
      to: '0xC6634C0532925a3b8D4742d35Cc6634C0532925a',
      value: '0.05',
      status: 'success' as const,
      timestamp: '2 mins ago',
      gasUsed: '65,432',
    }
  ];

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron text-foreground mb-2">
            Block #{blockData.number.toLocaleString()}
          </h1>
          <div className="flex items-center gap-2">
            <Tag status="success">Finalized</Tag>
            <span className="text-sm text-muted-foreground">{blockData.timeAgo}</span>
          </div>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          View Raw Data
        </Button>
      </div>

      {/* Block Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox
          label="Transactions"
          value={blockData.transactionCount}
          icon={Zap}
        />
        <StatBox
          label="Gas Used"
          value={`${((parseInt(blockData.gasUsed.replace(/,/g, '')) / parseInt(blockData.gasLimit.replace(/,/g, ''))) * 100).toFixed(1)}%`}
          icon={Box}
        />
        <StatBox
          label="Block Reward"
          value={blockData.reward}
          icon={User}
        />
        <StatBox
          label="Block Size"
          value={blockData.size}
          icon={Hash}
        />
      </div>

      {/* Block Details */}
      <div className="gorb-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Block Information</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-1">
            <DetailRow
              icon={Hash}
              label="Block Hash"
              value={
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">
                    {blockData.hash.slice(0, 10)}...{blockData.hash.slice(-8)}
                  </span>
                  <button
                    onClick={() => handleCopy(blockData.hash)}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-gorb-green" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              }
            />
            
            <DetailRow
              label="Parent Hash"
              value={
                <span className="font-mono text-sm text-foreground">
                  {blockData.parentHash.slice(0, 10)}...{blockData.parentHash.slice(-8)}
                </span>
              }
            />
            
            <DetailRow
              icon={Clock}
              label="Timestamp"
              value={
                <div className="text-right">
                  <div className="text-sm text-foreground">{blockData.timestamp}</div>
                  <div className="text-xs text-muted-foreground">{blockData.timeAgo}</div>
                </div>
              }
            />
            
            <DetailRow
              icon={User}
              label="Validator"
              value={
                <span className="font-mono text-sm text-foreground">
                  {blockData.validator.slice(0, 8)}...{blockData.validator.slice(-6)}
                </span>
              }
            />
          </div>

          {/* Right Column */}
          <div className="space-y-1">
            <DetailRow
              label="Gas Used"
              value={
                <div className="text-right">
                  <div className="text-sm text-foreground">{blockData.gasUsed}</div>
                  <div className="text-xs text-muted-foreground">
                    {((parseInt(blockData.gasUsed.replace(/,/g, '')) / parseInt(blockData.gasLimit.replace(/,/g, ''))) * 100).toFixed(2)}% of limit
                  </div>
                </div>
              }
            />
            
            <DetailRow
              label="Gas Limit"
              value={<span className="text-sm text-foreground">{blockData.gasLimit}</span>}
            />
            
            <DetailRow
              label="Base Fee"
              value={<span className="text-sm text-foreground">{blockData.baseFee}</span>}
            />
            
            <DetailRow
              label="Block Reward"
              value={<span className="text-sm text-foreground">{blockData.reward}</span>}
            />
            
            <DetailRow
              label="Difficulty"
              value={<span className="text-sm text-foreground">{blockData.difficulty}</span>}
            />
          </div>
        </div>
      </div>

      {/* Transactions in Block */}
      <div className="gorb-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Transactions ({blockData.transactionCount})
          </h3>
          <Button variant="outline" size="sm">
            View All Transactions
          </Button>
        </div>
        
        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <TransactionRow key={tx.hash} {...tx} />
          ))}
          
          {blockData.transactionCount > 2 && (
            <div className="text-center py-4">
              <Button variant="ghost">
                Load More Transactions ({blockData.transactionCount - 2} remaining)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};