import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { TransactionDetails } from '@/components/organisms/TransactionDetails';

interface TransactionPageProps {
  params: Promise<{
    hash: string;
  }>;
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  const { hash } = await params;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <TransactionDetails hash={hash} />
      <Footer />
    </div>
  );
}