"use client";

import React, { useState } from "react";
import { Card } from "../ui/card";
import { Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

interface TransactionProps {
  tx: any;
}

const shorten = (str: string, start = 8, end = 6) => {
  if (!str || str.length <= start + end) return str;
  return `${str.slice(0, start)}...${str.slice(-end)}`;
};

const TransactionRow: React.FC<TransactionProps> = ({ tx }) => {
  const signature = tx.transaction?.signatures?.[0] || "-";
  const recentBlockhash = tx.transaction?.message?.recentBlockhash || "-";
  const fee = tx.meta?.fee || 0;
  const blockTime = tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : "-";
  const slot = tx.slot || "-";
  const computeUnits = tx.meta?.computeUnitsConsumed || "-";
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleClick = () => {
    router.push(`/tx/${signature}`);
  };

  return (
    <Card
      className="p-4 mb-2 flex flex-col gap-2 border-2 border-transparent hover:border-green-400 hover:shadow-green-400/40 hover:shadow-lg transition cursor-pointer group"
      onClick={handleClick}
      tabIndex={0}
      aria-label={`View transaction ${shorten(signature)}`}
    >
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Signature:</span>
          <span className="font-mono text-sm">{shorten(signature, 10, 8)}</span>
          <button
            className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
            onClick={handleCopy}
            tabIndex={-1}
            aria-label="Copy signature"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
        <div>
          <span className="text-xs text-gray-500">Recent Blockhash:</span>
          <span className="font-mono text-sm ml-1">{shorten(recentBlockhash, 10, 8)}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <span className="text-xs text-gray-500">Fee:</span>
          <span className="ml-1">{fee}</span>
        </div>
        <div>
          <span className="text-xs text-gray-500">Block Time:</span>
          <span className="ml-1">{blockTime}</span>
        </div>
        <div>
          <span className="text-xs text-gray-500">Slot:</span>
          <span className="ml-1">{slot}</span>
        </div>
        <div>
          <span className="text-xs text-gray-500">Compute Units:</span>
          <span className="ml-1">{computeUnits}</span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionRow;
