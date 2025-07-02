"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Hash, User, Box, Zap, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Tag } from '@/components/atoms/Tag';
import { StatBox } from '@/components/atoms/StatBox';
import { DetailRow } from '@/components/molecules/DetailRow';
import { TransactionRow } from '@/components/molecules/TransactionRow';
import { useGorbchainData } from '@/contexts/GorbchainDataContext';
import { Block, Transaction } from '@/contexts/GorbchainDataContext';

interface BlockDetailsProps {
  blockNumber: string;
}

export const BlockDetails: React.FC<BlockDetailsProps> = ({ blockNumber }) => {
  const { fetchBlock, fetchTransactions, initialized } = useGorbchainData();
  const [copied, setCopied] = useState(false);
  const [blockData, setBlockData] = useState<Block | null>(null);
  const [blockTransactions, setBlockTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlockData = async () => {
      if (!initialized) return;
      
      try {
        setLoading(true);
        
        // Load block data
        const block = await fetchBlock(parseInt(blockNumber));
        setBlockData(block);
        
        // For now, we'll get recent transactions since we don't have block-specific filtering
        // In a real implementation, the API would filter by block number
        const transactionsResponse = await fetchTransactions(1, 10);
        const blockTxs = transactionsResponse.transactions.filter(
          (tx: Transaction) => tx.blockNumber === parseInt(blockNumber)
        );
        setBlockTransactions(blockTxs);
      } catch (error) {
        console.error('Failed to load block data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBlockData();
  }, [blockNumber, fetchBlock, fetchTransactions, initialized]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!initialized || loading || !blockData) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron text-foreground mb-2">
            Block #{blockData.blockNumber.toLocaleString()}
          </h1>
          <div className="flex items-center gap-2">
            <Tag status="success">Finalized</Tag>
            <span className="text-sm text-muted-foreground">{blockData.timestamp}</span>
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
          value={blockData.transactionCount.toString()}
          icon={Zap}
        />
        <StatBox
          label="Gas Used"
          value={blockData.gasUsed}
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
                </div>
              }
            />
            
            <DetailRow
              icon={User}
              label="Validator"
              value={
                <span className="font-mono text-sm text-foreground">
                  {blockData.validator}
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
                </div>
              }
            />
            
            <DetailRow
              label="Block Reward"
              value={<span className="text-sm text-foreground">{blockData.reward} GORB</span>}
            />
            
            <DetailRow
              label="Difficulty"
              value={<span className="text-sm text-foreground">{blockData.difficulty}</span>}
            />
            
            <DetailRow
              label="Block Size"
              value={<span className="text-sm text-foreground">{blockData.size}</span>}
            />
          </div>
        </div>
      </div>

      {/* Transactions in Block */}
      <div className="gorb-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Transactions in Block ({blockTransactions.length})
            </h3>
            {blockTransactions.length > 5 && (
              <Button variant="outline" size="sm">
                View All Transactions
              </Button>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {blockTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.signature} className="p-6">
              <TransactionRow {...transaction} />
            </div>
          ))}
          
          {blockTransactions.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              No transactions found in this block
            </div>
          )}
        </div>
      </div>
    </div>
  );
};