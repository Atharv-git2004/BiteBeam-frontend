import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ClipboardList, ShoppingBag, User, ChefHat, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const location     = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const isActive = (path) => location.pathname === path;

  const tabs = [
    { label: 'Home',   path: '/',       icon: Home },
    { label: 'Search', path: '/?search=1', icon: Search, exactPath: '/' },
    { label: 'Orders', path: '/orders', icon: ClipboardList },
    { label: 'Cart',   path: '/cart',   icon: ShoppingBag, badge: totalItems > 0 ? totalItems : null },
    ...(isAuthenticated && user?.role === 'seller'
      ? [{ label: 'Seller',  path: '/seller',             icon: ChefHat }]
      : isAuthenticated && user?.role === 'delivery'
      ? [{ label: 'Rides',   path: '/delivery/dashboard', icon: Truck }]
      : isAuthenticated && user?.role === 'admin'
      ? [{ label: 'Admin',   path: '/admin',              icon: Shield }]
      : [{ label: 'Account', path: isAuthenticated ? '/orders' : '/login', icon: User }]),
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-[#D8CEBA]/60"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(250,247,242,0.92)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        boxShadow: '0 -1px 0 rgba(216,206,186,0.5), 0 -8px 32px rgba(89,9,7,0.08)',
      }}
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon   = tab.icon;
          const active = tab.exactPath ? location.pathname === tab.exactPath : isActive(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors"
            >
              {/* Active glow bubble */}
              {active && (
                <span className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl opacity-15 animate-pop-in"
                  style={{ background: 'rgba(89,9,7,0.5)' }} />
              )}
              {/* Top accent line */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full animate-scale-in bg-[#590907]" />
              )}

              {/* Icon */}
              <span className="relative z-10">
                <Icon
                  className={`h-5 w-5 transition-all duration-200 ${active ? 'text-[#590907] scale-110' : 'text-[#A5A79B] hover:text-[#4A443C] scale-100'}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-br from-[#590907] to-[#780F0E] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none shadow-md shadow-[#590907]/30">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </span>

              {/* Label */}
              <span className={`text-[10px] font-semibold leading-none z-10 transition-colors duration-200 ${active ? 'text-[#590907] font-bold' : 'text-[#A5A79B]'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
