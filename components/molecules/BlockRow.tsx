import React from 'react';
import { Box, Clock, Zap, User } from 'lucide-react';

interface BlockRowProps {
  blockNumber: number;
  timestamp: string;
  transactionCount: number;
  validator: string;
  reward: string;
  gasUsed: string;
}
function timeformate(timestamp: any) {
  const now = Date.now();
  const diff = Math.floor((now - timestamp * 1000) / 1000); // in seconds

  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} day ago`;
}
export const BlockRow: React.FC<any> = ({
  blockHeight,
  blockTime,
  transactions,
  rewards,
  reward,
  gasUsed,
}) => {

  return (
    <a
      href={`/block/${blockHeight}`}
      className="data-row group focus-visible"
      aria-label={`View details for block ${blockHeight}`}
    >
      <div className="data-row-content">
        {/* Left Section - Block Info */}
        <div className="data-row-header">
          <div className="section-icon bg-primary/10 group-hover:bg-primary/20">
            <Box className="icon-lg text-primary" />
          </div>
          <div>
            <h3 className="heading-sm text-foreground mb-2">
              Block #{blockHeight.toLocaleString()}
            </h3>
            <div className="flex items-center gap-6 body-sm">
              <div className="flex items-center gap-2">
                <Clock className="icon-sm text-primary" />
                <span>{timeformate(blockTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="icon-sm text-secondary" />
                <span>{transactions[0].transaction.message.accountKeys.length} txns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Block Details */}
        <div className="data-row-meta lg:col-span-2">
          <div className="space-y-1">
            <p className="caption">Reward</p>
            <p className="text-base font-semibold text-primary">
              {Number(rewards[0].lamports) / 10 ** 9 || 0} GORB
            </p>
          </div>
          <div className="space-y-1">
            <p className="caption">Gas Used</p>
            <p className="text-base font-semibold text-foreground">
              {Number(transactions[0].meta.fee) / 10 ** 9}
            </p>
          </div>
          <div className="space-y-1">
            <p className="caption">Validator</p>
            <div className="flex items-center gap-2">
              <User className="icon-sm text-secondary" />
              <span className="text-base font-mono text-secondary">
                {`${rewards[0].pubkey.toLocaleString().slice(0, 6)}...${rewards[0].pubkey.toLocaleString().slice(12,18)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};