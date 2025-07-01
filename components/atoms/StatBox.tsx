import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

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

export const StatBox: React.FC<StatBoxProps> = ({ label, value, icon: Icon, trend, tooltip, href }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const cardColors = {
    'Network TPS': 'from-cyan-900/80 to-cyan-700/60',
    'Active Validators': 'from-green-900/80 to-green-700/60',
    'Total Blocks': 'from-blue-900/80 to-blue-700/60',
    'Market Cap': 'from-purple-900/80 to-purple-700/60',
  };
  const bg = cardColors[label as keyof typeof cardColors] || 'from-slate-800/80 to-slate-700/60';
  const iconPulse = label === 'Network TPS' || label === 'Market Cap' ? 'group-hover:animate-pulse' : '';
  const content = (
    <div
      className={`relative bg-white/10 backdrop-blur-md bg-gradient-to-br ${bg} rounded-xl p-5 shadow-lg flex flex-col justify-between min-h-[160px] h-full transition-transform duration-200 group border border-white/10 hover:scale-105 hover:shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400`}
      tabIndex={0}
      aria-label={tooltip || label}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {/* Tooltip icon top-right */}
      {tooltip && (
        <button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 border border-cyan-300 text-base font-bold shadow-inner text-cyan-300 hover:bg-cyan-300/30 focus:bg-cyan-300/40 transition-all z-20"
          aria-label={`Info: ${tooltip}`}
          tabIndex={0}
          onClick={e => { e.stopPropagation(); setShowTooltip(v => !v); }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          ?
          {showTooltip && (
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-white/90 text-gray-900 text-sm shadow-lg border border-cyan-200/40 whitespace-pre-line animate-fade-in pointer-events-auto min-w-[180px] max-w-xs">
              {tooltip}
            </span>
          )}
        </button>
      )}
      {/* Card header: icon + label */}
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-full bg-white/10 transition-transform duration-200 ${iconPulse}`}> 
          <Icon className="w-7 h-7 text-cyan-300" />
        </div>
        <span className="text-slate-100 text-base font-medium flex-1 truncate" style={{lineHeight:1.2}}>{label}</span>
      </div>
      {/* Value + trend, baseline aligned */}
      <div className="flex items-end justify-between flex-wrap gap-2 mt-auto min-w-0">
        <span className="font-orbitron font-bold text-white flex items-baseline min-w-0" style={{fontSize:'clamp(1.5rem,4vw,2.5rem)',lineHeight:1.1,wordBreak:'break-word'}}>
          {(() => {
            if (typeof value === 'string' && value.includes(' ')) {
              const [main, ...rest] = value.split(' ');
              return <>
                <span className="truncate min-w-0">{main}</span>
                {rest.length > 0 && <span className="ml-2 text-xs text-slate-300 font-normal truncate min-w-0">{rest.join(' ')}</span>}
              </>;
            }
            return value;
          })()}
        </span>
        {trend && (
          <span className={`text-sm font-semibold flex items-center gap-1 px-2 py-1 rounded ${trend.isPositive ? 'text-green-300 bg-green-900/40' : 'text-red-300 bg-red-900/40'}`}> 
            {trend.isPositive ? <span aria-label="Up" className="inline-block w-3 h-3 border-r-2 border-b-2 border-green-300 rotate-45" /> : <span aria-label="Down" className="inline-block w-3 h-3 border-r-2 border-b-2 border-red-300 -rotate-45" />}
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
  return href ? <a href={href} tabIndex={0}>{content}</a> : content;
};