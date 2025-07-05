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
    : address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : "ContractAddress";

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`address-display inline-flex items-center gap-2 ${className}`}>
      <span className="font-mono text-sm text-foreground">{displayAddress || "Contract address"}</span>
      <button
        onClick={handleCopy}
        className="p-1 rounded hover:bg-muted transition-colors duration-200 focus-visible"
        title="Copy address"
        aria-label={`Copy address ${displayAddress}`}
      >
        {copied ? (
          <Check className="icon-sm text-success" />
        ) : (
          <Copy className="icon-sm text-muted-foreground hover:text-foreground" />
        )}
      </button>
    </div>
  );
};