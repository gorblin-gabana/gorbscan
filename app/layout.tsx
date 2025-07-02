import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import { GorbchainDataProvider } from '@/contexts/GorbchainDataContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'GorbScan - Gorbchain Explorer',
  description: 'The most comprehensive blockchain explorer for Gorbchain. Track transactions, explore blocks, and monitor network activity in real-time.',
  keywords: 'blockchain, explorer, gorbchain, gorb, cryptocurrency, transactions, blocks',
  authors: [{ name: 'GorbScan Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-inter antialiased`}>
        <GorbchainDataProvider useMockData={true}>
          {children}
        </GorbchainDataProvider>
      </body>
    </html>
  );
}