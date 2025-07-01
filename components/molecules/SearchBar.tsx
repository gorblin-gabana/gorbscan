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
        <div className="absolute left-4 z-10">
          <SearchGorbIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search address or transaction..."
          className="w-full pl-12 pr-32 py-2 text-base bg-white/10 backdrop-blur border border-white/20 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-white"
        />
        <Button
          type="submit"
          variant="primary"
          className="absolute right-2 px-5 py-2 text-base rounded-md shadow bg-gradient-to-r from-cyan-400 to-green-400 hover:from-green-400 hover:to-cyan-400 text-white font-bold border-none"
        >
          Search
        </Button>
      </div>
    </form>
  );
};