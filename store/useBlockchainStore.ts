import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Transaction {
  signature: string;
  data: any;
  timestamp: number;
}

interface Address {
  address: string;
  data: any;
  timestamp: number;
}

interface BlockchainStore {
  transactions: Map<string, Transaction>;
  addresses: Map<string, Address>;
  
  // Transaction methods
  getTransaction: (signature: string) => Transaction | undefined;
  setTransaction: (signature: string, data: any) => void;
  
  // Address methods
  getAddress: (address: string) => Address | undefined;
  setAddress: (address: string, data: any) => void;
  
  // Cache management
  clearCache: () => void;
  isCacheValid: (timestamp: number, maxAge?: number) => boolean;
}

const CACHE_MAX_AGE = 5 * 60 * 1000; // 5 minutes

export const useBlockchainStore = create<BlockchainStore>()(
  persist(
    (set, get) => ({
      transactions: new Map(),
      addresses: new Map(),

      getTransaction: (signature: string) => {
        const tx = get().transactions.get(signature);
        if (tx && get().isCacheValid(tx.timestamp)) {
          return tx;
        }
        return undefined;
      },

      setTransaction: (signature: string, data: any) => {
        set((state) => {
          const newTransactions = new Map(state.transactions);
          newTransactions.set(signature, {
            signature,
            data,
            timestamp: Date.now(),
          });
          return { transactions: newTransactions };
        });
      },

      getAddress: (address: string) => {
        const addr = get().addresses.get(address);
        if (addr && get().isCacheValid(addr.timestamp)) {
          return addr;
        }
        return undefined;
      },

      setAddress: (address: string, data: any) => {
        set((state) => {
          const newAddresses = new Map(state.addresses);
          newAddresses.set(address, {
            address,
            data,
            timestamp: Date.now(),
          });
          return { addresses: newAddresses };
        });
      },

      clearCache: () => {
        set({ transactions: new Map(), addresses: new Map() });
      },

      isCacheValid: (timestamp: number, maxAge: number = CACHE_MAX_AGE) => {
        return Date.now() - timestamp < maxAge;
      },
    }),
    {
      name: 'blockchain-storage',
      partialize: (state) => ({
        transactions: Array.from(state.transactions.entries()),
        addresses: Array.from(state.addresses.entries()),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.transactions = new Map(state.transactions as any);
          state.addresses = new Map(state.addresses as any);
        }
      },
    }
  )
);
