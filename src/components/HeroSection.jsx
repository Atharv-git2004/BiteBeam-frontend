import React from 'react';
import SearchBar from './SearchBar';
import { Sparkles, Clock, ShieldCheck, ThumbsUp, ArrowRight, Star, ChevronDown, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 'clamp(520px, 65vw, 740px)' }}>

      {/* ── Warm sage gradient base ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5E605A] via-[#8E9085] to-[#A5A79B]" />

      {/* ── Accent orbs ── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #590907 0%, transparent 65%)', transform: 'translate(35%, -35%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, #E8D2B5 0%, transparent 65%)', transform: 'translate(-35%, 35%)' }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #590907 0%, transparent 65%)', transform: 'translate(-50%, -50%)' }} />

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(232,210,181,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── LEFT ── */}
          <div className="lg:col-span-7 flex flex-col space-y-6">

            {/* Pill */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E8D2B5]/40 text-sm font-semibold w-max"
                style={{ background: 'rgba(232,210,181,0.12)', backdropFilter: 'blur(12px)' }}>
                <Sparkles className="w-4 h-4 text-[#E8D2B5] animate-pulse" />
                <span className="text-[#E8D2B5]">Lightning-Fast Food Delivery</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Headline */}
            <div className="animate-fade-up delay-100">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.03] text-white">
                Hungry?{' '}<br />
                <span className="text-[#E8D2B5]">Good things</span>
                <br />
                are on the way.
              </h1>
            </div>

            {/* Sub */}
            <p className="text-[#D8CEBA] text-base sm:text-lg max-w-xl font-medium leading-relaxed animate-fade-up delay-200">
              Order from 500+ top restaurants, local favourites, and home chefs in Kannur with real-time GPS tracking.
            </p>

            {/* Search */}
            <div className="pt-1 pb-2 animate-fade-up delay-300">
              <SearchBar variant="hero" />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 pt-1 animate-fade-up delay-400">
              {[
                { icon: Clock,       label: '30 Min Delivery', color: 'text-[#E8D2B5]',  bg: 'rgba(232,210,181,0.12)' },
                { icon: ShieldCheck, label: 'Hygiene Verified', color: 'text-emerald-300', bg: 'rgba(52,211,153,0.12)' },
                { icon: ThumbsUp,    label: 'No Min. Order',    color: 'text-sky-300',    bg: 'rgba(125,211,252,0.12)' },
                { icon: Star,        label: '4.8★ Rated',       color: 'text-amber-300',   bg: 'rgba(252,211,77,0.12)', fill: true },
              ].map(({ icon: Icon, label, color, bg, fill }) => (
                <div key={label} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#D8CEBA]/80">
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#590907] to-[#780F0E] hover:from-[#6B0A08] hover:to-[#8C1210] text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-[#590907]/30 hover:shadow-[#590907]/50 transition-all duration-300 hover:-translate-y-0.5 btn-press">
                <Zap className="w-4 h-4" fill="currentColor" /> Order Now <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3.5 rounded-2xl border border-[#E8D2B5]/30 text-[#E8D2B5] hover:bg-white/[0.08] hover:border-[#E8D2B5]/50 hover:text-white transition-all duration-300 btn-press">
                How It Works
              </a>
            </div>
          </div>

          {/* ── RIGHT: Visual ── */}
          <div className="hidden lg:block lg:col-span-5 relative animate-slide-right delay-300">
            <div className="relative ml-auto w-full max-w-sm">

              {/* Main card */}
              <div
                className="rounded-3xl p-4 border border-[#E8D2B5]/20 shadow-2xl space-y-3 animate-float-slow"
                style={{ background: 'rgba(232,210,181,0.08)', backdropFilter: 'blur(24px)' }}
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
                    style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(232,210,181,0.15)' }}>
                    <div>
                      <p className="font-bold text-sm text-white">Gourmet Burger Combo</p>
                      <p className="text-xs text-[#D8CEBA]/70">Taco Town & Burgers</p>
                    </div>
                    <span className="font-extrabold text-base text-[#E8D2B5]">₹249</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[{ label: 'Restaurants', value: '500+' }, { label: 'Avg. Time', value: '28 min' }, { label: 'Happy Users', value: '50K+' }].map(({ label, value }) => (
                    <div key={label} className="text-center py-2.5 rounded-xl border border-[#E8D2B5]/10" style={{ background: 'rgba(232,210,181,0.06)' }}>
                      <p className="font-black text-white text-base">{value}</p>
                      <p className="text-[10px] text-[#D8CEBA]/60 font-semibold">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge 1 */}
              <div className="absolute -top-5 -left-8 bg-[#F5EFE4] border border-[#D8CEBA] p-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-float" style={{ animationDuration: '4s' }}>
                <div className="w-9 h-9 rounded-xl bg-[#590907]/10 border border-[#590907]/20 flex items-center justify-center text-xl">🍕</div>
                <div>
                  <p className="font-bold text-xs text-[#1C1410]">Hot & Fresh</p>
                  <p className="text-[10px] text-[#A5A79B]">From ₹149</p>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute -bottom-5 -right-6 bg-[#F5EFE4] border border-[#D8CEBA] p-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-float" style={{ animationDuration: '5.5s', animationDelay: '1s' }}>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">🍛</div>
                <div>
                  <p className="font-bold text-xs text-[#1C1410]">Malabar Biryani</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <p className="text-[10px] text-emerald-600 font-semibold">4.8 Rating</p>
                  </div>
                </div>
              </div>

              {/* Pulsing ring */}
              <div className="absolute -inset-4 rounded-3xl opacity-25 animate-glow-pulse pointer-events-none" style={{ border: '1px solid rgba(89,9,7,0.5)' }} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 hover:opacity-60 transition-opacity cursor-pointer animate-bounce"
          onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[#E8D2B5] text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-[#E8D2B5]" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
