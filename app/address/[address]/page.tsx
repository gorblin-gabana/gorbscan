import React from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { AddressDetails } from '@/components/organisms/AddressDetails';
import type { Metadata, ResolvingMetadata } from 'next'

interface AddressPageProps {
  params: Promise<{ address: string }>;
}

const getAddress = async (address: string) => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

    const responce = await fetch(`${BASE_URL}/api/tx/transactions/${address}`);
    const res = await responce.json();
    return res;
  } catch (error) {
    return null;
  }
};


export async function generateMetadata(
  { params }: AddressPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { address } = await params;      // await the params promise

  const data = await getAddress(address);

  const balance = Number(data?.accountInfo?.value.lamports ?? 0) / 1_000_000_000;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
return {
    title: `${address} | Balance ${balance} GORB`,
    description: `Total transactions ${data.allTx.length || '0'}`,
    openGraph: {
      images: [
        {
          url: 'https://res.cloudinary.com/djhurhtw0/image/upload/v1751962451/gorscan_jjtq0q.jpg',
          width: 800,
          height: 525,
          alt: 'GorbScan Logo',
        },
      ],
    },
    twitter: {
      images: ['https://res.cloudinary.com/djhurhtw0/image/upload/v1751962451/gorscan_jjtq0q.jpg'],
    },
  }
}


export default async function AddressPage({ params }: AddressPageProps) {
  const { address } = await params;       // await params in the page component as well
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