"use client";

import React from 'react';
import { TransactionRow } from '@/components/molecules/TransactionRow';
import { Button } from '@/components/atoms/Button';
import { ArrowRight } from 'lucide-react';

const mockTransactions = [
  {
    hash: '0x8f4e2a1b9c3d5e7f8a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f',
    from: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    to: '0x8D4C0532925a3b8D4742d35Cc6634C0532925a3b',
    value: '125.75',
    status: 'success' as const,
    timestamp: '8 secs ago',
    gasUsed: '21,000',
  },
  {
    hash: '0x1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b',
    from: '0x925a3b8D4742d35Cc6634C0532925a3b8D4C0532',
    to: '0xC6634C0532925a3b8D4742d35Cc6634C0532925a',
    value: '0.05',
    status: 'success' as const,
    timestamp: '15 secs ago',
    gasUsed: '65,432',
  },
  {
    hash: '0x5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a',
    from: '0x3b8D4742d35Cc6634C0532925a3b8D4C0532925a',
    to: '0x0532925a3b8D4742d35Cc6634C0532925a3b8D4C',
    value: '1,250.00',
    status: 'pending' as const,
    timestamp: '22 secs ago',
    gasUsed: '84,291',
  },
  {
    hash: '0x9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e',
    from: '0x6634C0532925a3b8D4742d35Cc6634C0532925a3b',
    to: '0x532925a3b8D4742d35Cc6634C0532925a3b8D4C05',
    value: '45.25',
    status: 'error' as const,
    timestamp: '35 secs ago',
    gasUsed: '21,000',
  },
  {
    hash: '0x3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f',
    from: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    to: '0x8D4C0532925a3b8D4742d35Cc6634C0532925a3b',
    value: '892.10',
    status: 'success' as const,
    timestamp: '41 secs ago',
    gasUsed: '156,789',
  },
];

export const LatestTransactions: React.FC = () => {
  return (
    <section className="py-12 bg-black/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-orbitron text-foreground mb-2">
              Latest Transactions
            </h2>
            <p className="text-muted-foreground">
              Live transaction feed across the network
            </p>
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            View All Transactions
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <TransactionRow key={tx.hash} {...tx} />
          ))}
        </div>
      </div>
    </section>
  );
};