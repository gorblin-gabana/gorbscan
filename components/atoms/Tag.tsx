import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  status: 'success' | 'error' | 'pending' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ status, children, className }) => {
  const statusClasses = {
    success: 'bg-gorb-green/20 text-gorb-green border-gorb-green/40',
    error: 'bg-danger-red/20 text-danger-red border-danger-red/40',
    pending: 'bg-glow-cyan/20 text-glow-cyan border-glow-cyan/40',
    info: 'bg-gorb-green-bright/20 text-gorb-green-bright border-gorb-green-bright/40',
  };
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      statusClasses[status],
      className
    )}>
      {children}
    </span>
  );
};