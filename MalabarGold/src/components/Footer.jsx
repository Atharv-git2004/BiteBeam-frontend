import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';

const footerLinks = {
  Explore:  [
    { label: 'Home',      to: '/' },
    { label: 'Menu',      to: '/menu' },
    { label: 'Our Story', to: '/our-story' },
    { label: 'Catering',  to: '/catering' },
    { label: 'Reserve',   to: '/contact' },
  ],
  Specialties: ['Malabar Biryani', 'Fish Curry', 'Kerala Sadya', 'Appam & Stew', 'Payasam'],
};

export default function Footer() {
  return (
    <footer style={{ background: '#0B3D2E', borderTop: '1px solid rgba(201,162,39,0.25)' }}>
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 pt-16 pb-8">

        {/* Top gold divider */}
        <div className="flex items-center gap-4 mb-14">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.4))' }} />
          <span className="font-serif text-3xl gold-text tracking-widest">✦</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,162,39,0.4), transparent)' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <h2 className="font-serif text-2xl font-bold gold-text tracking-widest uppercase mb-1">Malabar Gold</h2>
              <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(201,162,39,0.5)' }}>Kerala Fine Dining</p>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(253,248,238,0.6)' }}>
              Authentic Kerala cuisine crafted with generations of culinary tradition. Every dish tells a story of spice, love, and legacy.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ border: '1px solid rgba(201,162,39,0.3)', color: '#C9A227' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,162,39,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-5 gold-text">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.Explore.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to}
                    className="text-sm transition-colors duration-200 hover:pl-1"
                    style={{ color: 'rgba(253,248,238,0.6)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#C9A227'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(253,248,238,0.6)'; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-5 gold-text">Specialties</h3>
            <ul className="space-y-3">
              {footerLinks.Specialties.map(item => (
                <li key={item}
                  className="text-sm"
                  style={{ color: 'rgba(253,248,238,0.6)' }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-5 gold-text">Visit Us</h3>
            <div className="space-y-4">
              {[
                { Icon: MapPin, text: 'Beach Road, Kozhikode, Kerala 673001' },
                { Icon: Phone,  text: '+91 98765 43210' },
                { Icon: Mail,   text: 'reservations@malabargold.in' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon size={15} className="mt-0.5 flex-shrink-0" style={{ color: '#C9A227' }} />
                  <span className="text-sm leading-relaxed" style={{ color: 'rgba(253,248,238,0.6)' }}>{text}</span>
                </div>
              ))}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(201,162,39,0.15)' }}>
                <p className="text-xs" style={{ color: 'rgba(253,248,238,0.4)' }}>Open Daily</p>
                <p className="text-sm font-medium mt-1" style={{ color: 'rgba(253,248,238,0.75)' }}>12:00 PM – 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(201,162,39,0.12)' }}>
          <p className="text-xs" style={{ color: 'rgba(253,248,238,0.35)' }}>
            © 2026 Malabar Gold. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(201,162,39,0.5)' }}>
            Crafted with ❤️ for the love of Kerala cuisine
          </p>
        </div>
      </div>
    </footer>
  );
}
