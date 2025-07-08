import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { AddressDetails } from '@/components/organisms/AddressDetails';

interface AddressPageProps {
  params: Promise<{
    address: string;
  }>;
}
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { address } = await params

  const data = await getAddress(address);

  const balance = Number(data?.accountInfo?.value.lamports ?? 0) / 1_000_000_000;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${address} | Balance ${balance} GORB`,
    description: `Total transactions ${data.allTx.length || '0'}`,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
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