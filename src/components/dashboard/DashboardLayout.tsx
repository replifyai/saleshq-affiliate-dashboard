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
  
  // Check if we should hide the sidebar (on onboarding route)
  const hideSidebar = pathname?.includes('/onboarding');

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
      'products': '/products',
      'coupons': '/coupons',
      'profile': '/profile',
      'insights': '/insights',
      'reports': '/reports',
      'comments': '/comments',
      'channels': '/channels',
    };
    
    const route = routeMap[path.toLowerCase()];
    if (route) {
      router.push(route);
      closeSidebar();
    }
  };

  // Prevent body scroll when sidebar is open on mobile
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

  // If sidebar should be hidden, render children without sidebar
  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar onNavigate={handleNavigate} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          onClick={closeSidebar}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Drawer */}
          <div
            className={cn(
              'absolute top-0 left-0 w-80 h-full bg-card shadow-xl transform transition-transform duration-300 ease-in-out',
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onNavigate={handleNavigate} />
            
            {/* Close Button */}
            <button
              onClick={closeSidebar}
              className="absolute top-4 right-4 p-2 rounded-lg bg-background border border-border hover:bg-secondary/20 transition-colors z-10 shadow-sm"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-card">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-border bg-card">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-secondary/20 transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-sm sm:text-base font-medium text-foreground">Dashboard</h1>
          <div className="w-8" /> {/* Spacer for centering */}
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
