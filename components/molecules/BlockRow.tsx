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

export const BlockRow: React.FC<BlockRowProps> = ({
  blockNumber,
  timestamp,
  transactionCount,
  validator,
  reward,
  gasUsed,
}) => {
  return (
    <a
      href={`/block/${blockNumber}`}
      className="data-row group focus-visible"
      aria-label={`View details for block ${blockNumber}`}
    >
      <div className="data-row-content">
        {/* Left Section - Block Info */}
        <div className="data-row-header">
          <div className="section-icon bg-primary/10 group-hover:bg-primary/20">
            <Box className="icon-lg text-primary" />
          </div>
          <div>
            <h3 className="heading-sm text-foreground mb-2">
              Block #{blockNumber.toLocaleString()}
            </h3>
            <div className="flex items-center gap-6 body-sm">
              <div className="flex items-center gap-2">
                <Clock className="icon-sm text-primary" />
                <span>{timestamp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="icon-sm text-secondary" />
                <span>{transactionCount} txns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Block Details */}
        <div className="data-row-meta lg:col-span-2">
          <div className="space-y-1">
            <p className="caption">Reward</p>
            <p className="text-base font-semibold text-primary">
              {reward} GORB
            </p>
          </div>
          <div className="space-y-1">
            <p className="caption">Gas Used</p>
            <p className="text-base font-semibold text-foreground">
              {gasUsed}
            </p>
          </div>
          <div className="space-y-1">
            <p className="caption">Validator</p>
            <div className="flex items-center gap-2">
              <User className="icon-sm text-secondary" />
              <span className="text-base font-mono text-secondary">
                {validator.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};