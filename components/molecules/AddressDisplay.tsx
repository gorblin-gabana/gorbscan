"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface AddressDisplayProps {
  address: string;
  showFull?: boolean;
  className?: string;
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({ 
  address, 
  showFull = false, 
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  
  const displayAddress = showFull 
    ? address 
    : `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="font-mono text-sm">{displayAddress}</span>
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-muted transition-colors duration-200"
        title="Copy address"
      >
        {copied ? (
          <Check className="w-4 h-4 text-gorb-green" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        )}
      </button>
    </div>
  );
};