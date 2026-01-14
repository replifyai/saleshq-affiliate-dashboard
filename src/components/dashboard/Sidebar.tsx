'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingCart, Wallet, Package, User, LogOut } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

interface SidebarProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const pathname = usePathname();
  const { logout } = useProfile();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Orders', icon: ShoppingCart, path: '/orders' },
    { label: 'Wallet', icon: Wallet, path: '/wallet' },
    { label: 'Featured Products', icon: Package, path: '/products' },
    { label: 'Profile', icon: User, path: '/profile' },
  ].map(item => ({
    ...item,
    active: pathname === item.path
  }));

  return (
    <aside
      className={cn(
        'bg-white flex flex-col h-full max-h-screen z-20 overflow-y-auto border-r border-[#E5E5E5]',
        className
      )}
    >
      {/* Logo Section */}
      <div className="p-6 pb-8">
                <img
          src="/Logo.png" 
          alt="Frido" 
          className="h-8 w-auto"
                />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onNavigate?.(item.label.toLowerCase())}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  item.active
                    ? 'bg-[#F5F5F5] text-[#131313] font-medium'
                    : 'text-[#BCBCBC] hover:bg-[#F5F5F5] hover:text-[#131313]'
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={item.active ? 2 : 1.5} />
                <span className="whitespace-nowrap text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Section */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-[#BCBCBC] hover:bg-[#F5F5F5] hover:text-[#131313] transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          <div 
            className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#131313]">Logout</h3>
                <p className="text-sm text-[#BCBCBC]">Are you sure you want to logout?</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 rounded-full border border-[#E5E5E5] text-[#131313] hover:bg-[#F5F5F5] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 px-4 py-3 rounded-full bg-[#131313] text-white hover:bg-[#2a2a2a] transition-colors font-medium"
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
