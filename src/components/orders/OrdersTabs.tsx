'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Search, SlidersHorizontal, ArrowUpDown, X, ChevronDown } from 'lucide-react';

export type OrderTab = 'all' | 'payout_pending' | 'payout_done';

interface OrdersTabsProps {
  activeTab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Filter props
  paymentStatus: string;
  onPaymentStatusChange: (status: string) => void;
  orderNumberFilter: string;
  onOrderNumberFilterChange: (value: string) => void;
  // Sort props
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (by: string, direction: 'asc' | 'desc') => void;
  onClearFilters: () => void;
}

const OrdersTabs: React.FC<OrdersTabsProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  paymentStatus,
  onPaymentStatusChange,
  orderNumberFilter,
  onOrderNumberFilterChange,
  sortBy,
  sortDirection,
  onSortChange,
  onClearFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Draft state for filters (apply on button click)
  const [draftPaymentStatus, setDraftPaymentStatus] = useState(paymentStatus);
  const [draftOrderNumber, setDraftOrderNumber] = useState(orderNumberFilter);

  // Sync draft state when external filters change
  useEffect(() => {
    setDraftPaymentStatus(paymentStatus);
  }, [paymentStatus]);

  useEffect(() => {
    setDraftOrderNumber(orderNumberFilter);
  }, [orderNumberFilter]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs: { id: OrderTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'payout_pending', label: 'Payout pending' },
    { id: 'payout_done', label: 'Payout done' },
  ];

  const hasActiveFilters = paymentStatus !== '' || orderNumberFilter !== '';

  const handleApplyFilters = () => {
    onPaymentStatusChange(draftPaymentStatus);
    onOrderNumberFilterChange(draftOrderNumber);
    setIsFilterOpen(false);
  };

  const handleClearAndClose = () => {
    setDraftPaymentStatus('');
    setDraftOrderNumber('');
    onClearFilters();
    setIsFilterOpen(false);
  };

  const sortOptions = [
    { label: 'Date (Newest)', value: 'createdAt', direction: 'desc' as const },
    { label: 'Date (Oldest)', value: 'createdAt', direction: 'asc' as const },
    { label: 'Amount (High to Low)', value: 'totalAmount', direction: 'desc' as const },
    { label: 'Amount (Low to High)', value: 'totalAmount', direction: 'asc' as const },
  ];

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'text-sm font-medium pb-2 border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'text-[#131313] border-[#131313]'
                  : 'text-[#BCBCBC] border-transparent hover:text-[#636363]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BCBCBC]" />
            <input
              type="text"
              placeholder="Search for an Order"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-[#E5E5E5] rounded-lg text-sm placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313] transition-colors"
            />
          </div>

          {/* Filters Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors",
                hasActiveFilters
                  ? "border-[#131313] bg-[#F5F5F5] text-[#131313]"
                  : "border-[#E5E5E5] text-[#636363] hover:bg-[#F5F5F5]"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#131313]" />
              )}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-[100] p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#131313]">Filters</span>
                  <button type="button" onClick={() => setIsFilterOpen(false)}>
                    <X className="w-4 h-4 text-[#BCBCBC] hover:text-[#131313]" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#636363] mb-2">Payment Status</label>
                    <div className="relative">
                      <select
                        value={draftPaymentStatus}
                        onChange={(e) => setDraftPaymentStatus(e.target.value)}
                        className={cn(
                          "w-full appearance-none border rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:border-[#131313] bg-white",
                          draftPaymentStatus ? "border-[#131313] bg-[#F5F5F5]" : "border-[#E5E5E5]"
                        )}
                      >
                        <option value="">All payment status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                        <option value="partially_refunded">Partially Refunded</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BCBCBC] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#636363] mb-2">Order Number</label>
                    <input
                      type="text"
                      value={draftOrderNumber}
                      onChange={(e) => setDraftOrderNumber(e.target.value)}
                      placeholder="Search by order number..."
                      className={cn(
                        "w-full border rounded-lg px-3 py-2.5 text-sm placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313]",
                        draftOrderNumber ? "border-[#131313] bg-[#F5F5F5]" : "border-[#E5E5E5]"
                      )}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    {(draftPaymentStatus || draftOrderNumber) && (
                      <button
                        type="button"
                        onClick={handleClearAndClose}
                        className="flex-1 px-3 py-2.5 border border-[#E5E5E5] rounded-full text-sm text-[#636363] hover:bg-[#F5F5F5] transition-colors"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleApplyFilters}
                      className="flex-1 px-3 py-2.5 bg-[#131313] text-white rounded-full text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
                    >
                      Apply filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm text-[#636363] hover:bg-[#F5F5F5] transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort By</span>
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-[100] py-2">
                {sortOptions.map((option) => (
                  <button
                    type="button"
                    key={`${option.value}-${option.direction}`}
                    onClick={() => {
                      onSortChange(option.value, option.direction);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm hover:bg-[#F5F5F5] transition-colors",
                      sortBy === option.value && sortDirection === option.direction
                        ? "text-[#131313] font-medium bg-[#F5F5F5]"
                        : "text-[#636363]"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-between">
          {/* Simplified Tabs */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onTabChange('all')}
              className={cn(
                'text-sm font-medium pb-2 border-b-2 transition-colors',
                activeTab === 'all'
                  ? 'text-[#131313] border-[#131313]'
                  : 'text-[#BCBCBC] border-transparent'
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onTabChange('payout_pending')}
              className={cn(
                'text-sm font-medium pb-2 border-b-2 transition-colors',
                activeTab === 'payout_pending'
                  ? 'text-[#131313] border-[#131313]'
                  : 'text-[#BCBCBC] border-transparent'
              )}
            >
              Pending
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showMobileSearch ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
              )}
            >
              <Search className="w-5 h-5 text-[#636363]" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isFilterOpen || hasActiveFilters ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
              )}
            >
              <SlidersHorizontal className="w-5 h-5 text-[#636363]" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isSortOpen ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"
              )}
            >
              <ArrowUpDown className="w-5 h-5 text-[#636363]" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BCBCBC]" />
            <input
              type="text"
              placeholder="Search for an Order"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E5E5] rounded-lg text-sm placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313]"
              autoFocus
            />
          </div>
        )}

        {/* Mobile Filter Panel */}
        {isFilterOpen && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-[#131313]">Filters</span>
              <button type="button" onClick={() => setIsFilterOpen(false)}>
                <X className="w-4 h-4 text-[#BCBCBC] hover:text-[#131313]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#636363] mb-2">Payment Status</label>
                <div className="relative">
                  <select
                    value={draftPaymentStatus}
                    onChange={(e) => setDraftPaymentStatus(e.target.value)}
                    className={cn(
                      "w-full appearance-none border rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:border-[#131313] bg-white",
                      draftPaymentStatus ? "border-[#131313] bg-[#F5F5F5]" : "border-[#E5E5E5]"
                    )}
                  >
                    <option value="">All payment status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                    <option value="partially_refunded">Partially Refunded</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BCBCBC] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#636363] mb-2">Order Number</label>
                <input
                  type="text"
                  value={draftOrderNumber}
                  onChange={(e) => setDraftOrderNumber(e.target.value)}
                  placeholder="Search by order number..."
                  className={cn(
                    "w-full border rounded-lg px-3 py-2.5 text-sm placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#131313]",
                    draftOrderNumber ? "border-[#131313] bg-[#F5F5F5]" : "border-[#E5E5E5]"
                  )}
                />
              </div>

              <div className="flex gap-2 pt-2">
                {(draftPaymentStatus || draftOrderNumber) && (
                  <button
                    type="button"
                    onClick={handleClearAndClose}
                    className="flex-1 px-3 py-2.5 border border-[#E5E5E5] rounded-full text-sm text-[#636363] hover:bg-[#F5F5F5] transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="flex-1 px-3 py-2.5 bg-[#131313] text-white rounded-full text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
                >
                  Apply filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sort Panel */}
        {isSortOpen && (
          <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-lg py-2">
            {sortOptions.map((option) => (
              <button
                type="button"
                key={`mobile-${option.value}-${option.direction}`}
                onClick={() => {
                  onSortChange(option.value, option.direction);
                  setIsSortOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors",
                  sortBy === option.value && sortDirection === option.direction
                    ? "text-[#131313] font-medium bg-[#F5F5F5]"
                    : "text-[#636363] hover:bg-[#F5F5F5]"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTabs;
