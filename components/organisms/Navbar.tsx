"use client";

import React, { useState } from 'react';
import { SearchGorbIcon } from '@/components/icons/SearchGorbIcon';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim();

    // Smart routing based on query format
    if (!query.startsWith('0x')) {
      if (query.length === 66) {
        // Transaction hash (64 hex chars + 0x)
        router.push(`/tx/${query}`);
      } else if (query.length == 44) {
        // Address (40 hex chars + 0x)
        router.push(`/address/${query}`);
      } else {
        // Generic hex string, could be partial - search transactions
        router.push(`/transactions?search=${encodeURIComponent(query)}`);
      }
    } else if (/^\d+$/.test(query)) {
      // Numeric string - likely block number
      router.push(`/block/${query}`);
    } else {
      // Generic search - search all transactions
      router.push(`/transactions?search=${encodeURIComponent(query)}`);
    }

    // Clear search and close mobile menu
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/blocks', label: 'Blocks' },
    { href: '/transactions', label: 'Transactions' },
    { href: '/charts', label: 'Charts' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section - Increased size */}
          <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity focus-visible flex-shrink-0">
            <img src="/assets/logo.png" alt="GorbScan Logo" className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold font-orbitron text-foreground">
                GorbScan
              </h1>
              <p className="text-sm text-primary">
                Blockchain Explorer
              </p>
            </div>
            <span className="ml-2 status-success text-sm">
              Mainnet
            </span>
          </Link>

          {/* Search Bar - Desktop - Expanded to fill remaining space */}
          <div className="hidden lg:flex flex-1 max-w-none mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center">
                <div className="absolute left-4 z-10">
                  <SearchGorbIcon className="w-6 h-6 text-primary" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search address, tx hash, or block..."
                  className="w-full pl-14 pr-28 py-3 text-base bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-muted-foreground text-foreground"
                />
                <button
                  type="submit"
                  className="btn-primary absolute right-2 px-6 py-2"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm focus-visible ${pathname === link.href
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="btn-ghost btn-sm lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center">
                <div className="absolute left-3 z-10">
                  <SearchGorbIcon className="w-5 h-5 text-primary" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search address, tx hash, or block..."
                  className="w-full pl-10 pr-20 py-3 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 placeholder-muted-foreground text-foreground"
                />
                <button
                  type="submit"
                  className="btn-primary btn-sm absolute right-1"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 font-medium focus-visible ${pathname === link.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};