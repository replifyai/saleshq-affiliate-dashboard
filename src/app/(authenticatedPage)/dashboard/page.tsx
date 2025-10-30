'use client';

import React from 'react';
import { useProfile } from '@/contexts/ProfileContext';
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
  const { state } = useProfile();

  // Show loading state while profile is being fetched or not yet available
  if (!state.profile) {
    // Show error state if profile failed to load
    if (state.error) {
      return (
        <div className="bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl h-[100dvh] flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-destructive mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Failed to Load Dashboard</h2>
            <p className="text-muted-foreground mb-4">{state.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // Show loading state
    return (
      <div className="bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl h-[100dvh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

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