'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/services/apiClient';
import { Coupon } from '@/types/api';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import {
  CouponsHeader,
  CouponCard,
  CreateCouponModal,
  CouponsEmptyState,
} from '@/components/coupons';

export default function CouponsPage() {
  const { showError } = useSnackbar();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getCreatorCoupons();
      setCoupons(response.coupons || []);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to fetch coupons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedCoupons = useMemo(() => {
    return [...coupons].sort((a, b) => {
      // Sort by status: PENDING first, then ACTIVE, then others
      const statusOrder = { PENDING: 0, ACTIVE: 1, INACTIVE: 2, EXPIRED: 3 };
      const statusDiff = (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4);
      if (statusDiff !== 0) return statusDiff;
      // Then by creation date (newest first)
      return b.createdAt - a.createdAt;
    });
  }, [coupons]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl h-[100dvh] overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground">Loading coupons...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-background to-secondary/5 rounded-3xl h-[100dvh] overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        <CouponsHeader onCreateClick={() => setIsCreateModalOpen(true)} />

        {/* Coupons Grid */}
        {sortedCoupons.length === 0 ? (
          <CouponsEmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        )}

        {/* Create Coupon Modal */}
        <CreateCouponModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchCoupons}
        />
      </div>
    </div>
  );
}
