import React from 'react';

interface TokenHoldingProps {
  symbol: string;
  balance: string;
  value: string;
  icon?: string;
}

export const TokenHolding: React.FC<TokenHoldingProps> = ({ 
  symbol, 
  balance, 
  value, 
  icon 
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg hover:bg-card/70 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          {icon ? (
            <img src={icon} alt={symbol} className="w-6 h-6 rounded-full" />
          ) : (
            <span className="text-sm font-bold text-primary">{symbol[0]}</span>
          )}
        </div>
        <div>
          <p className="font-medium text-foreground">{symbol}</p>
          <p className="text-sm text-muted-foreground">{balance}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
};