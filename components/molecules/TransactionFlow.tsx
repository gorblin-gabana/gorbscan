import React from 'react';
import { ArrowRight, DollarSign, Send } from 'lucide-react';
import { AddressDisplay } from './AddressDisplay';

interface TransactionFlowProps {
  from: string;
  to: string;
  amount: string;
  token: string;
  usdValue?: string;
  mode: 'simple' | 'advanced';
}

export const TransactionFlow: React.FC<TransactionFlowProps> = ({
  from,
  to,
  amount,
  token,
  usdValue,
  mode
}) => {
  if (mode === 'simple') {
    return (
      <div className="card-base p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Send className="icon-md text-primary" />
            <h3 className="heading-md">Transaction Summary</h3>
          </div>
          <p className="body-lg text-primary font-semibold">
            You sent {amount} {token}
            {usdValue && <span className="text-muted-foreground ml-2">({usdValue})</span>}
          </p>
        </div>

        <div className="flex items-center justify-center gap-6">
          {/* Sender */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-3 mx-auto">
              <span className="text-2xl">👤</span>
            </div>
            <p className="caption mb-2">From (You)</p>
            <AddressDisplay address={from} />
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <ArrowRight className="icon-lg text-primary" />
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
              <DollarSign className="icon-xs text-primary" />
              <span className="caption font-medium text-primary">{amount} {token}</span>
            </div>
          </div>

          {/* Receiver */}
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mb-3 mx-auto">
              <span className="text-2xl">👤</span>
            </div>
            <p className="caption mb-2">To</p>
            <AddressDisplay address={to} />
          </div>
        </div>
      </div>
    );
  }

  // Advanced mode - more technical layout
  return (
    <div className="card-base p-4 bg-card/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">1</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Interact with instruction</span>
            <span className="status-info ml-2">Transfer</span>
            <span className="text-sm text-muted-foreground ml-2">on</span>
            <span className="text-sm text-primary ml-1">System Program</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Transfer from</span>
          <AddressDisplay address={from} />
        </div>
        <ArrowRight className="icon-sm text-muted-foreground" />
        <AddressDisplay address={to} />
        <span className="text-muted-foreground">for</span>
        <span className="font-medium text-foreground">{amount}</span>
        <span className="text-primary">{token}</span>
      </div>
    </div>
  );
}; 