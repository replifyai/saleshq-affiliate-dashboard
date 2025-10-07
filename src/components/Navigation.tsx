'use client';
import React, { useState, useEffect } from 'react';
import Button from './common/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getContentConfig } from '@/lib/constants';
import { BarChart3, Users, DollarSign, FileText, Menu, X } from 'lucide-react';

export interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get configuration
  const contentConfig = getContentConfig();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Icon components for navigation
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      dashboard: BarChart3,
      referrals: Users,
      earnings: DollarSign,
      payouts: FileText,
    };
    const IconComponent = icons[iconName] || icons.dashboard;
    return <IconComponent className="w-4 h-4" />;
  };

  const navigationLinks = contentConfig.navigation.links.map(link => ({
    ...link,
    icon: getIcon(link.icon || 'dashboard'),
  }));

  return (
    <nav className={cn('bg-white/95 dark:bg-black/95 backdrop-blur-xl dark:border-white/30 w-[90%] md:w-[75%] mx-auto mt-4 py-4 rounded-xl shadow-xl shadow-black/20 ring-1 ring-white/20 dark:ring-white/10 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]', className)}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="bg-primary-gradient px-3 md:px-4 py-2 rounded-lg">
            <span className="text-black font-semibold text-xs md:text-sm">{contentConfig.navigation.logo.toUpperCase()}</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-gray-800 dark:text-gray-200 hover:text-primary transition-all duration-300 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 hover:backdrop-blur-sm border border-transparent hover:border-primary/30 dark:hover:border-primary/20 font-medium"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Button variant="primary" size="sm" className="bg-primary-gradient">
            {contentConfig.navigation.cta.text}
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-3">
          {/* Mobile CTA Button - Small */}
          <Button variant="primary" size="sm" className="bg-primary-gradient text-xs">
            {contentConfig.navigation.cta.text}
          </Button>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-gray-800 dark:text-gray-200 hover:text-primary transition-colors border border-gray-200 dark:border-gray-700 hover:border-primary/30"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-200" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[9999] md:hidden"
          style={{ position: 'fixed' }}
          onClick={closeMobileMenu}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-0 right-0 w-full max-w-sm sm:w-80 h-screen bg-white/95 dark:bg-black/95 backdrop-blur-xl border-l border-white/30 dark:border-white/20 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm">
              <div className="bg-primary-gradient px-3 py-2 rounded-lg">
                <span className="text-white font-semibold text-sm">MENU</span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-gray-800 dark:text-gray-200 hover:text-primary transition-col border border-gray-200 dark:border-gray-700 hover:border-primary/30"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Menu Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-8">
                {/* Mobile Navigation Links */}
                <div className="space-y-4">
                  {navigationLinks.map((link) => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      onClick={closeMobileMenu}
                      className="text-gray-800 dark:text-gray-200 hover:text-primary transition-all duration-300 flex items-center space-x-4 py-5 px-4 rounded-xl hover:bg-white/20 dark:hover:bg-black/30 hover:backdrop-blur-sm border border-transparent hover:border-primary/30 dark:hover:border-primary/20 group shadow-sm hover:shadow-md font-medium"
                    >
                      <div className="p-2 rounded-lg group-hover:bg-white/20 dark:group-hover:bg-black/30 group-hover:backdrop-blur-sm transition-all duration-300">
                        {link.icon}
                      </div>
                      <span className="text-lg font-medium">{link.label}</span>
                    </Link>
                  ))}
                </div>
                
                {/* Mobile CTA */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700 bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="bg-primary-gradient w-full text-base py-5"
                  >
                    Join Affiliate Program
                  </Button>
                  
                  {/* Additional CTA */}
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full mt-3 py-4"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;