import React from 'react';
import { Box, Clock, Zap } from 'lucide-react';

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
      className="block bg-gradient-to-br from-blue-900/60 to-blue-700/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between mb-2 hover:scale-[1.02] hover:shadow-2xl transition-transform duration-200 border border-white/10"
    >
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="p-3 rounded-full bg-cyan-900/40">
          <Box className="w-7 h-7 text-cyan-300" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-orbitron mb-1">
            Block #{blockNumber.toLocaleString()}
          </h3>
          <div className="flex items-center gap-4 text-sm text-cyan-200">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{transactionCount} txns</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-left md:text-right">
        <p className="text-base font-semibold text-cyan-100 mb-1">
          Reward: <span className="text-white">{reward} GORB</span>
        </p>
        <p className="text-xs text-cyan-200">Gas Used: {gasUsed}</p>
        <p className="text-xs text-cyan-400 mt-1">
          Validator: {validator.slice(0, 8)}...
        </p>
      </div>
    </a>
  );
};