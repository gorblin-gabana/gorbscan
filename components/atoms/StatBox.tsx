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
    'Network TPS': 'from-cyan-900/60 to-cyan-700/40',
    'Active Validators': 'from-green-900/60 to-green-700/40',
    'Total Blocks': 'from-blue-900/60 to-blue-700/40',
    'Market Cap': 'from-purple-900/60 to-purple-700/40',
  };
  const bg = cardColors[label as keyof typeof cardColors] || 'from-gray-800/60 to-gray-700/40';
  const iconPulse = label === 'Network TPS' || label === 'Market Cap' ? 'group-hover:animate-pulse' : '';
  const content = (
    <div
      className={`relative bg-white/10 backdrop-blur-md bg-gradient-to-br ${bg} rounded-2xl p-8 shadow-[0_4px_20px_rgba(36,217,115,0.15)] flex flex-col items-start cursor-pointer hover:scale-[1.015] transition-transform duration-200 group`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      tabIndex={0}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      title={tooltip}
    >
      {/* Real-time indicator */}
      {label === 'Network TPS' && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-xs text-green-400 animate-pulse">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1" />
          Live
        </span>
      )}
      {/* Market Cap animated arrow */}
      {label === 'Market Cap' && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-xs text-green-300 animate-bounce">
          <span className="inline-block w-3 h-3 border-r-2 border-b-2 border-green-300 rotate-45 mt-1" />
        </span>
      )}
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full bg-white/10 mr-3 transition-transform duration-200 ${iconPulse}`}>
          <Icon className="w-7 h-7 text-cyan-300" />
        </div>
        <span className="text-gray-200 text-base font-medium flex items-center gap-1">
          {label}
          {tooltip && (
            <span
              className="ml-1 text-cyan-300 cursor-help relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              tabIndex={0}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 border border-cyan-300 text-xs font-bold shadow-inner">?</span>
              {showTooltip && (
                <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-white/30 backdrop-blur-md text-sm text-white shadow-lg border border-cyan-200/40 whitespace-nowrap animate-fade-in pointer-events-none">
                  {tooltip}
                </span>
              )}
            </span>
          )}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl md:text-4xl font-bold text-white font-orbitron">{value}</span>
        {trend && (
          <span className={`text-base font-semibold ${trend.isPositive ? 'text-green-400 bg-green-100/10' : 'text-red-400 bg-red-100/10'} px-2 py-1 rounded`}> 
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
    </div>
  );
  return href ? <a href={href} tabIndex={0}>{content}</a> : content;
};