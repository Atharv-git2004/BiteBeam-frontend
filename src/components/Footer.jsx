import React from 'react';
import { Zap, Globe, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-[#D8CEBA] pt-16 pb-8 border-t border-[#590907]/20"
      style={{ background: '#1C0A09' }}>
      {/* Background orb */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #590907 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Top newsletter strip */}
        <div
          className="rounded-3xl p-6 md:p-8 mb-14 flex flex-col md:flex-row items-center justify-between gap-5 border border-[#590907]/25"
          style={{ background: 'rgba(89,9,7,0.15)', backdropFilter: 'blur(12px)' }}
        >
          <div>
            <h3 className="text-white font-black text-xl mb-1">Get exclusive deals in your inbox</h3>
            <p className="text-[#A5A79B] text-sm">Join 50K+ food lovers. No spam, we promise.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-56 bg-white/[0.05] border border-[#590907]/30 text-white placeholder-[#A5A79B] text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#590907]/60 transition-colors"
            />
            <button className="flex items-center gap-1.5 bg-gradient-to-r from-[#590907] to-[#780F0E] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:from-[#6B0A08] hover:to-[#8C1210] transition-all shadow-lg btn-press">
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Branding */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="bg-gradient-to-tr from-[#590907] to-[#780F0E] p-2.5 rounded-2xl shadow-lg group-hover:shadow-[#590907]/40 transition-shadow">
                <Zap className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">BiteBeam</span>
            </Link>
            <p className="text-[#A5A79B] text-sm leading-relaxed">
              Delivering happiness, one bite at a time. Your favourite food, hot and fresh, right at your doorstep.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3 pt-1">
              {[
                {
                  label: 'Facebook',
                  svg: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>,
                },
                {
                  label: 'Twitter',
                  svg: <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>,
                },
                {
                  label: 'Instagram',
                  svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>,
                },
              ].map(({ label, svg }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#A5A79B] hover:text-[#E8D2B5] hover:bg-[#590907]/20 hover:border-[#590907]/30 transition-all duration-200 btn-press">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">{svg}</svg>
                </a>
              ))}
              <a href="#" aria-label="Website"
                className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#A5A79B] hover:text-[#E8D2B5] hover:bg-[#590907]/20 hover:border-[#590907]/30 transition-all duration-200 btn-press">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3.5">
              {['About Us', 'Careers', 'Team', 'Blog', 'Press'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#A5A79B] hover:text-[#E8D2B5] transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Support</h3>
            <ul className="space-y-3.5">
              {['Help & Support', 'Partner with us', 'Ride with us', 'Contact Us', 'Report Issue'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#A5A79B] hover:text-[#E8D2B5] transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3.5">
              {['Terms & Conditions', 'Privacy Policy', 'Refund Policy', 'Cookie Policy', 'Sitemap'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#A5A79B] hover:text-[#E8D2B5] transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#A5A79B]/60 text-sm">
            © 2026 BiteBeam. All rights reserved.
          </p>
          <p className="text-[#A5A79B]/60 text-sm flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-[#590907] fill-[#590907] animate-pulse" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
