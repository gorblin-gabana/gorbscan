import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { BlockDetails } from '@/components/organisms/BlockDetails';

interface BlockPageProps {
  params: Promise<{
    number: string;
  }>;
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { number } = await params;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BlockDetails blockNumber={number} />
      </main>
      <Footer />
    </div>
  );
}