'use client';

import React, { useState } from 'react';
import { apiClient } from '@/services/apiClient';
import { CouponValue } from '@/types/api';
import { useSnackbar } from '@/components/snackbar/use-snackbar';
import Button from '@/components/common/Button';
import TextField from '@/components/common/TextField';
import { CURRENCY_CODES } from './constants';
import { cn } from '@/lib/utils';

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCouponModal: React.FC<CreateCouponModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    percentage: '',
    amount: '',
    currencyCode: 'INR', // Default to India
    appliesOnEachItem: false,
    usageLimit: '0',
    usesPerOrderLimit: '1',
    startsAt: '',
    endsAt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.code || !formData.startsAt || !formData.endsAt) {
      showError('Please fill in all required fields');
      return;
    }

    let couponValue: CouponValue;

    if (discountType === 'percentage') {
      const percentage = parseFloat(formData.percentage);
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
        showError('Percentage must be between 1 and 100');
        return;
      }
      couponValue = {
        type: 'percentage',
        percentage: percentage,
      };
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        showError('Amount must be greater than 0');
        return;
      }
      if (!formData.currencyCode) {
        showError('Please select a currency');
        return;
      }
      couponValue = {
        type: 'amount',
        amount: formData.amount,
        currencyCode: formData.currencyCode,
        appliesOnEachItem: formData.appliesOnEachItem,
      };
    }

    setIsSubmitting(true);
    try {
      await apiClient.createCouponForCreator({
        title: formData.title,
        code: formData.code,
        description: formData.description,
        value: couponValue,
        usageLimit: parseInt(formData.usageLimit) || 0,
        usesPerOrderLimit: parseInt(formData.usesPerOrderLimit) || 1,
        itemsSelection: {},
        startsAt: new Date(formData.startsAt).toISOString(),
        endsAt: new Date(formData.endsAt).toISOString(),
      });

      showSuccess('Coupon created successfully! It will be reviewed by admin before activation.');
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        title: '',
        code: '',
        description: '',
        percentage: '',
        amount: '',
        currencyCode: 'INR',
        appliesOnEachItem: false,
        usageLimit: '0',
        usesPerOrderLimit: '1',
        startsAt: '',
        endsAt: '',
      });
      setDiscountType('percentage');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to create coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-card rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Create New Coupon</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-secondary/20 transition-colors"
            >
              <span className="text-lg">&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Title"
                value={formData.title}
                onChange={(value) => setFormData({ ...formData, title: value })}
                placeholder="e.g., Summer Sale 2024"
                required
                className="[&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:rounded-lg [&_label]:text-xs"
              />

              <TextField
                label="Coupon Code"
                value={formData.code}
                onChange={(value) => setFormData({ ...formData, code: value.toUpperCase() })}
                placeholder="SUMMER2024"
                required
                className="[&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:rounded-lg [&_label]:text-xs"
              />
            </div>

            <TextField
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Describe this coupon..."
              className="[&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:rounded-lg [&_label]:text-xs"
            />

            {/* Discount Type Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">
                Discount Type <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDiscountType('percentage')}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm rounded-lg border-2 transition-all duration-300',
                    discountType === 'percentage'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  )}
                >
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('amount')}
                  className={cn(
                    'flex-1 px-3 py-2 text-sm rounded-lg border-2 transition-all duration-300',
                    discountType === 'amount'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  )}
                >
                  Fixed Amount
                </button>
              </div>
            </div>

            {/* Discount Value Fields */}
            {discountType === 'percentage' ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-foreground">
                    Discount Percentage <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    placeholder="10"
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                  />
                </div>
                <div></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-foreground">
                      Discount Amount <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="100"
                      required
                      className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-foreground">
                      Currency <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.currencyCode}
                      onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                      required
                    >
                      {CURRENCY_CODES.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name} ({currency.country})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="appliesOnEachItem"
                    checked={formData.appliesOnEachItem}
                    onChange={(e) => setFormData({ ...formData, appliesOnEachItem: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-border bg-card text-primary focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="appliesOnEachItem" className="text-xs text-foreground cursor-pointer">
                    Apply discount on each item
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground">
                  Usage Limit (0 = unlimited)
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground">
                  Uses Per Order Limit
                </label>
                <input
                  type="number"
                  value={formData.usesPerOrderLimit}
                  onChange={(e) => setFormData({ ...formData, usesPerOrderLimit: e.target.value })}
                  placeholder="1"
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground">
                  Start Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.startsAt}
                  onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground">
                  End Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={formData.endsAt}
                  onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border-2 border-border bg-card text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex-1 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="flex-1 text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Coupon'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponModal;

