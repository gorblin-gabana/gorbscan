// Types for our data structures
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

export interface NetworkStats {
  networkTPS: string;
  totalL2Chains: string;
  totalBlocks: string;
  marketCap: string;
  totalValueLocked: string;
  avgBlockTime: string;
  networkUptime: string;
  avgCommission: string;
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

// Mock data generators
const generateMockBlocks = (count: number): Block[] => {
  return Array.from({ length: count }, (_, i) => ({
    blockNumber: 8429847 - i,
    timestamp: `${12 + i * 12} secs ago`,
    transactionCount: Math.floor(Math.random() * 300) + 50,
    validator: 'Gorbchain Validator',
    reward: '2.5',
    gasUsed: `${Math.floor(Math.random() * 10000000) + 20000000}`,
    hash: `0x${Math.random().toString(16).substr(2, 64)}`,
    parentHash: `0x${Math.random().toString(16).substr(2, 64)}`,
    size: `${Math.floor(Math.random() * 50000) + 10000} bytes`,
    difficulty: `${Math.floor(Math.random() * 1000000) + 5000000}`,
  }));
};

const generateMockTransactions = (count: number): Transaction[] => {
  const types: Transaction['type'][] = ['transfer', 'swap', 'stake', 'vote', 'contract'];
  const statuses: Transaction['status'][] = ['success', 'failed', 'pending'];
  
  return Array.from({ length: count }, (_, i) => ({
    signature: `0x${Math.random().toString(16).substr(2, 64)}`,
    blockNumber: 8429847 - Math.floor(i / 10),
    timestamp: `${30 + i * 15} secs ago`,
    blockTime: `Jul ${Math.floor(Math.random() * 30) + 1}, 2025 • ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} UTC`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    signer: `0x${Math.random().toString(16).substr(2, 40)}`,
    recipient: `0x${Math.random().toString(16).substr(2, 40)}`,
    amount: (Math.random() * 10).toFixed(6),
    amountUSD: `$${(Math.random() * 1000).toFixed(2)}`,
    token: 'GORB',
    fee: (Math.random() * 0.01).toFixed(6),
    feeUSD: `$${(Math.random() * 0.1).toFixed(4)}`,
    computeUnits: Math.floor(Math.random() * 200) + 50,
    version: 0,
    recentBlockhash: `0x${Math.random().toString(16).substr(2, 64)}`,
    type: types[Math.floor(Math.random() * types.length)],
    instructions: [{
      programId: '11111111111111111111111111111112',
      programName: 'System Program',
      instruction: 'Transfer',
      data: '0x02000000e803000000000000',
      accounts: [
        { pubkey: `0x${Math.random().toString(16).substr(2, 40)}`, isSigner: true, isWritable: true },
        { pubkey: `0x${Math.random().toString(16).substr(2, 40)}`, isSigner: false, isWritable: true }
      ]
    }]
  }));
};

const generateMockL2Chains = (): L2Chain[] => {
  return [
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
};

const generateMockChartData = (): ChartData => {
  return {
    networkActivity: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      transactions: Math.floor(Math.random() * 100000) + 50000,
      volume: Math.floor(Math.random() * 10000000) + 5000000,
      activeAddresses: Math.floor(Math.random() * 5000) + 2000
    })),
    l2Performance: generateMockL2Chains().map(chain => ({
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

// Network stats
const mockNetworkStats: NetworkStats = {
  networkTPS: '2,847',
  totalL2Chains: '6',
  totalBlocks: '8,429,847',
  marketCap: '$2.4B',
  totalValueLocked: '$7.25B',
  avgBlockTime: '1.2s',
  networkUptime: '99.8%',
  avgCommission: '2.75%'
};

// API Service Class
class GorbchainApiService {
  private static instance: GorbchainApiService;
  private blocks: Block[] = [];
  private transactions: Transaction[] = [];
  private l2Chains: L2Chain[] = [];
  private chartData: ChartData | null = null;
  private networkStats: NetworkStats = mockNetworkStats;
  private initialized = false;

  private constructor() {}

  public static getInstance(): GorbchainApiService {
    if (!GorbchainApiService.instance) {
      GorbchainApiService.instance = new GorbchainApiService();
    }
    return GorbchainApiService.instance;
  }

  // Initialize data
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Simulate API initialization delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.blocks = generateMockBlocks(200);
      this.transactions = generateMockTransactions(500);
      this.l2Chains = generateMockL2Chains();
      this.chartData = generateMockChartData();
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize API service:', error);
      throw error;
    }
  }

  // Blocks API
  public async getBlocks(page: number = 1, limit: number = 25): Promise<{ blocks: Block[]; total: number }> {
    await this.ensureInitialized();
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      blocks: this.blocks.slice(startIndex, endIndex),
      total: this.blocks.length
    };
  }

  public async getBlock(blockNumber: number): Promise<Block | null> {
    await this.ensureInitialized();
    return this.blocks.find(b => b.blockNumber === blockNumber) || null;
  }

  // Transactions API
  public async getTransactions(page: number = 1, limit: number = 25, filters?: {
    status?: string;
    search?: string;
  }): Promise<{ transactions: Transaction[]; total: number }> {
    await this.ensureInitialized();
    
    let filteredTransactions = [...this.transactions];
    
    if (filters?.status && filters.status !== 'all') {
      filteredTransactions = filteredTransactions.filter(tx => tx.status === filters.status);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredTransactions = filteredTransactions.filter(tx =>
        tx.signature.toLowerCase().includes(search) ||
        tx.signer.toLowerCase().includes(search) ||
        tx.recipient.toLowerCase().includes(search)
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      transactions: filteredTransactions.slice(startIndex, endIndex),
      total: filteredTransactions.length
    };
  }

  public async getTransaction(signature: string): Promise<Transaction | null> {
    await this.ensureInitialized();
    return this.transactions.find(t => t.signature === signature) || null;
  }

  public async getLatestTransactions(limit: number = 5): Promise<Transaction[]> {
    await this.ensureInitialized();
    return this.transactions.slice(0, limit);
  }

  // L2 Chains API
  public async getL2Chains(filters?: {
    status?: string;
  }): Promise<L2Chain[]> {
    await this.ensureInitialized();
    
    if (filters?.status && filters.status !== 'all') {
      return this.l2Chains.filter(chain => chain.status === filters.status);
    }
    
    return this.l2Chains;
  }

  public async getL2Chain(chainId: string): Promise<L2Chain | null> {
    await this.ensureInitialized();
    return this.l2Chains.find(chain => chain.id === chainId) || null;
  }

  // Address API
  public async getAddress(address: string): Promise<Address | null> {
    await this.ensureInitialized();
    
    // Get transactions for this address
    const addressTransactions = this.transactions.filter(tx =>
      tx.signer === address || tx.recipient === address
    ).slice(0, 10);
    
    return {
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
      transactions: addressTransactions,
      type: 'wallet'
    };
  }

  // Network Stats API
  public async getNetworkStats(): Promise<NetworkStats> {
    await this.ensureInitialized();
    return this.networkStats;
  }

  // Charts API
  public async getChartData(): Promise<ChartData> {
    await this.ensureInitialized();
    return this.chartData!;
  }

  // Search API
  public async search(query: string): Promise<{
    blocks: Block[];
    transactions: Transaction[];
    addresses: string[];
  }> {
    await this.ensureInitialized();
    
    const blocks = this.blocks.filter(b =>
      b.blockNumber.toString().includes(query) ||
      b.hash.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
    
    const transactions = this.transactions.filter(t =>
      t.signature.toLowerCase().includes(query.toLowerCase()) ||
      t.signer.toLowerCase().includes(query.toLowerCase()) ||
      t.recipient.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
    
    return {
      blocks,
      transactions,
      addresses: [] // Can be expanded later
    };
  }

  // Utility method to ensure initialization
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  // Refresh data
  public async refreshData(): Promise<void> {
    this.initialized = false;
    await this.initialize();
  }
}

// Export singleton instance
export const gorbchainApi = GorbchainApiService.getInstance(); 