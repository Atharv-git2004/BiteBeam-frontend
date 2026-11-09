import React from 'react';
import SearchBar from './SearchBar';
import { Sparkles, Clock, ShieldCheck, ThumbsUp, ArrowRight, Star, ChevronDown, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative w-full overflow-hidden mesh-bg noise-overlay" style={{ minHeight: 'clamp(520px, 65vw, 740px)' }}>

      {/* ── Obsidian base ── */}
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* ── Accent orbs ── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(circle, #ff5722 0%, transparent 65%)', transform: 'translate(35%, -35%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, #ff9800 0%, transparent 65%)', transform: 'translate(-35%, 35%)' }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #00e676 0%, transparent 65%)', transform: 'translate(-50%, -50%)' }} />

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── LEFT ── */}
          <div className="lg:col-span-7 flex flex-col space-y-6">

            {/* Pill */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/25 text-sm font-semibold w-max"
                style={{ background: 'rgba(255,87,34,0.08)', backdropFilter: 'blur(12px)' }}>
                <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                <span className="text-orange-300">Lightning-Fast Food Delivery</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Headline */}
            <div className="animate-fade-up delay-100">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.03] text-white">
                Hungry?{' '}<br />
                <span className="gradient-text">Good things</span>
                <br />
                are on the way.
              </h1>
            </div>

            {/* Sub */}
            <p className="text-slate-400 text-base sm:text-lg max-w-xl font-medium leading-relaxed animate-fade-up delay-200">
              Order from 500+ top restaurants, local favourites, and home chefs in Kannur with real-time GPS tracking.
            </p>

            {/* Search */}
            <div className="pt-1 pb-2 animate-fade-up delay-300">
              <SearchBar variant="hero" />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 pt-1 animate-fade-up delay-400">
              {[
                { icon: Clock,       label: '30 Min Delivery', color: 'text-orange-400',  bg: 'rgba(255,87,34,0.1)' },
                { icon: ShieldCheck, label: 'Hygiene Verified', color: 'text-emerald-400', bg: 'rgba(0,230,118,0.1)' },
                { icon: ThumbsUp,    label: 'No Min. Order',    color: 'text-blue-400',    bg: 'rgba(100,181,246,0.1)' },
                { icon: Star,        label: '4.8★ Rated',       color: 'text-amber-400',   bg: 'rgba(255,193,7,0.1)', fill: true },
              ].map(({ icon: Icon, label, color, bg, fill }) => (
                <div key={label} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                    <Icon className={`w-3.5 h-3.5 ${color} ${fill ? 'fill-current' : ''}`} />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2 animate-fade-up delay-500">
              <a href="#restaurants"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:-translate-y-0.5 btn-press">
                <Zap className="w-4 h-4" fill="currentColor" /> Order Now <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3.5 rounded-2xl border border-white/10 text-slate-300 hover:bg-white/[0.05] hover:border-white/20 hover:text-white transition-all duration-300 btn-press">
                How It Works
              </a>
            </div>
          </div>

          {/* ── RIGHT: Visual ── */}
          <div className="hidden lg:block lg:col-span-5 relative animate-slide-right delay-300">
            <div className="relative ml-auto w-full max-w-sm">

              {/* Main card */}
              <div
                className="rounded-3xl p-4 border border-white/[0.08] shadow-2xl space-y-3 animate-float-slow"
                style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(24px)' }}
              >
                <div className="relative h-60 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="badge-fire flex items-center gap-1">🔥 Trending Today</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center px-3 py-2.5 rounded-xl"
                    style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div>
                      <p className="font-bold text-sm text-white">Gourmet Burger Combo</p>
                      <p className="text-xs text-slate-400">Taco Town & Burgers</p>
                    </div>
                    <span className="font-extrabold text-base gradient-text">₹249</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[{ label: 'Restaurants', value: '500+' }, { label: 'Avg. Time', value: '28 min' }, { label: 'Happy Users', value: '50K+' }].map(({ label, value }) => (
                    <div key={label} className="text-center py-2.5 rounded-xl border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="font-black text-white text-base">{value}</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge 1 */}
              <div className="absolute -top-5 -left-8 bg-[#1a1a1f] border border-white/[0.1] p-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-float" style={{ animationDuration: '4s' }}>
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-xl">🍕</div>
                <div>
                  <p className="font-bold text-xs text-white">Hot & Fresh</p>
                  <p className="text-[10px] text-slate-500">From ₹149</p>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute -bottom-5 -right-6 bg-[#1a1a1f] border border-white/[0.1] p-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-float" style={{ animationDuration: '5.5s', animationDelay: '1s' }}>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">🍛</div>
                <div>
                  <p className="font-bold text-xs text-white">Malabar Biryani</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <p className="text-[10px] text-emerald-400 font-semibold">4.8 Rating</p>
                  </div>
                </div>
              </div>

              {/* Pulsing ring */}
              <div className="absolute -inset-4 rounded-3xl opacity-30 animate-glow-pulse pointer-events-none" style={{ border: '1px solid rgba(255,87,34,0.4)' }} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 hover:opacity-60 transition-opacity cursor-pointer animate-bounce"
          onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-white text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
