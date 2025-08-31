import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { StatusBadge } from './StatusBadge';

export const StatusLegend: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Info className="h-4 w-4" />
          Status Guide
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">User Status Indicators</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <StatusBadge status={true} emailVerification={true} />
              <span className="text-muted-foreground">User is active and verified</span>
            </div>
            
            <div className="flex items-center justify-between">
              <StatusBadge status={true} emailVerification={false} />
              <span className="text-muted-foreground">Email not verified</span>
            </div>
            
            <div className="flex items-center justify-between">
              <StatusBadge status={false} />
              <span className="text-muted-foreground">Account disabled</span>
            </div>
            
            <div className="flex items-center justify-between">
              <StatusBadge status={false} labels={['banned']} />
              <span className="text-muted-foreground">User is banned</span>
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-2 text-sm">
            <h5 className="font-medium">Row Highlights</h5>
            <div className="space-y-1 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-500"></div>
                <span>Banned user</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-50 dark:bg-gray-900/20 opacity-75"></div>
                <span>Disabled account</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-50/50 dark:bg-yellow-950/10"></div>
                <span>Unverified email</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

StatusLegend.displayName = 'StatusLegend';