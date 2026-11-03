import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, MapPin, ChevronDown, Compass, ShoppingBag, Clock, User, Menu, X, LogOut, Shield, ChefHat, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-white ${
        isScrolled ? 'shadow-md border-b border-gray-100 py-1' : 'border-b border-gray-100 py-2'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* LEFT: Logo & Location */}
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-tr from-[#004B49] to-[#005C5E] p-2.5 rounded-2xl shadow-md group-hover:scale-105 transition-transform shadow-[#004B49]/20">
                <Zap className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                Bite<span className="text-[#005C5E]">Beam</span>
              </span>
            </Link>

            {/* Location Selector */}
            <div className="hidden sm:flex items-center gap-2 text-sm cursor-pointer group hover:text-[#005C5E] transition-colors bg-gray-50 hover:bg-[#f0f9f9] px-3 py-2 rounded-xl border border-gray-200/60">
              <MapPin className="h-4 w-4 text-[#005C5E] flex-shrink-0" />
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900 group-hover:text-[#005C5E] transition-colors text-sm">Kannur</span>
                <span className="text-xs text-gray-500">, Kerala</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-[#005C5E] transition-colors ml-1" />
            </div>
          </div>

          {/* CENTER/RIGHT: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link 
              to="/" 
              className={`flex items-center gap-2 font-semibold transition-colors ${
                isActive('/') ? 'text-[#005C5E]' : 'text-gray-700 hover:text-[#005C5E]'
              }`}
            >
              <Compass className="h-5 w-5" />
              <span>Explore</span>
            </Link>

            <Link 
              to="/cart" 
              className={`flex items-center gap-2 font-semibold transition-colors relative ${
                isActive('/cart') ? 'text-[#005C5E]' : 'text-gray-700 hover:text-[#005C5E]'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="bg-[#004B49] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link 
              to="/orders" 
              className={`flex items-center gap-2 font-semibold transition-colors ${
                isActive('/orders') ? 'text-[#005C5E]' : 'text-gray-700 hover:text-[#005C5E]'
              }`}
            >
              <Clock className="h-5 w-5" />
              <span>Orders</span>
            </Link>

            {/* Seller / Admin Portal Links if privileged */}
            {isAuthenticated && user?.role === 'seller' && (
              <Link
                to="/seller"
                className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl transition-colors ${
                  isActive('/seller') ? 'bg-[#dcf2f2] text-[#004B49]' : 'text-[#004B49] bg-[#f0f9f9] hover:bg-[#dcf2f2]'
                }`}
              >
                <ChefHat className="h-4 w-4" />
                <span>Seller Portal</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl transition-colors ${
                  isActive('/admin') ? 'bg-purple-100 text-purple-700' : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'delivery' && (
              <Link
                to="/delivery/dashboard"
                className={`flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl transition-colors ${
                  isActive('/delivery/dashboard') ? 'bg-orange-100 text-orange-700' : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                }`}
              >
                <Truck className="h-4 w-4" />
                <span>My Deliveries</span>
              </Link>
            )}
            
            <div className="w-px h-6 bg-gray-200"></div>
            
            {/* User Profile or Sign In */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-1.5 px-3 rounded-xl transition cursor-pointer"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    user?.role === 'admin' ? 'bg-purple-600 text-white' :
                    user?.role === 'seller' ? 'bg-[#005C5E] text-white' : 'bg-[#004B49] text-white'
                  }`}>
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[100px]">{user?.name}</p>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{user?.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                    </div>
                    {user?.role === 'seller' && (
                      <Link
                        to="/seller"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#005C5E]"
                      >
                        <ChefHat className="w-4 h-4 text-[#005C5E]" />
                        Seller Dashboard
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        Admin Dashboard
                      </Link>
                    )}
                    {user?.role === 'delivery' && (
                      <Link
                        to="/delivery/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                      >
                        <Truck className="w-4 h-4 text-orange-600" />
                        Delivery Dashboard
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#005C5E]"
                    >
                      <Clock className="w-4 h-4" />
                      Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border-t border-gray-50 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 bg-[#004B49] hover:bg-[#003837] text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </nav>

          {/* MOBILE: Actions & Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-[#005C5E] transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#004B49] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-[#005C5E] transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <MapPin className="h-5 w-5 text-[#005C5E]" />
            <div>
              <p className="font-bold text-gray-900 text-sm">Kannur, Kerala</p>
              <p className="text-xs text-gray-500">Current Location</p>
            </div>
          </div>
          
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-[#f0f9f9] hover:text-[#005C5E] rounded-xl font-semibold"
          >
            <Compass className="h-5 w-5 text-gray-400" />
            Explore
          </Link>

          <Link 
            to="/cart" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="flex items-center justify-between p-3 text-gray-700 hover:bg-[#f0f9f9] hover:text-[#005C5E] rounded-xl font-semibold"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-gray-400" />
              Cart
            </div>
            {totalItems > 0 && (
              <span className="bg-[#004B49] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          <Link 
            to="/orders" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="flex items-center gap-3 p-3 text-gray-700 hover:bg-[#f0f9f9] hover:text-[#005C5E] rounded-xl font-semibold"
          >
            <Clock className="h-5 w-5 text-gray-400" />
            Orders
          </Link>

          {isAuthenticated && user?.role === 'seller' && (
            <Link 
              to="/seller" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-3 p-3 bg-[#f0f9f9] text-[#004B49] rounded-xl font-bold"
            >
              <ChefHat className="h-5 w-5 text-[#005C5E]" />
              Seller Portal
            </Link>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link 
              to="/admin" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-xl font-bold"
            >
              <Shield className="h-5 w-5 text-purple-600" />
              Admin Dashboard
            </Link>
          )}
          
          <hr className="border-gray-100 my-2" />
          
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="px-3 py-1 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {user?.role}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 p-3 bg-[#004B49] text-white rounded-xl font-bold shadow-md hover:bg-[#003837] transition-colors"
            >
              <User className="h-5 w-5" />
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
