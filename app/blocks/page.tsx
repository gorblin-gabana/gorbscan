"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { BlockRow } from '@/components/molecules/BlockRow';
import { useGorbchainData } from '@/contexts/GorbchainDataContext';
import { Block } from '@/contexts/GorbchainDataContext';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BlocksPage() {
  const { fetchBlocks, initialized } = useGorbchainData();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [itemsPerPage] = useState(25);

  const totalPages = Math.ceil(totalBlocks / itemsPerPage);

  useEffect(() => {
    const loadBlocks = async () => {
      if (!initialized) return;

      try {
        setLoading(true);
        const response = await fetchBlocks(currentPage, itemsPerPage);
        setBlocks(response.blocks);
        setTotalBlocks(response.total);
      } catch (error) {
        console.error('Failed to load blocks:', error);
        setBlocks([]);
        setTotalBlocks(0);
      } finally {
        setLoading(false);
      }
    };

    loadBlocks();
  }, [currentPage, fetchBlocks, initialized]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="relative w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card/50 rounded-lg border border-border mb-6">
          <p className="body-sm">
            Showing <span className="text-primary font-semibold">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalBlocks)}</span> of{' '}
            <span className="text-primary font-semibold">{totalBlocks.toLocaleString()}</span> blocks
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="body-sm">Latest block:</span>
              <span className="text-primary font-semibold">#{blocks[0]?.blockNumber}</span>
            </div>
            <button className="btn-outline btn-sm">
              <Filter className="icon-sm" />
              Filters
            </button>
          </div>
        </div>

        {/* Blocks List */}
        <div className="space-y-4 mb-8">
          {blocks.map((block: any) => (
            <BlockRow key={block.blockHeight} {...block} />
          ))}

          {blocks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blocks available</p>
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
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${currentPage === pageNum
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