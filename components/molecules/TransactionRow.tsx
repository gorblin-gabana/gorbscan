import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { AddressDisplay } from './AddressDisplay';
import { Tag } from '@/components/atoms/Tag';

interface TransactionRowProps {
  hash: string;
  from: string;
  to: string;
  value: string;
  status: 'success' | 'error' | 'pending';
  timestamp: string;
  gasUsed: string;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  hash,
  from,
  to,
  value,
  status,
  timestamp,
  gasUsed,
}) => {
  return (
    <div className="gorb-card p-4 hover:gorb-glow transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Tx: {hash.slice(0, 10)}...{hash.slice(-8)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{timestamp}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">From:</span>
              <AddressDisplay address={from} />
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">To:</span>
              <AddressDisplay address={to} />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 ml-4">
          <Tag status={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{value} GORB</p>
            <p className="text-xs text-muted-foreground">Gas: {gasUsed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};