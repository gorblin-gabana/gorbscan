"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { PublicKey, Connection, AccountInfo } from "@solana/web3.js";


const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
// ===== TYPES =====
export interface Block {
  blockNumber: number;
  timestamp: string;
  transactionCount: number;
  validator: string;
  reward: string;
  gasUsed: string;
  hash: string;
  parentHash: string;
  size: string;
  difficulty: string;
}

export interface Transaction {
  signature: string;
  blockNumber: number;
  timestamp: string;
  blockTime: string;
  status: 'success' | 'failed' | 'pending';
  signer: string;
  recipient: string;
  amount: string;
  amountUSD: string;
  token: string;
  fee: string;
  feeUSD: string;
  computeUnits: number;
  version: number;
  recentBlockhash: string;
  type: 'transfer' | 'swap' | 'stake' | 'vote' | 'contract';
  instructions: Array<{
    programId: string;
    programName: string;
    instruction: string;
    data: string;
    accounts: Array<{
      pubkey: string;
      isSigner: boolean;
      isWritable: boolean;
    }>;
  }>;
}

export interface L2Chain {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  chainId: number;
  nativeToken: string;
  totalValueLocked: string;
  tvlUSD: string;
  dailyTransactions: number;
  totalBlocks: number;
  avgBlockTime: string;
  gasPrice: string;
  uptime: string;
  commission: string;
  delegators: number;
  lastSeen: string;
  website?: string;
  explorer?: string;
  bridge?: string;
  logo?: string;
}

export interface NetworkHealth {
  tps: number;
  successRate: number;
  blockTime: number;
  epoch: number;
  epochProgress: number;
}

export interface Supply {
  total: number;
  circulating: number;
  nonCirculating: number;
}

export interface Metadata {
  dataSource: string;
  estimatedValues: string[];
  lastUpdated: string; // ISO date string
  rpcStatus: string;
}

export interface NetworkStats {
  totalTransactions: number;
  totalWallets: number;
  totalTokenVolume: string;
  activeWalletsToday: number;
  transactionsToday: number;
  currentSlot: number;
  tokenCount: number;
  networkHealth: NetworkHealth;
  supply: Supply;
  metadata: Metadata;
}

export interface Address {
  address: string;
  balance: string;
  balanceUSD: string;
  tokenHoldings: Array<{
    token: string;
    symbol: string;
    amount: string;
    amountUSD: string;
    price: string;
  }>;
  transactions: Transaction[];
  type: 'wallet' | 'contract' | 'program';
  label?: string;
}

export interface ChartData {
  networkActivity: Array<{
    date: string;
    transactions: number;
    volume: number;
    activeAddresses: number;
  }>;
  l2Performance: Array<{
    chainId: string;
    name: string;
    tps: number;
    tvl: number;
    uptime: number;
  }>;
  tokenMetrics: {
    price: string;
    priceChange24h: number;
    marketCap: string;
    volume24h: string;
    circulatingSupply: string;
  };
}


export interface DailyTxCount {
  date: string;   // e.g., "2025-06-04"
  count: number;  // number of transactions on that day
}

export interface TxChartData {
  chartData: DailyTxCount[];
  totalTxns: number;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
}

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_HTTPS_RPC;
const WS_ENDPOINT = process.env.NEXT_PUBLIC_WS_ENDPOINT;
const connection = new Connection(RPC_ENDPOINT || "", {
  commitment: 'confirmed',
  wsEndpoint: WS_ENDPOINT,
  disableRetryOnRateLimit: false,
});


export const getBlocks = async (count: number, startBlock: number = 8429847) => {

  try {
    const response = await fetch(`${BASE_URL}/api/block/latest?limit=${count}`);
    const res = await response.json();

    return res;
  }
  catch (err: any) {
    return [];
  }


};

export async function isTokenAccount(
  mintAddress: string,
): Promise<boolean> {
  try {

    const publicKey = new PublicKey(mintAddress);
    const accountInfo = await connection.getAccountInfo(publicKey);
    console.log("acountinfo", accountInfo)

    if (!accountInfo) {
      console.log("minted account ")
      return false
    }
    return accountInfo.owner.toBase58() == process.env.NEXT_PUBLIC_PROGRAM_ID;
  } catch (e: any) {

    console.log("err is token", e)
    return false;
  }
}

export const getTokendataByAddress = async (mintAddress: string) => {
  try {
    if (!mintAddress) throw new Error("No mint address provided");
    const response = await fetch(`${BASE_URL}/api/tokens/mint/${mintAddress}`);
    if (!response.ok) throw new Error("Failed to fetch token data");
    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error("getTokendataByAddress error:", err);
    return null;
  }
}

