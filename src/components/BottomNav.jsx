import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ClipboardList, ShoppingBag, User, ChefHat, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Build tabs based on role
  const tabs = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
    },
    {
      label: 'Search',
      path: '/?search=1',
      icon: Search,
      exactPath: '/',
    },
    {
      label: 'Orders',
      path: '/orders',
      icon: ClipboardList,
    },
    {
      label: 'Cart',
      path: '/cart',
      icon: ShoppingBag,
      badge: totalItems > 0 ? totalItems : null,
    },
    // Role-specific portal tab
    ...(isAuthenticated && user?.role === 'seller'
      ? [{ label: 'Seller', path: '/seller', icon: ChefHat }]
      : isAuthenticated && user?.role === 'delivery'
      ? [{ label: 'Rides', path: '/delivery/dashboard', icon: Truck }]
      : isAuthenticated && user?.role === 'admin'
      ? [{ label: 'Admin', path: '/admin', icon: Shield }]
      : [{ label: 'Account', path: isAuthenticated ? '/orders' : '/login', icon: User }]),
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.exactPath
            ? location.pathname === tab.exactPath
            : isActive(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                active ? 'text-[#004B49]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#004B49] rounded-full" />
              )}

              {/* Icon with badge */}
              <span className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${active ? 'scale-110' : 'scale-100'}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#004B49] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </span>

              {/* Label */}
              <span
                className={`text-[10px] font-semibold leading-none ${
                  active ? 'text-[#004B49] font-bold' : ''
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
