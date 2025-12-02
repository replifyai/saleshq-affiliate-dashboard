'use client';
/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumBannerProps {
  className?: string;
}

const PremiumBanner: React.FC<PremiumBannerProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 shadow-md',
        'bg-gradient-to-br from-[#FFD100] via-[#ffda34] to-[#FFFAE6]',
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-2 text-[#231F20]">
          <h3 className="text-2xl font-bold">Meet Premium</h3>
          <p className="text-sm opacity-80">Increase your company&apos;s<br />annual revenue</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            className="w-12 h-12 rounded-full bg-[#231F20]/10 backdrop-blur-sm flex items-center justify-center hover:bg-[#231F20]/20 transition-colors"
            aria-label="Play video"
          >
            <svg className="w-6 h-6 text-[#231F20] ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          
          <div className="hidden md:block w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-300 to-amber-500">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
              alt="Premium"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
    </div>
  );
};

export default PremiumBanner;
