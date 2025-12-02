'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/contexts/ProfileContext';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick, className }) => {
  const { state } = useProfile();
  const creatorName = state.profile?.name || 'User';

  return (
    <header className={cn('flex items-center justify-between mb-8', className)}>
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-secondary/20 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {creatorName}!</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          className="p-3 rounded-lg bg-gradient-to-br from-[#FFFAE6]/50 to-white border border-[#FFD100]/40 hover:bg-[#FFFAE6] transition-colors relative"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        
        <button
          className="p-3 rounded-lg bg-gradient-to-br from-[#FFFAE6]/50 to-white border border-[#FFD100]/40 hover:bg-[#FFFAE6] transition-colors"
          aria-label="Settings"
        >
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
