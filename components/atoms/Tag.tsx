import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  status: 'success' | 'error' | 'pending' | 'info' | 'active' | 'inactive' | 'maintenance';
  children: React.ReactNode;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ status, children, className }) => {
  const statusClasses = {
    success: 'status-success',
    error: 'status-error', 
    pending: 'status-pending',
    info: 'status-info',
    active: 'status-success',
    inactive: 'status-error',
    maintenance: 'status-pending',
  };
  
  return (
    <span className={cn(
      statusClasses[status],
      className
    )}>
      {children}
    </span>
  );
};