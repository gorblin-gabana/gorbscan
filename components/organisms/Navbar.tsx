"use client";

import React from 'react';
import { Button } from '@/components/atoms/Button';
import { Globe, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md m-0 p-0">
      <div className="container mx-auto px-4 m-0 p-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <img src="/assets/logo.png" alt="GorbScan Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold font-orbitron text-white">
                GorbScan
              </h1>
              <p className="text-xs text-cyan-200">
                Gorbchain Explorer
              </p>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Network Selector */}
            <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 px-4 py-1 rounded-full border border-gray-600 bg-black/40 text-white font-semibold shadow-md mr-2">
              <Globe className="w-4 h-4" />
              <span>Mainnet</span>
            </Button>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/blocks" className={`text-sm px-3 py-1 rounded transition-colors duration-150 ${pathname === '/blocks' ? 'bg-blue-600 text-white font-bold shadow' : 'text-muted-foreground hover:text-foreground hover:bg-white/10'}`}>
                Blocks
              </Link>
              <Link href="/validators" className={`text-sm px-3 py-1 rounded transition-colors duration-150 ${pathname === '/validators' ? 'bg-blue-600 text-white font-bold shadow' : 'text-muted-foreground hover:text-foreground hover:bg-white/10'}`}>
                Validators
              </Link>
              <Link href="/charts" className={`text-sm px-3 py-1 rounded transition-colors duration-150 ${pathname === '/charts' ? 'bg-blue-600 text-white font-bold shadow' : 'text-muted-foreground hover:text-foreground hover:bg-white/10'}`}>
                Charts
              </Link>
            </div>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};