export const getTransactions = async (count: number): Promise<Transaction[]> => {
  try {
    const response = await fetch(`https://api.gorbscan.com/api/tx/latest?limit=${count}`);
    const data = await response.json();
    // Map API response to Transaction[]
    return data.map((item: any) => ({
      signature: item.transaction.signatures[0],
      blockNumber: item.slot,
      timestamp: new Date(item.blockTime * 1000).toISOString(),
      blockTime: item.blockTime.toString(),
      status: item.meta.status.Err ? 'failed' : 'success',
      signer: item.transaction.message.accountKeys[0]?.pubkey || '',
      recipient: item.transaction.message.instructions[0]?.parsed?.info?.destination || '',
      amount: (item.transaction.message.instructions[0]?.parsed?.info?.lamports / 1e9).toFixed(6),
      amountUSD: '', // Not available in API
      token: 'GORB', // Or parse from instruction if available
      fee: (item.meta.fee / 1e9).toFixed(6),
      feeUSD: '', // Not available in API
      computeUnits: item.meta.computeUnitsConsumed || 0,
      version: item.transaction.version === 'legacy' ? 0 : 1,
      recentBlockhash: item.transaction.message.recentBlockhash,
      type: item.transaction.message.instructions[0]?.parsed?.type || 'transfer',
      instructions: item.transaction.message.instructions.map((ix: any) => ({
        programId: ix.programId,
        programName: ix.program,
        instruction: ix.parsed?.type || '',
        data: '', // Not available in API
        accounts: (item.transaction.message.accountKeys || []).map((acc: any) => ({
          pubkey: acc.pubkey,
          isSigner: acc.signer,
          isWritable: acc.writable
        }))
      }))
    }));
  } catch (err) {
    return [];
  }
};

export const MOCK_L2_CHAINS: L2Chain[] = [
  {
    id: 'arbitrum-gorb',
    name: 'Arbitrum Gorb',
    description: 'High-performance L2 optimistic rollup for DeFi applications',
    status: 'active',
    chainId: 42161,
    nativeToken: 'ARB',
    totalValueLocked: '2.1B',
    tvlUSD: '$2,100,000,000',
    dailyTransactions: 125000,
    totalBlocks: 15420847,
    avgBlockTime: '0.25s',
    gasPrice: '0.1 gwei',
    uptime: '99.8%',
    commission: '2.5%',
    delegators: 15420,
    lastSeen: '2 mins ago',
    website: 'https://arbitrum.gorb.chain',
    explorer: 'https://arbiscan.gorb.chain',
    bridge: 'https://bridge.arbitrum.gorb.chain',
    logo: '/assets/arbitrum-logo.png'
  },
  {
    id: 'polygon-gorb',
    name: 'Polygon Gorb',
    description: 'Ethereum-compatible L2 with high throughput and low fees',
    status: 'active',
    chainId: 137,
    nativeToken: 'MATIC',
    totalValueLocked: '1.8B',
    tvlUSD: '$1,800,000,000',
    dailyTransactions: 98000,
    totalBlocks: 8930124,
    avgBlockTime: '2.1s',
    gasPrice: '30 gwei',
    uptime: '99.9%',
    commission: '3.0%',
    delegators: 12840,
    lastSeen: '1 min ago',
    website: 'https://polygon.gorb.chain',
    explorer: 'https://polygonscan.gorb.chain',
    bridge: 'https://wallet.polygon.gorb.chain',
    logo: '/assets/polygon-logo.png'
  },
  {
    id: 'optimism-gorb',
    name: 'Optimism Gorb',
    description: 'Optimistic rollup L2 focusing on Ethereum compatibility',
    status: 'active',
    chainId: 10,
    nativeToken: 'OP',
    totalValueLocked: '950M',
    tvlUSD: '$950,000,000',
    dailyTransactions: 67000,
    totalBlocks: 5420689,
    avgBlockTime: '2.0s',
    gasPrice: '0.001 gwei',
    uptime: '99.7%',
    commission: '2.0%',
    delegators: 8920,
    lastSeen: '30 secs ago',
    website: 'https://optimism.gorb.chain',
    explorer: 'https://optimistic.gorb.chain',
    bridge: 'https://app.optimism.gorb.chain',
    logo: '/assets/optimism-logo.png'
  },
  {
    id: 'base-gorb',
    name: 'Base Gorb',
    description: 'Coinbase L2 solution built on Optimism stack',
    status: 'active',
    chainId: 8453,
    nativeToken: 'ETH',
    totalValueLocked: '1.2B',
    tvlUSD: '$1,200,000,000',
    dailyTransactions: 89000,
    totalBlocks: 6820934,
    avgBlockTime: '2.0s',
    gasPrice: '0.01 gwei',
    uptime: '99.6%',
    commission: '1.5%',
    delegators: 11200,
    lastSeen: '45 secs ago',
    website: 'https://base.gorb.chain',
    explorer: 'https://basescan.gorb.chain',
    bridge: 'https://bridge.base.gorb.chain',
    logo: '/assets/base-logo.png'
  },
  {
    id: 'zksync-gorb',
    name: 'zkSync Gorb',
    description: 'Zero-knowledge rollup with Ethereum-level security',
    status: 'active',
    chainId: 324,
    nativeToken: 'ETH',
    totalValueLocked: '780M',
    tvlUSD: '$780,000,000',
    dailyTransactions: 45000,
    totalBlocks: 3920847,
    avgBlockTime: '1.0s',
    gasPrice: '0.25 gwei',
    uptime: '99.4%',
    commission: '3.5%',
    delegators: 6830,
    lastSeen: '1 min ago',
    website: 'https://zksync.gorb.chain',
    explorer: 'https://explorer.zksync.gorb.chain',
    bridge: 'https://portal.zksync.gorb.chain',
    logo: '/assets/zksync-logo.png'
  },
  {
    id: 'starknet-gorb',
    name: 'Starknet Gorb',
    description: 'STARK-based ZK-rollup for scalable computation',
    status: 'maintenance',
    chainId: 23294,
    nativeToken: 'STRK',
    totalValueLocked: '420M',
    tvlUSD: '$420,000,000',
    dailyTransactions: 23000,
    totalBlocks: 2840293,
    avgBlockTime: '10s',
    gasPrice: '1 gwei',
    uptime: '98.9%',
    commission: '4.0%',
    delegators: 4920,
    lastSeen: '2 hours ago',
    website: 'https://starknet.gorb.chain',
    explorer: 'https://starkscan.gorb.chain',
    bridge: 'https://starkgate.gorb.chain',
    logo: '/assets/starknet-logo.png'
  }
];

