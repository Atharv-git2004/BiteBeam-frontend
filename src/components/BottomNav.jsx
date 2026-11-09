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
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-white/[0.06]"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(9,9,11,0.90)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: '0 -1px 0 rgba(255,255,255,0.05), 0 -8px 32px rgba(0,0,0,0.5)',
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
                <span className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl opacity-20 animate-pop-in"
                  style={{ background: 'linear-gradient(135deg,#ff5722,#ff9800)' }} />
              )}
              {/* Top accent line */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full animate-scale-in"
                  style={{ background: 'linear-gradient(90deg,#ff5722,#ff9800)' }} />
              )}

              {/* Icon */}
              <span className="relative z-10">
                <Icon
                  className={`h-5 w-5 transition-all duration-200 ${active ? 'text-orange-400 scale-110' : 'text-slate-600 hover:text-slate-400 scale-100'}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none shadow-md shadow-orange-500/40">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </span>

              {/* Label */}
              <span className={`text-[10px] font-semibold leading-none z-10 transition-colors duration-200 ${active ? 'text-orange-400 font-bold' : 'text-slate-600'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
