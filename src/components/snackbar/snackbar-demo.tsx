'use client';

import React from 'react';
import { useSnackbar } from './use-snackbar';
import { cn } from '@/lib/utils';

interface SnackbarDemoProps {
  className?: string;
}

export function SnackbarDemo({ className }: SnackbarDemoProps) {
  const { showSuccess, showError, showWarning, showInfo, clearAll } = useSnackbar();

  const handleSuccess = () => {
    showSuccess('Operation completed successfully!', {
      action: {
        label: 'View Details',
        onClick: () => console.log('View details clicked')
      }
    });
  };

  const handleError = () => {
    showError('Something went wrong. Please try again.', {
      duration: 7000,
      action: {
        label: 'Retry',
        onClick: () => console.log('Retry clicked')
      }
    });
  };

  const handleWarning = () => {
    showWarning('Please review your input before proceeding.', {
      duration: 6000
    });
  };

  const handleInfo = () => {
    showInfo('New features are available in the latest update.', {
      action: {
        label: 'Learn More',
        onClick: () => console.log('Learn more clicked')
      }
    });
  };

  const handleMultiple = () => {
    showInfo('First notification');
    setTimeout(() => showSuccess('Second notification'), 500);
    setTimeout(() => showWarning('Third notification'), 1000);
    setTimeout(() => showError('Fourth notification'), 1500);
  };

  return (
    <div className={cn('p-6 space-y-4', className)}>
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Snackbar Notification Demo
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleSuccess}
          className="px-4 py-2 bg-success text-success-foreground rounded-md hover:opacity-80 transition-opacity"
        >
          Success Notification
        </button>
        
        <button
          onClick={handleError}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-80 transition-opacity"
        >
          Error Notification
        </button>
        
        <button
          onClick={handleWarning}
          className="px-4 py-2 bg-warning text-warning-foreground rounded-md hover:opacity-80 transition-opacity"
        >
          Warning Notification
        </button>
        
        <button
          onClick={handleInfo}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-80 transition-opacity"
        >
          Info Notification
        </button>
      </div>
      
      <div className="pt-4 border-t border-[#FFD100]/30">
        <button
          onClick={handleMultiple}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-80 transition-opacity mr-3"
        >
          Multiple Notifications
        </button>
        
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:opacity-80 transition-opacity"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}