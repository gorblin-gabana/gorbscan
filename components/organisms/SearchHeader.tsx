"use client";

import React from "react";
import { SearchBar } from "@/components/molecules/SearchBar";

export const SearchHeader: React.FC = () => (
  <div className="search-bar-container w-full bg-white/10 backdrop-blur-lg shadow-md border-b border-white/10 animate-gradient-move">
    <div className="container mx-auto px-4 py-2 flex items-center justify-center">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>
      </div>
    </div>
  </div>
);
