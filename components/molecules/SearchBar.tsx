"use client";

import React, { useState } from 'react';
import { SearchGorbIcon } from '@/components/icons/SearchGorbIcon';
import { Button } from '@/components/atoms/Button';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
    console.log('Searching for:', query);
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-6 z-10">
          <SearchGorbIcon className="w-7 h-7 text-cyan-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Address, Transaction, Block, or Token..."
          className="w-full pl-16 pr-36 py-3 text-lg bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 placeholder-gray-300 text-white"
        />
        <Button
          type="submit"
          variant="primary"
          className="absolute right-3 px-6 py-2 text-base rounded-full shadow bg-gradient-to-r from-cyan-400 to-green-400 hover:from-green-400 hover:to-cyan-400 text-white font-bold border-none"
        >
          Search
        </Button>
      </div>
    </form>
  );
};