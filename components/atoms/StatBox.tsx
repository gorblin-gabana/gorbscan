import React, { useState } from 'react';
import { LucideIcon, Info } from 'lucide-react';

interface StatBoxProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  tooltip?: string;
  href?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  tooltip, 
  href 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const content = (
    <div
      className="metric-card focus-visible"
      tabIndex={href ? undefined : 0}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {/* Tooltip */}
      {tooltip && (
        <div className="relative">
          <button
            type="button"
            className="absolute top-0 right-0 p-1 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-10 focus-visible"
            aria-label={`Info: ${tooltip}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip((prev) => !prev);
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="icon-sm" />
          </button>
          
          {showTooltip && (
            <div className="absolute top-8 right-0 z-50 px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm shadow-xl whitespace-nowrap max-w-xs animate-fade-in">
              {tooltip}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-card border-l border-t border-border transform rotate-45"></div>
            </div>
          )}
        </div>
      )}
      
      {/* Header */}
      <div className="metric-header">
        <div className="metric-icon bg-primary/10 group-hover:bg-primary/20">
          <Icon className="icon-lg text-primary" />
        </div>
        <div>
          <div className="metric-label mb-1">
            {label}
          </div>
        </div>
      </div>
      
      {/* Value */}
      <div className="flex-1">
        <div className="metric-value">
          {(() => {
            if (typeof value === 'string' && value.includes(' ')) {
              const parts = value.split(' ');
              const mainValue = parts[0];
              const suffix = parts.slice(1).join(' ');
              
              return (
                <>
                  <span>{mainValue}</span>
                  {suffix && (
                    <span className="text-base text-muted-foreground font-normal ml-2">
                      {suffix}
                    </span>
                  )}
                </>
              );
            }
            return value;
          })()}
        </div>
      </div>
      
      {/* Trend */}
      {trend && (
        <div className="mt-auto">
          <div className={`metric-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            <span 
              className={`inline-block w-2 h-2 border-r-2 border-b-2 ${
                trend.isPositive 
                  ? 'border-success rotate-45' 
                  : 'border-error -rotate-45'
              }`} 
            />
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        </div>
      )}
    </div>
  );
  
  if (href) {
    return (
      <a 
        href={href} 
        className="block focus-visible rounded-xl"
        aria-label={`View ${label} details`}
      >
        {content}
      </a>
    );
  }
  
  return content;
};