import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Home',      to: '/' },
  { label: 'Menu',      to: '/menu' },
  { label: 'Our Story', to: '/our-story' },
  { label: 'Catering',  to: '/catering' },
  { label: 'Contact',   to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobile(false); }, [location.pathname]);

  const isActive = (to) => location.pathname === to;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(10,48,36,0.97)' : 'rgba(11,61,46,0.85)',
        backdropFilter: 'blur(18px)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.35)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201,162,39,0.2)' : '1px solid rgba(201,162,39,0.08)',
      }}
    >
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none group">
            <span className="font-serif text-2xl font-bold gold-text tracking-widest uppercase">
              Malabar Gold
            </span>
            <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: 'rgba(201,162,39,0.6)' }}>
              Kerala Fine Dining
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ label, to }) => (
              <Link key={to} to={to}
                className="relative text-sm font-medium tracking-wide transition-colors duration-200 group"
                style={{ color: isActive(to) ? '#C9A227' : '#FDF8EE' }}
              >
                {label}
                <span className="absolute -bottom-1 left-0 h-px transition-all duration-300 rounded-full"
                  style={{
                    width: isActive(to) ? '100%' : '0%',
                    background: 'linear-gradient(90deg, #C9A227, #D4AF37)',
                  }}
                />
                <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #C9A227, #D4AF37)', opacity: isActive(to) ? 0 : 1 }}
                />
              </Link>
            ))}

            <Link to="/contact"
              className="ml-2 px-5 py-2.5 rounded text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 gold-glow"
              style={{ background: 'linear-gradient(135deg, #C9A227, #D4AF37)', color: '#0B3D2E', fontFamily: 'Poppins, sans-serif' }}
            >
              Reserve Now
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded" style={{ color: '#C9A227' }}
            onClick={() => setMobile(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(10,48,36,0.98)', borderTop: '1px solid rgba(201,162,39,0.2)' }}
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {links.map(({ label, to }) => (
                <Link key={to} to={to}
                  className="text-base font-medium py-2 border-b transition-colors"
                  style={{
                    color: isActive(to) ? '#C9A227' : '#FDF8EE',
                    borderColor: 'rgba(201,162,39,0.12)',
                  }}
                >
                  {label}
                </Link>
              ))}
              <Link to="/contact"
                className="mt-2 text-center py-3 rounded font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg, #C9A227, #D4AF37)', color: '#0B3D2E' }}
              >
                Reserve Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
