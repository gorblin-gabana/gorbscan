import React from 'react';
import { Search } from 'lucide-react';

export const SearchGorbIcon = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
    <div className={`${className} relative group`}>
      <Search className="w-full h-full text-glow-cyan group-hover:text-gorb-green transition-colors duration-200" />
      <div className="absolute inset-0 rounded-full bg-glow-cyan/20 group-hover:bg-gorb-green/20 transition-colors duration-200 blur-sm"></div>
    </div>
  );
};