// ===== DATA STATE =====
interface DataState {
  // Core data
  networkStats: NetworkStats | null;
  blocks: Block[];
  transactions: Transaction[];
  l2Chains: L2Chain[];

  // Pagination data
  totalBlocks: number;
  totalTransactions: number;

  // Loading states
  loading: boolean;
  initialized: boolean;

  // Cache for individual items
  blockCache: Map<number, Block>;
  transactionCache: Map<string, Transaction>;
  addressCache: Map<string, Address>;

  // Chart data
  txChartData: TxChartData | null;
}

type DataAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_NETWORK_STATS'; payload: NetworkStats }
  | { type: 'SET_BLOCKS'; payload: { blocks: Block[]; total: number } }
  | { type: 'SET_TRANSACTIONS'; payload: { transactions: Transaction[]; total: number } }
  | { type: 'SET_L2_CHAINS'; payload: L2Chain[] }
  | { type: 'CACHE_BLOCK'; payload: { blockNumber: number; block: Block } }
  | { type: 'CACHE_TRANSACTION'; payload: { signature: string; transaction: Transaction } }
  | { type: 'CACHE_ADDRESS'; payload: { address: string; data: Address } }
  | { type: 'SET_TX_CHART_DATA'; payload: TxChartData | null };

const initialState: DataState = {
  networkStats: null,
  blocks: [],
  transactions: [],
  l2Chains: [],
  totalBlocks: 0,
  totalTransactions: 0,
  loading: true,
  initialized: false,
  blockCache: new Map(),
  transactionCache: new Map(),
  addressCache: new Map(),
  txChartData: null,
};

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, initialized: action.payload };
    case 'SET_NETWORK_STATS':
      return { ...state, networkStats: action.payload };
    case 'SET_BLOCKS':
      return {
        ...state,
        blocks: action.payload.blocks,
        totalBlocks: action.payload.total
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload.transactions,
        totalTransactions: action.payload.total
      };
    case 'SET_L2_CHAINS':
      return { ...state, l2Chains: action.payload };
    case 'CACHE_BLOCK':
      const newBlockCache = new Map(state.blockCache);
      newBlockCache.set(action.payload.blockNumber, action.payload.block);
      return { ...state, blockCache: newBlockCache };
    case 'CACHE_TRANSACTION':
      const newTxCache = new Map(state.transactionCache);
      newTxCache.set(action.payload.signature, action.payload.transaction);
      return { ...state, transactionCache: newTxCache };
    case 'CACHE_ADDRESS':
      const newAddressCache = new Map(state.addressCache);
      newAddressCache.set(action.payload.address, action.payload.data);
      return { ...state, addressCache: newAddressCache };
    case 'SET_TX_CHART_DATA':
      return { ...state, txChartData: action.payload };
    default:
      return state;
  }
}

