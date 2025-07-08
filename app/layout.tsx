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
  title: {
    default: 'GorbScan - Gorbchain Explorer',
    template: '%s | GorbScan',
  },
  description: 'The most comprehensive blockchain explorer for Gorbchain. Track transactions, explore blocks, and monitor network activity in real-time.',
  keywords: [
    'blockchain',
    'explorer',
    'gorbchain',
    'gorb',
    'cryptocurrency',
    'transactions',
    'blocks',
    'tokens',
    'charts',
    'l2 chains',
  ],
  authors: [{ name: 'GorbScan Team' }],
  openGraph: {
    title: 'GorbScan - Gorbchain Explorer',
    description: 'The most comprehensive blockchain explorer for Gorbchain. Track transactions, explore blocks, and monitor network activity in real-time.',
    url: 'https://gorbscan.com/',
    siteName: 'GorbScan',
    images: [
      {
        url: './assets/gorbexplorer.jpg',
        width: 800,
        height: 525,
        alt: 'GorbScan Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GorbScan - Gorbchain Explorer',
    description: 'The most comprehensive blockchain explorer for Gorbchain. Track transactions, explore blocks, and monitor network activity in real-time.',
    images: ['./assets/gorbexplorer.jpg'],
  },
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