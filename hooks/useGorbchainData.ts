"use client";

import { useEffect, useState, useCallback } from 'react';
import {
  gorbchainApi,
  Block,
  Transaction,
  L2Chain,
  NetworkStats,
  Address,
  ChartData
} from '@/services/gorbchainApi';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface UseGorbchainDataReturn {
  // Network stats
  networkStats: NetworkStats;

  // Blocks
  latestBlocks: Block[];
  getBlocks: (page?: number, limit?: number) => Promise<{ blocks: Block[]; total: number }>;
  getBlock: (blockNumber: number) => Promise<Block | null>;

  // Transactions
  latestTransactions: Transaction[];
  getTransactions: (page?: number, limit?: number, filters?: { status?: string; search?: string }) => Promise<{ transactions: Transaction[]; total: number }>;
  getTransaction: (signature: string) => Promise<Transaction | null>;

  // L2 Chains
  l2Chains: L2Chain[];
  getL2Chains: (filters?: { status?: string }) => Promise<L2Chain[]>;
  getL2Chain: (chainId: string) => Promise<L2Chain | null>;

  // Address
  getAddress: (address: string) => Promise<Address | null>;

  // Charts
  getChartData: () => Promise<ChartData>;

  // Search
  search: (query: string) => Promise<{
    blocks: Block[];
    transactions: Transaction[];
    addresses: string[];
  }>;

  // Loading states
  loading: boolean;
  initialized: boolean;

  // Utility
  refreshData: () => Promise<void>;
}

export const useGorbchainData = (): UseGorbchainDataReturn => {
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    networkTPS: '0',
    totalL2Chains: '0',
    totalBlocks: '0',
    marketCap: '$0',
    totalValueLocked: '$0',
    avgBlockTime: '0s',
    networkUptime: '0%',
    avgCommission: '0%'
  });

  const [latestBlocks, setLatestBlocks] = useState<Block[]>([]);
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([]);
  const [l2Chains, setL2Chains] = useState<L2Chain[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize data on hook mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);

        // Initialize the API service
        await gorbchainApi.initialize();

        // Load initial data
        const [stats, blocks, transactions, chains] = await Promise.all([
          gorbchainApi.getNetworkStats(),
          gorbchainApi.getBlocks(1, 10),
          gorbchainApi.getLatestTransactions(10),
          gorbchainApi.getL2Chains()
        ]);

        setNetworkStats(stats);
        setLatestBlocks(blocks.blocks);
        setLatestTransactions(transactions);
        setL2Chains(chains);
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize GorbchainData:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // API wrapper functions with useCallback to prevent infinite re-renders
  const getBlocks = useCallback(async (page: number = 1, limit: number = 25) => {
    try {
      return await gorbchainApi.getBlocks(page, limit);
    } catch (error) {
      console.error('Failed to get blocks:', error);
      return { blocks: [], total: 0 };
    }
  }, []);

  const getBlock = useCallback(async (blockNumber: number) => {
    try {
      return await gorbchainApi.getBlock(blockNumber);
    } catch (error) {
      console.error('Failed to get block:', error);
      return null;
    }
  }, []);

  const getTransactions = useCallback(async (page: number = 1, limit: number = 25, filters?: { status?: string; search?: string }) => {
    try {
      return await gorbchainApi.getTransactions(page, limit, filters);
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return { transactions: [], total: 0 };
    }
  }, []);

  const getTransaction = useCallback(async (signature: string) => {
    try {
      return await gorbchainApi.getTransaction(signature);
    } catch (error) {
      console.error('Failed to get transaction:', error);
      return null;
    }
  }, []);

  const getL2Chains = useCallback(async (filters?: { status?: string }) => {
    try {
      return await gorbchainApi.getL2Chains(filters);
    } catch (error) {
      console.error('Failed to get L2 chains:', error);
      return [];
    }
  }, []);

  const getL2Chain = useCallback(async (chainId: string) => {
    try {
      return await gorbchainApi.getL2Chain(chainId);
    } catch (error) {
      console.error('Failed to get L2 chain:', error);
      return null;
    }
  }, []);

  const getAddress = useCallback(async (address: string) => {
    try {
      const responce = await fetch(`${BASE_URL}/api/tx/transactions/${address}`);
      const res = await responce.json();
      return res;
    } catch (error) {
      console.error('Failed to get address:', error);
      return null;
    }
  }, []);

  const getChartData = useCallback(async () => {
    try {
      return await gorbchainApi.getChartData();
    } catch (error) {
      console.error('Failed to get chart data:', error);
      // Return empty chart data structure
      return {
        networkActivity: [],
        l2Performance: [],
        tokenMetrics: {
          price: '$0',
          priceChange24h: 0,
          marketCap: '$0',
          volume24h: '$0',
          circulatingSupply: '0'
        }
      };
    }
  }, []);

  const search = useCallback(async (query: string) => {
    try {
      return await gorbchainApi.search(query);
    } catch (error) {
      console.error('Failed to search:', error);
      return {
        blocks: [],
        transactions: [],
        addresses: []
      };
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);

      // Refresh the API service data
      await gorbchainApi.refreshData();

      // Reload initial data
      const [stats, blocks, transactions, chains] = await Promise.all([
        gorbchainApi.getNetworkStats(),
        gorbchainApi.getBlocks(1, 10),
        gorbchainApi.getLatestTransactions(10),
        gorbchainApi.getL2Chains()
      ]);

      setNetworkStats(stats);
      setLatestBlocks(blocks.blocks);
      setLatestTransactions(transactions);
      setL2Chains(chains);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data
    networkStats,
    latestBlocks,
    latestTransactions,
    l2Chains,

    // API functions
    getBlocks,
    getBlock,
    getTransactions,
    getTransaction,
    getL2Chains,
    getL2Chain,
    getAddress,
    getChartData,
    search,

    // State
    loading,
    initialized,

    // Utility
    refreshData
  };
}; 