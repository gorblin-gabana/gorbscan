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
import { BlockTransactionRow } from '../molecules/BlockTransaction';

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
        const block: any = await fetchBlock(parseInt(blockNumber));
        if (!block) {
          setBlockData(null);
          setBlockTransactions([]);
          setLoading(false);
          return;
        }

        // Adapt block data from API response
        const blockInfo = {
          blockNumber: block.slot,
          timestamp: block.blockTime ? new Date(block.blockTime * 1000).toLocaleString() : '',
          transactionCount: block.transactionCount,
          validator: block.transactions?.[0]?.transaction?.message?.accountKeys?.[0] || '',
          reward: '', // Not available in response
          gasUsed: block.transactions?.[0]?.meta?.computeUnitsConsumed?.toString() || '',
          hash: block.blockhash,
          parentHash: block.previousBlockhash,
          size: '', // Not available in response
          difficulty: '', // Not available in response
        };
        setBlockData(blockInfo);

        // Transactions in block
        const blockTxs = block.transactions;

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
            Block #{blockData.blockNumber}
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
          value={blockData.transactionCount?.toString() || '0'}
          icon={Zap}
        />
        <StatBox
          label="Gas Used (CU)"
          value={blockData.gasUsed || 'N/A'}
          icon={Box}
        />
        <StatBox
          label="Validator"
          value={`${blockData.validator.slice(0, 4)}....${blockData.validator.slice(-4)}` || 'N/A'}
          icon={User}
        />
        <StatBox
          label="Block Hash"
          value={blockData.hash ? `${blockData.hash.slice(0, 4)}...${blockData.hash.slice(-4)}` : 'N/A'}
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
                    {blockData.hash ? `${blockData.hash.slice(0, 6)}...${blockData.hash.slice(-6)}` : 'N/A'}
                  </span>
                  {blockData.hash && (
                    <button
                      onClick={() => handleCopy(blockData.hash)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                      title="Copy block hash"
                      aria-label="Copy block hash"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-gorb-green" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>
              }
            />

            <DetailRow
              label="Parent Hash"
              value={<span className="font-mono text-sm text-foreground">{blockData.parentHash || 'N/A'}</span>}
            />

            <DetailRow
              icon={Clock}
              label="Timestamp"
              value={
                <div className="text-right">
                  <div className="text-sm text-foreground">{blockData.timestamp || 'N/A'}</div>
                </div>
              }
            />

            <DetailRow
              icon={User}
              label="Validator"
              value={
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">
                    {blockData.validator ? `${blockData.validator.slice(0, 6)}...${blockData.validator.slice(-6)}` : 'N/A'}
                  </span>
                  {blockData.validator && (
                    <button
                      onClick={() => handleCopy(blockData.validator)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                      title="Copy validator"
                      aria-label="Copy validator"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-gorb-green" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>
              }
            />
          </div>

          {/* Right Column */}
          <div className="space-y-1">
            <DetailRow
              label="Gas Used (CU)"
              value={
                <div className="text-right">
                  <div className="text-sm text-foreground">{blockData.gasUsed}</div>
                </div>
              }
            />

            <DetailRow
              label="Block Reward"
              value={<span className="text-sm text-foreground">N/A</span>}
            />

            <DetailRow
              label="Difficulty"
              value={<span className="text-sm text-foreground">N/A</span>}
            />

            <DetailRow
              label="Block Size"
              value={<span className="text-sm text-foreground">N/A</span>}
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

          {
            blockTransactions.slice(0, 5).map((tx, idx) => (
              <div key={idx} className="p-6">
                <BlockTransactionRow transaction={tx} />
              </div>
            ))

          }

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