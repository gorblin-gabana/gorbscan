import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface DetailRowProps {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const DetailRow: React.FC<DetailRowProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-border ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-right">
        {value}
      </div>
    </div>
  );
};