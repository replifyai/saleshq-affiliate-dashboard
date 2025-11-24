'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import {
  AffiliateStatsSection,
  ShareLinkSection,
  ProfileCompletionSection,
} from '@/components/dashboard';
import { useSnackbar } from '@/components/snackbar';
import apiClient from '@/services/apiClient';
import { CreatorDashboardSummary } from '@/types/api';

const isCreatorDashboardSummary = (payload: unknown): payload is CreatorDashboardSummary => {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return ['totalOrders', 'totalCoupons', 'totalEarningsTillDate', 'averageOrderValue', 'averageEarningPerOrder'].some(
    (key) => key in payload
  );
};

export default function DashboardPage() {
  const { state } = useProfile();
  const { showError } = useSnackbar();
  const showErrorRef = useRef(showError);
  const [dashboardSummary, setDashboardSummary] = useState<CreatorDashboardSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const showProfileCompletion = !!state.completionScore && state.completionScore.leftCount > 0;

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardSummary = async () => {
      setIsSummaryLoading(true);
      setSummaryError(null);

      try {
        const response = await apiClient.getCreatorDashboardSummary();
        const fallback = isCreatorDashboardSummary(response) ? response : null;
        const normalized =
          response.summary ??
          response.dashboardSummary ??
          response.data ??
          response.result ??
          fallback;

        if (isMounted) {
          setDashboardSummary(normalized || null);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load dashboard summary';
        if (isMounted) {
          setSummaryError(message);
        }
        showErrorRef.current?.(message);
      } finally {
        if (isMounted) {
          setIsSummaryLoading(false);
        }
      }
    };

    fetchDashboardSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const parseNumericValue = (value?: number | string | null): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/,/g, '').trim();
      const parsed = parseFloat(cleaned);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  };

  const formatNumberStat = (value?: number | string): string => {
    const parsed = parseNumericValue(value);
    if (parsed === undefined) {
      return isSummaryLoading ? 'Loading...' : '--';
    }
    return new Intl.NumberFormat('en-IN').format(parsed);
  };

  const formatCurrencyStat = (value?: number | string): string => {
    const parsed = parseNumericValue(value);
    if (parsed === undefined) {
      return isSummaryLoading ? 'Loading...' : '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(parsed);
  };

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
    <div className="bg-gradient-to-br from-background via-background to-secondary/5 rounded-none md:rounded-3xl min-h-[100dvh]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-12 space-y-8 sm:space-y-12">
        {/* Profile Completion Section (hidden when all steps completed) */}
        {showProfileCompletion && <ProfileCompletionSection />}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <ShareLinkSection />
        </div>


        {/* Affiliate Stats Section */}
        <AffiliateStatsSection
          totalOrders={formatNumberStat(dashboardSummary?.totalOrders)}
          totalCoupons={formatNumberStat(dashboardSummary?.totalCoupons)}
          totalEarningsTillDate={formatCurrencyStat(
            dashboardSummary?.totalEarningsTillDate ?? dashboardSummary?.totalEarnings
          )}
          earningsStatusMap={dashboardSummary?.earningsStatusMap}
          ordersStatusMap={dashboardSummary?.ordersStatusMap}
        />
        {summaryError && (
          <p className="text-sm text-destructive">
            Unable to load the latest dashboard summary. Showing placeholders for now.
          </p>
        )}

        {/* Analytics Overview */}
        {/* <AnalyticsOverviewSection /> */}

        {/* Featured Products */}
        {/* <FeaturedProductsSection /> */}
      </div>
    </div>
  );
}