// ===== CONTEXT =====
interface GorbchainDataContextType extends DataState {
  // API Methods
  fetchBlocks: (page?: number, limit?: number) => Promise<{ blocks: Block[]; total: number }>;
  fetchBlock: (blockNumber: number) => Promise<Block | null>;
  fetchTransactions: (page?: number, limit?: number, filters?: { status?: string; search?: string }) => Promise<{ transactions: Transaction[]; total: number }>;
  fetchTransaction: (signature: string) => Promise<Transaction | null>;
  fetchL2Chains: (filters?: { status?: string }) => Promise<L2Chain[]>;
  fetchAddress: (address: string) => Promise<Address | null>;
  fetchChartData: () => Promise<ChartData>;
  fetchTxChartData: () => Promise<TxChartData | null>;
  search: (query: string) => Promise<{ blocks: Block[]; transactions: Transaction[]; addresses: string[] }>;
  refreshData: () => Promise<void>;
  isTokenAccount: (mintAddress: string) => Promise<boolean>;
  getTokendataByAddress: (mintAddress: string) => Promise<any>;
}

const GorbchainDataContext = createContext<GorbchainDataContextType | undefined>(undefined);

// ===== PROVIDER =====
interface GorbchainDataProviderProps {
  children: ReactNode;
  useMockData?: boolean; // Toggle between mock and real API
}

