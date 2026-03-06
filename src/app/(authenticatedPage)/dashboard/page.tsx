'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import {
  DashboardHeader,
  StatsCards,
  ShareAndEarn,
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
  const [resolvedProducts, setResolvedProducts] = useState<any[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

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

    const fetchResolvedProducts = async () => {
      setIsProductsLoading(true);
      try {
        // Fetch collections first to get the unified list of product IDs
        const collectionsResponse = await apiClient.getAllProductCollections();
        let allResolvedShopifyProducts: any[] = [];

        if (collectionsResponse.productCollections) {
          // Fetch resolved products for all collections in parallel
          const resolvedPromises = collectionsResponse.productCollections.map(col =>
            apiClient.getResolvedProducts(col.id).catch(err => {
              console.error(`Failed resolving products for collection ${col.id}:`, err);
              return { success: false, data: [] };
            })
          );

          const resolvedResults = await Promise.all(resolvedPromises);

          // Aggregate all returned products
          resolvedResults.forEach(res => {
            if (res.success && res.data) {
              allResolvedShopifyProducts = [...allResolvedShopifyProducts, ...res.data];
            }
          });
        }

        // Deduplicate products by id
        const uniqueProductsMap = new Map();
        allResolvedShopifyProducts.forEach(p => {
          if (!uniqueProductsMap.has(p.id)) {
            uniqueProductsMap.set(p.id, p);
          }
        });

        const uniqueShopifyProducts = Array.from(uniqueProductsMap.values());

        if (uniqueShopifyProducts.length > 0) {
          const mappedProducts = uniqueShopifyProducts.map((p) => ({
            id: p.id,
            name: p.title,
            category: p.productType || 'Uncategorized',
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
            // Mock these specific display values since Shopify doesn't natively return 'rating', etc.
            rating: 4.7,
            reviewCount: '786+',
            price: parseFloat(p.minPrice || '0'),
            originalPrice: parseFloat(p.maxPrice || p.minPrice || '0') * 1.2, // mock original price 20% higher
            discount: '20% OFF',
            shareLink: `https://myfrido.com/products/${p.handle}`,
          }));

          if (isMounted) {
            // limit to top 5 products for dashboard homepage visually
            setResolvedProducts(mappedProducts.slice(0, 5));
          }
        }
      } catch (error) {
        console.error('Failed to load resolved products globally:', error);
      } finally {
        if (isMounted) setIsProductsLoading(false);
      }
    };

    fetchDashboardSummary();
    fetchResolvedProducts();

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

  // Get next payout date info
  const getNextPayoutDate = (): string => {
    if (!dashboardSummary || isSummaryLoading) {
      return isSummaryLoading ? '...' : 'N/A';
    }
    const upcomingPayment = dashboardSummary.earningsStatusMap?.upcoming_payment;
    if (upcomingPayment && upcomingPayment.count > 0) {
      return `${upcomingPayment.count} pending`;
    }
    return 'N/A';
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
          yourSales={formatCurrency(dashboardSummary?.totalSales)}
          totalOrders={formatNumber(dashboardSummary?.totalOrders)}
          commissionOnSales={formatCurrency(dashboardSummary?.totalCommission)}
          payoutsIssued={formatCurrency(dashboardSummary?.paidEarnings)}
          nextPayout={formatCurrency(dashboardSummary?.pendingEarnings)}
          nextPayoutDate={getNextPayoutDate()}
          // Sub values shown inside the first 3 cards
          refundedAmount={formatCurrency(dashboardSummary?.totalRefundedAmount)}
          returnedOrders={formatNumber(dashboardSummary?.totalRefundedOrders)}
          commissionLoss={formatCurrency(dashboardSummary?.voidedEarnings)}
        />

        {/* Share and Earn */}
        <ShareAndEarn
          activeCoupon={dashboardSummary?.activeCoupon}
          referralLink={dashboardSummary?.referralLink}
        />

        {/* Featured Products */}
        <FeaturedProducts
          products={resolvedProducts}
          isLoading={isProductsLoading}
        />
      </div>
    </div>
  );
}
