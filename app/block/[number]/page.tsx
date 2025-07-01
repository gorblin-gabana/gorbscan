import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { BlockDetails } from '@/components/organisms/BlockDetails';

interface BlockPageProps {
  params: {
    number: string;
  };
}

export default function BlockPage({ params }: BlockPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BlockDetails blockNumber={params.number} />
      </main>
      <Footer />
    </div>
  );
}