export const GorbchainDataProvider: React.FC<GorbchainDataProviderProps> = ({
  children,
  useMockData = true
}) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (useMockData) {
          // Load mock data in parallel
          const [blocks, transactions, statsResponse] = await Promise.all([
            getBlocks(25),
            getTransactions(300),
            fetch(`${BASE_URL}/api/analytics/overview`)
          ]);
          const statsData = await statsResponse.json();
          dispatch({ type: 'SET_NETWORK_STATS', payload: statsData });

          dispatch({ type: 'SET_BLOCKS', payload: { blocks: blocks.slice(0, 10), total: blocks.length } });
          dispatch({ type: 'SET_TRANSACTIONS', payload: { transactions: transactions.slice(0, 10), total: transactions.length } });
          dispatch({ type: 'SET_L2_CHAINS', payload: MOCK_L2_CHAINS });

          // Cache all blocks and transactions for quick access
          blocks.forEach((block: any) => {
            dispatch({ type: 'CACHE_BLOCK', payload: { blockNumber: block.blockNumber, block } });
          });
          transactions.forEach((tx: any) => {
            dispatch({ type: 'CACHE_TRANSACTION', payload: { signature: tx.signature, transaction: tx } });
          });
        } else {
          // TODO: Load from real API
          console.log('Real API integration not implemented yet');
        }

        dispatch({ type: 'SET_INITIALIZED', payload: true });
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeData();
  }, [useMockData]);

  // Auto-fetch txChartData on mount
  useEffect(() => {
    fetchTxChartData();
  }, []);

  // API Methods
  const fetchBlocks = async (page: number = 1, limit: number = 25) => {
    // Always fetch fresh mock blocks for the requested page
    const startBlock = 8429847 - ((page - 1) * limit);
    const blocks = await getBlocks(limit, startBlock);
    return { blocks, total: 8429847 };
  };

  const fetchBlock = async (blockNumber: number) => {
    // Always fetch a single mock block for the requested blockNumber
    const blocks = await getBlock(blockNumber);
    console.log("block ", blocks)
    return blocks || null;
  };

  const fetchTransactions = async (page: number = 1, limit: number = 25, filters?: { status?: string; search?: string }) => {
    let allTransactions = Array.from(state.transactionCache.values());

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      allTransactions = allTransactions.filter(tx => tx.status === filters.status);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      allTransactions = allTransactions.filter(tx =>
        tx.signature.toLowerCase().includes(search) ||
        tx.signer.toLowerCase().includes(search) ||
        tx.recipient.toLowerCase().includes(search)
      );
    }

    const startIndex = (page - 1) * limit;
    const transactions = allTransactions.slice(startIndex, startIndex + limit);

    return { transactions, total: allTransactions.length };
  };

  const getBlock = async (block: any) => {
    try {
      const response = await fetch(`${BASE_URL}/api/block/transactions/${block}`)

      const res = await response.json();
      return res;
    }
    catch (err: any) {
      return null;
    }
  }
  const fetchTransaction = async (signature: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/tx/${signature}`);

      const res = await response.json();

      return res;
    }
    catch (err: any) {
      return null;
    }
  };

  const fetchL2Chains = async (filters?: { status?: string }) => {
    let chains = [...MOCK_L2_CHAINS];

    if (filters?.status && filters.status !== 'all') {
      chains = chains.filter(chain => chain.status === filters.status);
    }

    return chains;
  };

  const fetchAddress = async (address: string) => {
    if (state.addressCache.has(address)) {
      return state.addressCache.get(address)!;
    }

    // Generate mock address data
    const addressData: Address = {
      address,
      balance: (Math.random() * 1000).toFixed(6),
      balanceUSD: `$${(Math.random() * 10000).toFixed(2)}`,
      tokenHoldings: [
        {
          token: 'GORB',
          symbol: 'GORB',
          amount: (Math.random() * 1000).toFixed(6),
          amountUSD: `$${(Math.random() * 10000).toFixed(2)}`,
          price: '$10.24'
        },
        {
          token: 'USDC',
          symbol: 'USDC',
          amount: (Math.random() * 500).toFixed(2),
          amountUSD: `$${(Math.random() * 500).toFixed(2)}`,
          price: '$1.00'
        }
      ],
      transactions: Array.from(state.transactionCache.values()).slice(0, 10),
      type: 'wallet'
    };

    dispatch({ type: 'CACHE_ADDRESS', payload: { address, data: addressData } });
    return addressData;
  };

  const fetchChartData = async (): Promise<ChartData> => {
    return {
      networkActivity: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        transactions: Math.floor(Math.random() * 100000) + 50000,
        volume: Math.floor(Math.random() * 10000000) + 5000000,
        activeAddresses: Math.floor(Math.random() * 5000) + 2000
      })),
      l2Performance: MOCK_L2_CHAINS.map(chain => ({
        chainId: chain.id,
        name: chain.name,
        tps: Math.floor(Math.random() * 1000) + 100,
        tvl: parseFloat(chain.totalValueLocked.replace(/[^0-9.]/g, '')),
        uptime: parseFloat(chain.uptime.replace('%', ''))
      })),
      tokenMetrics: {
        price: '$10.24',
        priceChange24h: (Math.random() * 20) - 10,
        marketCap: '$2.4B',
        volume24h: '$125M',
        circulatingSupply: '234.5M'
      }
    };
  };

  const fetchTxChartData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/tx/chart-data`);
      const data = await response.json();
      dispatch({ type: 'SET_TX_CHART_DATA', payload: data.data });
      return data;
    } catch (err) {
      dispatch({ type: 'SET_TX_CHART_DATA', payload: null });
      return null;
    }
  };

  const search = async (query: string) => {
    const blocks = Array.from(state.blockCache.values()).filter(b =>
      b.blockNumber.toString().includes(query) ||
      b.hash.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);

    const transactions = Array.from(state.transactionCache.values()).filter(t =>
      t.signature.toLowerCase().includes(query.toLowerCase()) ||
      t.signer.toLowerCase().includes(query.toLowerCase()) ||
      t.recipient.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);

    return { blocks, transactions, addresses: [] };
  };

  const refreshData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));

    const blocks = await getBlocks(25);
    const transactions = await getTransactions(500);

    dispatch({ type: 'SET_BLOCKS', payload: { blocks: blocks.slice(0, 10), total: blocks.length } });
    dispatch({ type: 'SET_TRANSACTIONS', payload: { transactions: transactions.slice(0, 10), total: transactions.length } });

    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const contextValue: GorbchainDataContextType = {
    ...state,
    fetchBlocks,
    fetchBlock,
    fetchTransactions,
    fetchTransaction,
    fetchL2Chains,
    fetchAddress,
    fetchChartData,
    fetchTxChartData,
    search,
    refreshData,
    isTokenAccount,
    getTokendataByAddress
  };

  return (
    <GorbchainDataContext.Provider value={contextValue}>
      {children}
    </GorbchainDataContext.Provider>
  );
};

// ===== HOOK =====
export const useGorbchainData = () => {
  const context = useContext(GorbchainDataContext);
  if (!context) {
    throw new Error('useGorbchainData must be used within GorbchainDataProvider');
  }
  return context;
};

export default GorbchainDataContext;