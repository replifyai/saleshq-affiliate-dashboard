'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import {
  DashboardHeader,
  StatsCards,
  ShareAndEarn,
  FeaturedCollections,
  FeaturedProducts,
} from '@/components/dashboard';
import { useSnackbar } from '@/components/snackbar';
import apiClient from '@/services/apiClient';
import { CreatorDashboardSummary } from '@/types/api';

export default function DashboardPage() {
  const { state } = useProfile();
  const { showError } = useSnackbar();
  const showErrorRef = useRef(showError);
  const [dashboardSummary, setDashboardSummary] = useState<CreatorDashboardSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardSummary = async () => {
      setIsSummaryLoading(true);

      try {
        const response = await apiClient.getCreatorDashboardSummary();
        if (isMounted) {
          setDashboardSummary(response.summary);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load dashboard summary';
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

  const formatCurrency = (value?: number | string | null): string => {
    if (value === undefined || value === null) {
      return isSummaryLoading ? '...' : '₹0';
    }
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    if (isNaN(numValue)) return '₹0';
    return `₹${numValue.toLocaleString('en-IN')}`;
  };

  const formatNumber = (value?: number | string | null): string => {
    if (value === undefined || value === null) {
      return isSummaryLoading ? '...' : '0';
    }
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    if (isNaN(numValue)) return '0';
    return numValue.toLocaleString('en-IN');
  };

  // Calculate Order Return Ratio
  const calculateReturnRatio = (): string => {
    if (!dashboardSummary || isSummaryLoading) {
      return isSummaryLoading ? '...' : '0%';
    }
    const totalOrders = dashboardSummary.totalOrders || 0;
    const refundedOrders = dashboardSummary.totalRefundedOrders || 0;
    if (totalOrders === 0) return '0%';
    return ((refundedOrders / totalOrders) * 100).toFixed(1) + '%';
  };

  // Get paid orders count from ordersStatusMap
  const getPaidOrdersCount = (): string => {
    if (!dashboardSummary || isSummaryLoading) {
      return isSummaryLoading ? '...' : '0';
    }
    return formatNumber(dashboardSummary.ordersStatusMap?.paid?.count);
  };

  // Show loading state while profile is being fetched
  if (!state.profile) {
    if (state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[#131313] mb-2">Failed to Load Dashboard</h2>
            <p className="text-[#BCBCBC] mb-4">{state.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#131313] text-white rounded-full font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0]">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-3 border-[#131313] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#BCBCBC]">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Cards */}
        <StatsCards
          // Earnings metrics
          totalEarnings={formatCurrency(dashboardSummary?.totalEarnings)}
          pendingEarnings={formatCurrency(dashboardSummary?.pendingEarnings)}
          paidEarnings={formatCurrency(dashboardSummary?.paidEarnings)}
          voidedEarnings={formatCurrency(dashboardSummary?.voidedEarnings)}
          // Sales metrics
          netSales={formatCurrency(dashboardSummary?.netSales)}
          totalOrders={formatNumber(dashboardSummary?.totalOrders)}
          averageOrderValue={formatCurrency(dashboardSummary?.averageOrderValue)}
          // Order health metrics
          paidOrders={getPaidOrdersCount()}
          refundedOrders={formatNumber(dashboardSummary?.totalRefundedOrders)}
          returnRatio={calculateReturnRatio()}
        />

        {/* Share and Earn */}
        <ShareAndEarn 
          activeCoupon={dashboardSummary?.activeCoupon}
          referralLink={dashboardSummary?.referralLink}
        />

        {/* Featured Collections */}
        <FeaturedCollections />

        {/* Featured Products */}
        <FeaturedProducts />
      </div>
    </div>
  );
}
