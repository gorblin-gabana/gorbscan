import React, { useState } from 'react';
import { Copy, Check, HelpCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TransactionDataRowProps {
  icon?: LucideIcon;
  label: string;
  simpleLabel?: string;
  value: React.ReactNode;
  simpleValue?: React.ReactNode;
  tooltip?: string;
  simpleTooltip?: string;
  mode: 'simple' | 'advanced';
  copyable?: boolean;
  copyText?: string;
  className?: string;
  hideInSimple?: boolean;
}

export const TransactionDataRow: React.FC<TransactionDataRowProps> = ({
  icon: Icon,
  label,
  simpleLabel,
  value,
  simpleValue,
  tooltip,
  simpleTooltip,
  mode,
  copyable = false,
  copyText,
  className = '',
  hideInSimple = false
}) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Hide this row in simple mode if specified
  if (mode === 'simple' && hideInSimple) {
    return null;
  }

  const displayLabel = mode === 'simple' && simpleLabel ? simpleLabel : label;
  const displayValue = mode === 'simple' && simpleValue ? simpleValue : value;
  const displayTooltip = mode === 'simple' && simpleTooltip ? simpleTooltip : tooltip;

  const handleCopy = async () => {
    if (copyText) {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex items-center justify-between py-4 border-b border-border last:border-b-0 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
            <Icon className="icon-sm text-muted-foreground" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className={`${mode === 'simple' ? 'body-md font-medium' : 'body-sm'} text-muted-foreground`}>
            {displayLabel}
          </span>
          {displayTooltip && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <HelpCircle className="icon-xs" />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-background border border-border rounded-lg shadow-lg z-10">
                  <p className="text-sm text-foreground">{displayTooltip}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-right">
          {displayValue}
        </div>
        {copyable && copyText && (
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-muted transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="icon-sm text-green-400" />
            ) : (
              <Copy className="icon-sm text-muted-foreground hover:text-foreground" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}; 