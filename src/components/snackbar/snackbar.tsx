'use client';

import React, { useEffect, useState } from 'react';
import { useSnackbar, SnackbarMessage } from './snackbar-context';
import { cn } from '@/lib/utils';

interface SnackbarProps {
  className?: string;
}

interface SnackbarItemProps {
  message: SnackbarMessage;
  onClose: (id: string) => void;
}

function SnackbarItem({ message, onClose }: SnackbarItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(message.id), 300); // Match animation duration
  };

  const handleActionClick = () => {
    message.action?.onClick();
    handleClose();
  };

  const getSeverityStyles = (severity: SnackbarMessage['severity']) => {
    switch (severity) {
      case 'success':
        return {
          bg: 'bg-success',
          text: 'text-success-foreground',
          border: 'border-success',
          icon: '✓'
        };
      case 'error':
        return {
          bg: 'bg-destructive',
          text: 'text-destructive-foreground',
          border: 'border-destructive',
          icon: '✕'
        };
      case 'warning':
        return {
          bg: 'bg-warning',
          text: 'text-warning-foreground',
          border: 'border-warning',
          icon: '⚠'
        };
      case 'info':
      default:
        return {
          bg: 'bg-primary',
          text: 'text-primary-foreground',
          border: 'border-primary',
          icon: 'ℹ'
        };
    }
  };

  const styles = getSeverityStyles(message.severity);

  return (
    <div
      className={cn(
        'snackbar-item',
        'flex items-center gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm',
        'min-w-[320px] max-w-[500px]',
        'transform transition-all duration-300 ease-out',
        styles.bg,
        styles.text,
        styles.border,
        isVisible && !isExiting ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95',
        isExiting && 'translate-x-full opacity-0 scale-95'
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg font-bold">
        {styles.icon}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-relaxed break-words">
          {message.message}
        </p>
      </div>

      {/* Action Button */}
      {message.action && (
        <button
          onClick={handleActionClick}
          className={cn(
            'flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-md',
            'hover:opacity-80 transition-opacity duration-200',
            'bg-white/20 hover:bg-white/30'
          )}
        >
          {message.action.label}
        </button>
      )}

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={cn(
          'flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full',
          'hover:bg-white/20 transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-white/50'
        )}
        aria-label="Close notification"
      >
        <span className="text-sm">×</span>
      </button>
    </div>
  );
}

export function Snackbar({ className }: SnackbarProps) {
  const { messages, removeMessage } = useSnackbar();

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'snackbar-container',
        'fixed top-4 right-4 z-50',
        'flex flex-col gap-2',
        'pointer-events-none',
        className
      )}
    >
      {messages.map((message) => (
        <div key={message.id} className="pointer-events-auto">
          <SnackbarItem
            message={message}
            onClose={removeMessage}
          />
        </div>
      ))}
    </div>
  );
}