import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Ban, AlertCircle } from 'lucide-react';
import { cn } from '@/config/utils';

interface StatusBadgeProps {
  status: boolean | undefined;
  labels?: string[];
  emailVerification?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  labels = [], 
  emailVerification = false,
  className 
}) => {
  // Check if user is banned (you can add a 'banned' label in the backend)
  const isBanned = labels.includes('banned');
  
  // Determine the status type
  if (isBanned) {
    return (
      <Badge 
        variant="destructive" 
        className={cn("gap-1", className)}
      >
        <Ban className="h-3 w-3" />
        Banned
      </Badge>
    );
  }
  
  if (status === false) {
    return (
      <Badge 
        variant="secondary" 
        className={cn("gap-1", className)}
      >
        <XCircle className="h-3 w-3" />
        Disabled
      </Badge>
    );
  }
  
  if (!emailVerification) {
    return (
      <Badge 
        variant="outline" 
        className={cn("gap-1 border-yellow-500 text-yellow-700 dark:text-yellow-400", className)}
      >
        <AlertCircle className="h-3 w-3" />
        Unverified
      </Badge>
    );
  }
  
  return (
    <Badge 
      variant="default" 
      className={cn("gap-1 bg-green-500 hover:bg-green-600", className)}
    >
      <CheckCircle className="h-3 w-3" />
      Active
    </Badge>
  );
};

// Add display name for debugging
StatusBadge.displayName = 'StatusBadge';