import React from 'react';
import { ArrowRight, Clock, Zap, ArrowUpRight } from 'lucide-react';
import { AddressDisplay } from './AddressDisplay';

interface TransactionRowProps {
  signature: string;
  signer: string;
  recipient: string;
  amount: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
  computeUnits: number;
  token: string;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  signature,
  signer,
  recipient,
  amount,
  status,
  timestamp,
  computeUnits,
  token,
}) => {
  // Add safety checks for undefined values
  if (!signature || !signer || !recipient) {
    return null;
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'status-success';
      case 'failed':
        return 'status-error';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-info';
    }
  };

  return (
    <a
      href={`/tx/${signature}`}
      className="data-row group focus-visible card-cyan-glow"
      aria-label={`View transaction ${signature.slice(0, 8)}...${signature.slice(-6)}`}
    >
      <div className="data-row-content">
        {/* Left Section - Transaction Info */}
        <div className="data-row-header">
          <div className="section-icon bg-secondary/10 group-hover:bg-secondary/20">
            <ArrowUpRight className="icon-lg text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground font-mono mb-2 truncate">
              {signature.slice(0, 12)}...{signature.slice(-10)}
            </h3>
            <div className="flex items-center gap-6 body-sm">
              <div className="flex items-center gap-2">
                <Clock className="icon-sm text-secondary" />
                <span>{timestamp || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="icon-sm text-primary" />
                <span>CU: {computeUnits || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Address Flow */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="caption mb-2">From</p>
            <AddressDisplay address={signer} />
          </div>
          <ArrowRight className="icon-md text-primary mt-6" />
          <div className="text-center">
            <p className="caption mb-2">To</p>
            <AddressDisplay address={recipient} />
          </div>
        </div>
        
        {/* Right Section - Transaction Details */}
        <div className="flex flex-col gap-4 lg:items-end">
          <div className={getStatusClass(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
          <div className="lg:text-right">
            <p className="text-lg font-bold text-secondary mb-1">
              {amount || '0'} {token || 'GORB'}
            </p>
            <p className="caption">
              Transaction Value
            </p>
          </div>
        </div>
      </div>
    </a>
  );
};