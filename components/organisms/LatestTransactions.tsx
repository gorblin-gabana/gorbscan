"use client";

import React from 'react';
import { Button } from '@/components/atoms/Button';
import { TransactionRow } from '@/components/molecules/TransactionRow';
import { useGorbchainData } from '@/contexts/GorbchainDataContext';
import { ArrowRight } from 'lucide-react';

export const LatestTransactions: React.FC = () => {
  const { transactions, loading } = useGorbchainData();

  // Get the latest 5 transactions from the context
  const latestTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <section className="w-full section-spacing bg-card/20">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Latest Transactions</h2>
            <p className="body-lg max-w-2xl mx-auto">
              Real-time transaction activity on the Gorbchain network
            </p>
          </div>
          
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="gorb-card p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full section-spacing bg-card/20">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">
            Latest Transactions
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Real-time transaction activity on the Gorbchain network and L2 chains
          </p>
        </div>
        
        <div className="grid gap-4">
          {latestTransactions.map((tx) => (
            <TransactionRow key={tx.signature} {...tx} />
          ))}
          
          {latestTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recent transactions available</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <a
            href="/transactions"
            className="btn-outline btn-md group"
          >
            View All Transactions
            <ArrowRight className="icon-sm group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  );
};