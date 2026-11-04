import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Zap, MapPin, ChevronDown, Compass, ShoppingBag, Clock,
  User, Menu, X, LogOut, Shield, ChefHat, Truck, Bell
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setMobile]        = useState(false);
  const [userDropdownOpen, setUserDropdown]  = useState(false);
  const [cartBump, setCartBump]              = useState(false);
  const prevItems = useRef(totalItems);
  const location   = useLocation();
  const navigate   = useNavigate();

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Cart bump animation on add */
  useEffect(() => {
    if (totalItems > prevItems.current) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 500);
      prevItems.current = totalItems;
      return () => clearTimeout(t);
    }
    prevItems.current = totalItems;
  }, [totalItems]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#user-dropdown-wrapper')) setUserDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    setMobile(false);
    navigate('/');
  };

  const NavLink = ({ to, icon: Icon, children, className = '' }) => (
    <Link
      to={to}
      className={`relative flex items-center gap-2 font-semibold text-sm transition-all duration-200 group px-1 py-0.5 ${
        isActive(to)
          ? 'text-[#004B49]'
          : 'text-gray-600 hover:text-[#004B49]'
      } ${className}`}
    >
      <Icon className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110" />
      <span>{children}</span>
      {/* Animated underline */}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-[#004B49] transition-all duration-300 ${
          isActive(to) ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-400 animate-navbar ${
        isScrolled
          ? 'glass shadow-lg shadow-black/5 border-b border-white/60 py-0'
          : 'bg-white/95 border-b border-gray-100/80 py-1'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-16 md:h-18">

          {/* ── LEFT: Logo + Location ── */}
          <div className="flex items-center gap-5 md:gap-8">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#004B49]/20 rounded-2xl blur-md scale-125 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative bg-gradient-to-tr from-[#003837] via-[#004B49] to-[#005C5E] p-2.5 rounded-2xl shadow-lg group-hover:shadow-[#004B49]/40 transition-shadow duration-300">
                  <Zap className="h-5 w-5 text-white drop-shadow-sm" fill="currentColor" />
                </div>
              </div>
              <span className="text-[1.35rem] font-black text-gray-900 tracking-tight leading-none">
                Bite<span className="gradient-text">Beam</span>
              </span>
            </Link>

            {/* Location chip */}
            <button className="hidden sm:flex items-center gap-1.5 text-sm cursor-pointer group hover:text-[#005C5E] transition-colors bg-brand-50/80 hover:bg-brand-100/80 px-3 py-1.5 rounded-xl border border-brand-200/60 btn-press">
              <MapPin className="h-3.5 w-3.5 text-[#005C5E] flex-shrink-0" />
              <span className="font-bold text-gray-800 group-hover:text-[#005C5E] transition-colors text-sm">Kannur</span>
              <span className="text-xs text-gray-400">, KL</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#005C5E] transition-colors ml-0.5" />
            </button>
          </div>

          {/* ── CENTER/RIGHT: Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/"       icon={Compass}>Explore</NavLink>
            <NavLink to="/orders" icon={Clock}>Orders</NavLink>

            {isAuthenticated && user?.role === 'seller' && (
              <Link
                to="/seller"
                className={`flex items-center gap-1.5 font-bold text-sm px-3.5 py-1.5 rounded-xl transition-all duration-200 btn-press ${
                  isActive('/seller')
                    ? 'bg-[#dcf2f2] text-[#004B49] shadow-sm'
                    : 'text-[#004B49] bg-brand-50 hover:bg-[#dcf2f2]'
                }`}
              >
                <ChefHat className="h-4 w-4" />
                <span>Seller</span>
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 font-bold text-sm px-3.5 py-1.5 rounded-xl transition-all duration-200 btn-press ${
                  isActive('/admin')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
            {isAuthenticated && user?.role === 'delivery' && (
              <Link
                to="/delivery/dashboard"
                className="flex items-center gap-1.5 font-bold text-sm px-3.5 py-1.5 rounded-xl text-teal-700 bg-teal-50 hover:bg-teal-100 transition-all btn-press"
              >
                <Truck className="h-4 w-4" />
                <span>Rides</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className={`relative flex items-center gap-2 font-semibold text-sm transition-all duration-200 group px-1 py-0.5 ${
                isActive('/cart') ? 'text-[#004B49]' : 'text-gray-600 hover:text-[#004B49]'
              }`}
            >
              <span className={`relative transition-transform duration-300 ${cartBump ? 'animate-pop-in' : ''}`}>
                <ShoppingBag className="h-4.5 w-4.5 group-hover:scale-110 transition-transform duration-200" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#004B49] to-[#005C5E] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none shadow-md">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </span>
              <span>Cart</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-[#004B49] transition-all duration-300 ${isActive('/cart') ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div id="user-dropdown-wrapper" className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdownOpen)}
                  className="flex items-center gap-2 btn-press"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#004B49] to-[#005C5E] flex items-center justify-center text-white font-black text-sm shadow-md hover:shadow-[#004B49]/40 transition-shadow">
                    {user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl shadow-2xl shadow-black/10 overflow-hidden animate-pop-in z-50">
                    <div className="px-4 py-3 border-b border-gray-100/60">
                      <p className="font-bold text-gray-900 text-sm truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-brand-100 text-[#004B49] tracking-wider">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors font-semibold"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-[#004B49] to-[#005C5E] hover:from-[#003837] hover:to-[#004B49] text-white font-bold text-sm px-4 py-2 rounded-xl shadow-md hover:shadow-[#004B49]/40 transition-all duration-200 btn-press"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </nav>

          {/* ── Mobile Right Controls ── */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-[#005C5E] transition-colors btn-press">
              <ShoppingBag className="h-5.5 w-5.5" />
              {totalItems > 0 && (
                <span className={`absolute top-0.5 right-0.5 bg-[#004B49] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[16px] text-center leading-none ${cartBump ? 'animate-pop-in' : ''}`}>
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobile(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#005C5E] transition-colors btn-press rounded-xl hover:bg-gray-100"
            >
              <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass border-t border-white/40 px-4 pt-4 pb-6 space-y-2 shadow-xl">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-50/60 border border-brand-200/40 mb-4">
            <div className="w-8 h-8 rounded-xl bg-[#004B49]/10 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-[#005C5E]" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Kannur, Kerala</p>
              <p className="text-xs text-gray-400">Current Location</p>
            </div>
          </div>

          {[
            { to: '/',       icon: Compass,       label: 'Explore' },
            { to: '/orders', icon: Clock,          label: 'Orders' },
            { to: '/cart',   icon: ShoppingBag,    label: 'Cart', badge: totalItems },
          ].map(({ to, icon: Icon, label, badge }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobile(false)}
              className={`flex items-center justify-between p-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                isActive(to)
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-brand-50 hover:text-[#005C5E]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                {label}
              </div>
              {badge > 0 && (
                <span className="bg-[#004B49] text-white text-xs font-black px-2 py-0.5 rounded-full">{badge}</span>
              )}
            </Link>
          ))}

          {isAuthenticated && user?.role === 'seller' && (
            <Link to="/seller" onClick={() => setMobile(false)}
              className="flex items-center gap-3 p-3.5 bg-brand-50 text-[#004B49] rounded-2xl font-bold text-sm hover:bg-brand-100 transition-colors">
              <ChefHat className="h-5 w-5 text-[#005C5E]" /> Seller Portal
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setMobile(false)}
              className="flex items-center gap-3 p-3.5 bg-purple-50 text-purple-700 rounded-2xl font-bold text-sm hover:bg-purple-100 transition-colors">
              <Shield className="h-5 w-5 text-purple-500" /> Admin Dashboard
            </Link>
          )}
          {isAuthenticated && user?.role === 'delivery' && (
            <Link to="/delivery/dashboard" onClick={() => setMobile(false)}
              className="flex items-center gap-3 p-3.5 bg-teal-50 text-teal-700 rounded-2xl font-bold text-sm hover:bg-teal-100 transition-colors">
              <Truck className="h-5 w-5 text-teal-500" /> Ride Dashboard
            </Link>
          )}

          <div className="border-t border-gray-100/60 pt-3 mt-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3.5 py-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#004B49] to-[#005C5E] flex items-center justify-center text-white font-black text-sm shadow">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors text-sm btn-press"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobile(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-[#004B49] to-[#005C5E] text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all text-sm btn-press"
              >
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
