"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { TransactionRow } from '@/components/molecules/TransactionRow';
import { useGorbchainData } from '@/contexts/GorbchainDataContext';
import { Transaction } from '@/contexts/GorbchainDataContext';
import { useSearchParams } from 'next/navigation';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

function TransactionsContent() {
  const { fetchTransactions, initialized } = useGorbchainData();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all');
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [itemsPerPage] = useState(25);

  const searchQuery = searchParams.get('search') || '';
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  // Load transactions data
  useEffect(() => {
    const loadTransactions = async () => {
      if (!initialized) return;
      
      try {
        setLoading(true);
        const filters = {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchQuery || undefined
        };
        
        const response = await fetchTransactions(currentPage, itemsPerPage, filters);
        setTransactions(response.transactions);
        setTotalTransactions(response.total);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        setTransactions([]);
        setTotalTransactions(0);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [currentPage, statusFilter, searchQuery, fetchTransactions, initialized]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // Calculate status counts (simplified - in real app this would be from API)
  const statusCounts = {
    all: totalTransactions,
    success: Math.floor(totalTransactions * 0.85),
    failed: Math.floor(totalTransactions * 0.1),
    pending: Math.floor(totalTransactions * 0.05),
  };

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="relative w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status as any);
              }}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)} ({count.toLocaleString()})
            </button>
          ))}
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card/50 rounded-lg border border-border mb-6">
          <p className="body-sm">
            Showing <span className="text-primary font-semibold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalTransactions)}</span> of{' '}
            <span className="text-primary font-semibold">{totalTransactions.toLocaleString()}</span> transactions
            {searchQuery && (
              <span className="text-muted-foreground"> matching "{searchQuery}"</span>
            )}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="body-sm">Latest:</span>
              <span className="text-primary font-semibold">{transactions[0]?.timestamp}</span>
            </div>
            <button className="btn-outline btn-sm">
              <Filter className="icon-sm" />
              More Filters
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4 mb-8">
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.signature} {...transaction} />
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card/50 rounded-lg border border-border">
            <p className="body-sm">
              Page {currentPage} of {totalPages}
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="icon-sm" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        currentPage === pageNum
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || loading}
                className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="icon-sm" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    }>
      <TransactionsContent />
    </Suspense>
  );
} 