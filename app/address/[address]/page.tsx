import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { AddressDetails } from '@/components/organisms/AddressDetails';

interface AddressPageProps {
  params: {
    address: string;
  };
}

export default function AddressPage({ params }: AddressPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AddressDetails address={params.address} />
      </main>
      <Footer />
    </div>
  );
}