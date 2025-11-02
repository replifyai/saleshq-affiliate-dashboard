'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarMessage {
  id: string;
  message: string;
  severity: SnackbarSeverity;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface SnackbarContextType {
  messages: SnackbarMessage[];
  addMessage: (message: Omit<SnackbarMessage, 'id'>) => void;
  removeMessage: (id: string) => void;
  clearAll: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

interface SnackbarProviderProps {
  children: ReactNode;
  maxMessages?: number;
}

export function SnackbarProvider({ 
  children, 
  maxMessages = 5 
}: SnackbarProviderProps) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const addMessage = useCallback((message: Omit<SnackbarMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newMessage: SnackbarMessage = {
      ...message,
      id,
      duration: message.duration ?? 5000, // Default 5 seconds
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      // Keep only the most recent messages
      return updated.slice(-maxMessages);
    });

    // Auto-remove message after duration
    if (newMessage.duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, newMessage.duration);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxMessages]);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(message => message.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setMessages([]);
  }, []);

  const value: SnackbarContextType = {
    messages,
    addMessage,
    removeMessage,
    clearAll,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  );
}