'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Package, ShoppingBag, User, LogOut, Tag } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

interface SidebarProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const pathname = usePathname();
  const { state, logout } = useProfile();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const navItems = [
    { label: 'DashBoard', icon: BarChart3, path: '/dashboard' },
    { label: 'Orders', icon: Package, path: '/orders' },
    { label: 'Products', icon: ShoppingBag, path: '/products' },
    { label: 'Coupons', icon: Tag, path: '/coupons' },
    { label: 'Profile', icon: User, path: '/profile' },
  ].map(item => ({
    ...item,
    active: pathname === item.path
  }));

  // Get the creator's name from profile, fallback to "there"
  const creatorName = state.profile?.name || 'there';
  const isVerified = !!state.completionScore && state.completionScore.leftCount === 0;

  return (
    <aside
      className={cn(
        'bg-card flex flex-col h-full max-h-screen z-20 overflow-y-auto',
        className
      )}
    >

      {/* Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col items-center space-y-3">
          <div className="text-left">
            <h3 className="font-semibold text-foreground text-base text-lg flex items-center gap-2">
              Hi {creatorName}!
              {isVerified && (
                <img
                  src="/verified.png"
                  alt="Verified"
                  className="w-4 h-4 inline-block"
                />
              )}
            </h3>
            <p className="text-xs text-muted-foreground">Welcome to your affiliate dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onNavigate?.(item.label.toLowerCase())}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation',
                  item.active
                    ? 'bg-primary text-black shadow-md'
                    : 'text-muted-foreground hover:bg-secondary/20 hover:text-foreground active:bg-secondary/30'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-6 border-t border-border">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowLogoutConfirm(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <div 
            className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Logout Confirmation</h3>
                <p className="text-sm text-muted-foreground">Are you sure you want to logout?</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              You will need to login again to access your dashboard and track your earnings.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-secondary/20 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
