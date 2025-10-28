'use client';

import React from 'react';
import {
  AffiliateStatsSection,
  AnalyticsOverviewSection,
  FeaturedProductsSection,
  ShareLinkSection,
  ProfileCompletionSection,
} from '@/components/dashboard';

interface DashboardPageProps {
  onMenuClick?: () => void;
}

export default function DashboardPage({ onMenuClick }: DashboardPageProps) {
  return (
    <div className="bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl h-[100dvh] overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
        {/* Mobile Menu Button - Only visible on mobile */}
        {onMenuClick && (
          <div className="lg:hidden">
            <button
              onClick={onMenuClick}
              className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-secondary/20 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
        {/* Profile Completion Section */}
        <ProfileCompletionSection />
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <ShareLinkSection />
        </div>
        

        {/* Affiliate Stats Section */}
        <AffiliateStatsSection
          totalEarnings="₹1,24,300"
          monthlyEarnings="₹18,900"
          conversionRate="4.8%"
          totalClicks="12,340"
          totalSales="238"
          nextPayout="₹0"
        />

        {/* Analytics Overview */}
        <AnalyticsOverviewSection />

        {/* Featured Products */}
        <FeaturedProductsSection />
      </div>
    </div>
  );
}