import './globals.css';
import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import { SearchHeader } from '@/components/organisms/SearchHeader';

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
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-inter antialiased`}>
        {/* Main Navbar */}
        {/* The Navbar component should be rendered here if not already */}
        <SearchHeader />
        <div>{children}</div>
      </body>
    </html>
  );
}