'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Package, ShoppingBag, User } from 'lucide-react';

interface SidebarProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'DashBoard', icon: BarChart3, path: '/dashboard' },
    { label: 'Orders', icon: Package, path: '/orders' },
    { label: 'Products', icon: ShoppingBag, path: '/products' },
    { label: 'Profile', icon: User, path: '/profile' },
  ].map(item => ({
    ...item,
    active: pathname === item.path
  }));

  return (
    <aside
      className={cn(
        'bg-card flex flex-col h-full',
        className
      )}
    >

      {/* Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col items-center space-y-3">
          <div className="text-left">
            <h3 className="font-semibold text-foreground text-base text-xl">Hi Rockey Pandit!</h3>
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

      {/* Community Section */}
      <div className="p-6 border-t border-border">
        <div className="bg-secondary/10 rounded-xl p-4 text-center space-y-3">
          <div className="flex justify-center -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-card overflow-hidden">
              <img
                src="https://i.pravatar.cc/150?img=1"
                alt="User 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary border-2 border-card overflow-hidden">
              <img
                src="https://i.pravatar.cc/150?img=2"
                alt="User 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-accent border-2 border-card flex items-center justify-center">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Join the community</p>
            <p className="text-xs text-muted-foreground">and find out more</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
