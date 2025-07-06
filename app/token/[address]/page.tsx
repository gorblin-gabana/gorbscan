"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import TokenDetailsPage from '@/components/organisms/tokenDetails';
import TransactionRow from '@/components/organisms/transactions';
import { useGorbchainData } from '@/hooks/useGorbchainData';

interface AddressPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default function AddressPage({ params }: AddressPageProps) {
  const [address, setAddress] = useState<string>("");
  const { getAddress } = useGorbchainData();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const resolved = await params;
      setAddress(resolved.address);
    })();
  }, [params]);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError(null);
    getAddress(address)
      .then((data: any) => {
        setTransactions(data?.allTx || []);
      })
      .catch((e: any) => {
        setError(e.message || 'Failed to fetch transactions');
      })
      .finally(() => setLoading(false));
  }, [address, getAddress]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col lg:flex-row container mx-auto px-4 py-8 gap-8">
        {address && (
          <section className="w-full lg:w-2/5 xl:w-1/3  rounded-xl shadow-lg p-6 mb-8 lg:mb-0">
            <TokenDetailsPage address={address} />
          </section>
        )}
        <section className="flex-1  rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-primary">Recent Transactions</h2>
          {loading && <div className="text-center py-8 text-gray-500">Loading transactions...</div>}
          {error && <div className="text-center text-red-500 py-8">{error}</div>}
          {!loading && !error && transactions.length === 0 && (
            <div className="text-center text-gray-400 py-8">No transactions found for this address.</div>
          )}
          <div className="space-y-4">
            {transactions.map((tx, idx) => (
              <TransactionRow key={tx.signature || idx} tx={tx} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}