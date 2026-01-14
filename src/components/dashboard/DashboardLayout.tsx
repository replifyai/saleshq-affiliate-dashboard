'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const hideSidebar = pathname?.includes('/onboarding');

  const getPageTitle = () => {
    const pageTitles: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/orders': 'Orders',
      '/wallet': 'Wallet',
      '/products': 'Featured Products',
      '/coupons': 'Coupons',
      '/profile': 'Profile',
    };
    return pageTitles[pathname || ''] || 'Dashboard';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigate = (path: string) => {
    const routeMap: Record<string, string> = {
      'dashboard': '/dashboard',
      'orders': '/orders',
      'wallet': '/wallet',
      'products': '/products',
      'featured products': '/products',
      'coupons': '/coupons',
      'profile': '/profile',
    };
    
    const route = routeMap[path.toLowerCase()];
    if (route) {
      router.push(route);
      closeSidebar();
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-56 flex-shrink-0">
        <Sidebar onNavigate={handleNavigate} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          onClick={closeSidebar}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          <div
            className={cn(
              'absolute top-0 left-0 w-72 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out',
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onNavigate={handleNavigate} />
            
            <button
              onClick={closeSidebar}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5 text-[#131313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#F0F0F0] overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5] bg-[#F0F0F0]">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 rounded-lg hover:bg-[#F5F5F5] transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5 text-[#131313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-[#131313]">{getPageTitle()}</h1>
          <div className="w-9" />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
