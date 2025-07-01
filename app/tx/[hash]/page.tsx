import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { TransactionDetails } from '@/components/organisms/TransactionDetails';

interface TransactionPageProps {
  params: {
    hash: string;
  };
}

export default function TransactionPage({ params }: TransactionPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <TransactionDetails hash={params.hash} />
      </main>
      <Footer />
    </div>
  );
}