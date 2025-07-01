"use client";

import React from "react";
import { SearchBar } from "@/components/molecules/SearchBar";

export const SearchHeader: React.FC = () => (
  <div className="w-full bg-transparent">
    <div className="container mx-auto px-4 py-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <SearchBar />
      </div>
    </div>
  </div>
);
