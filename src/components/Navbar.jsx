import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Zap, MapPin, ChevronDown, Compass, ShoppingBag, Clock,
  User, Menu, X, LogOut, Shield, ChefHat, Truck, Search,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { totalItems }                      = useCart();
  const { user, isAuthenticated, logout }   = useAuth();
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setMobile]       = useState(false);
  const [userDropdownOpen, setUserDropdown] = useState(false);
  const [cartBump, setCartBump]             = useState(false);
  const prevItems = useRef(totalItems);
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (totalItems > prevItems.current) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 500);
      prevItems.current = totalItems;
      return () => clearTimeout(t);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  useEffect(() => {
    const h = (e) => { if (!e.target.closest('#dd-wrap')) setUserDropdown(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout(); setUserDropdown(false); setMobile(false); navigate('/');
  };

  /* Shared nav link */
  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={`relative flex items-center gap-2 text-sm font-semibold transition-all duration-200 group px-1 py-0.5 ${
        isActive(to) ? 'text-white' : 'text-slate-400 hover:text-white'
      }`}
    >
      <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
      <span>{children}</span>
      <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${
        isActive(to)
          ? 'w-full bg-gradient-to-r from-orange-500 to-amber-500'
          : 'w-0 group-hover:w-full bg-gradient-to-r from-orange-500 to-amber-500'
      }`} />
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 animate-navbar ${
        isScrolled
          ? 'glass border-b border-white/[0.06] shadow-2xl shadow-black/40'
          : 'bg-[#09090b]/95 border-b border-white/[0.04]'
      }`}
      style={{ backdropFilter: isScrolled ? 'blur(24px) saturate(180%)' : 'none' }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-16 md:h-18">

          {/* ── Logo ── */}
          <div className="flex items-center gap-5 md:gap-8">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-orange-500/30 blur-md scale-125 group-hover:scale-150 group-hover:bg-orange-500/50 transition-all duration-500" />
                <div className="relative bg-gradient-to-br from-orange-500 to-amber-500 p-2.5 rounded-xl shadow-lg group-hover:shadow-orange-500/40 transition-shadow duration-300">
                  <Zap className="h-5 w-5 text-white drop-shadow" fill="currentColor" />
                </div>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[1.35rem] font-black text-white tracking-tight leading-none">Bite</span>
                <span className="text-[1.35rem] font-black tracking-tight leading-none gradient-text">Beam</span>
              </div>
            </Link>

            {/* Location chip */}
            <button className="hidden sm:flex items-center gap-1.5 text-xs cursor-pointer group px-3 py-1.5 rounded-xl border border-white/[0.08] hover:border-orange-500/30 bg-white/[0.03] hover:bg-orange-500/[0.06] transition-all duration-200 btn-press">
              <MapPin className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
              <span className="font-bold text-slate-200 group-hover:text-white transition-colors">Kannur</span>
              <span className="text-slate-500">, KL</span>
              <ChevronDown className="h-3 w-3 text-slate-500 ml-0.5" />
            </button>
          </div>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/"       icon={Compass}>Explore</NavLink>
            <NavLink to="/orders" icon={Clock}>Orders</NavLink>

            {isAuthenticated && user?.role === 'seller' && (
              <Link to="/seller"
                className={`flex items-center gap-1.5 font-bold text-sm px-3.5 py-1.5 rounded-xl transition-all duration-200 btn-press border ${
                  isActive('/seller')
                    ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                    : 'border-white/[0.08] text-slate-400 hover:border-orange-500/25 hover:text-orange-400 hover:bg-orange-500/[0.07]'
                }`}>
                <ChefHat className="h-4 w-4" /> Seller
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin"
                className="flex items-center gap-1.5 font-bold text-sm px-3.5 py-1.5 rounded-xl border border-white/[0.08] text-slate-400 hover:border-violet-500/30 hover:text-violet-400 hover:bg-violet-500/[0.07] transition-all btn-press">
                <Shield className="h-4 w-4" /> Admin
              </Link>
            )}
            {isAuthenticated && user?.role === 'delivery' && (
              <Link to="/delivery/dashboard"
                className="flex items-center gap-1.5 font-bold text-sm px-3.5 py-1.5 rounded-xl border border-white/[0.08] text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400 hover:bg-emerald-500/[0.07] transition-all btn-press">
                <Truck className="h-4 w-4" /> Rides
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart"
              className={`relative flex items-center gap-2 text-sm font-semibold transition-all duration-200 group px-1 py-0.5 ${
                isActive('/cart') ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}>
              <span className={`relative ${cartBump ? 'animate-pop-in' : ''}`}>
                <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none shadow-lg shadow-orange-500/40">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </span>
              <span>Cart</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300 ${
                isActive('/cart') ? 'w-full bg-gradient-to-r from-orange-500 to-amber-500' : 'w-0 group-hover:w-full bg-gradient-to-r from-orange-500 to-amber-500'
              }`} />
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div id="dd-wrap" className="relative">
                <button onClick={() => setUserDropdown(!userDropdownOpen)} className="btn-press">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow">
                    {user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                  </div>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1f] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-pop-in z-50">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1.5 text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 tracking-wider border border-orange-500/20">
                        {user?.role}
                      </span>
                    </div>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-semibold">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 btn-press">
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}
          </nav>

          {/* ── Mobile Right ── */}
          <div className="md:hidden flex items-center gap-1.5">
            <Link to="/cart" className="relative p-2 text-slate-400 hover:text-white transition-colors btn-press">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className={`absolute top-0.5 right-0.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none ${cartBump ? 'animate-pop-in' : ''}`}>
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobile(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors btn-press rounded-xl hover:bg-white/[0.05]"
            >
              <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-[640px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-[#111113] border-t border-white/[0.06] px-4 pt-4 pb-6 space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Kannur, Kerala</p>
              <p className="text-xs text-slate-500">Current Location</p>
            </div>
          </div>

          {[
            { to: '/',       icon: Compass,    label: 'Explore' },
            { to: '/orders', icon: Clock,      label: 'Orders' },
            { to: '/cart',   icon: ShoppingBag, label: 'Cart', badge: totalItems },
          ].map(({ to, icon: Icon, label, badge }) => (
            <Link key={to} to={to} onClick={() => setMobile(false)}
              className={`flex items-center justify-between p-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                isActive(to)
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-white border border-transparent'
              }`}>
              <div className="flex items-center gap-3"><Icon className="h-5 w-5" />{label}</div>
              {badge > 0 && (
                <span className="bg-gradient-to-br from-orange-500 to-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{badge}</span>
              )}
            </Link>
          ))}

          {isAuthenticated && user?.role === 'seller' && (
            <Link to="/seller" onClick={() => setMobile(false)}
              className="flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm text-orange-400 bg-orange-500/[0.07] border border-orange-500/15 hover:bg-orange-500/15 transition-colors">
              <ChefHat className="h-5 w-5" /> Seller Portal
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobile(false)}
              className="flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm text-violet-400 bg-violet-500/[0.07] border border-violet-500/15 hover:bg-violet-500/15 transition-colors">
              <Shield className="h-5 w-5" /> Admin Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === 'delivery' && (
            <Link to="/delivery/dashboard" onClick={() => setMobile(false)}
              className="flex items-center gap-3 p-3.5 rounded-2xl font-bold text-sm text-emerald-400 bg-emerald-500/[0.07] border border-emerald-500/15 hover:bg-emerald-500/15 transition-colors">
              <Truck className="h-5 w-5" /> Ride Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-white/[0.06] mt-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3.5 py-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-400 rounded-2xl font-bold hover:bg-red-500/15 transition-colors text-sm btn-press border border-red-500/15">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobile(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/25 transition-all text-sm btn-press">
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
