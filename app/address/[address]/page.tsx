import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { AddressDetails } from '@/components/organisms/AddressDetails';

interface AddressPageProps {
  params: Promise<{
    address: string;
  }>;
}

export default async function AddressPage({ params }: AddressPageProps) {
  const { address } = await params;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AddressDetails address={address} />
      </main>
      <Footer />
    </div>
  );
}