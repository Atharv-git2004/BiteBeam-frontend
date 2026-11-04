import React from 'react';
import SearchBar from './SearchBar';
import { Sparkles, Clock, ShieldCheck, ThumbsUp, ArrowRight, Star, ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative w-full overflow-hidden noise-overlay" style={{ minHeight: 'clamp(480px, 60vw, 680px)' }}>
      {/* ── Background gradient ── */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: 'linear-gradient(135deg, #001f1e 0%, #003837 25%, #004B49 50%, #005C5E 75%, #007a78 100%)',
          backgroundSize: '300% 300%',
        }}
      />

      {/* ── Decorative orbs ── */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #4bb5b3 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, #007a78 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
      <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #dcf2f2 0%, transparent 70%)' }} />

      {/* ── Grid pattern overlay ── */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Text block ── */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            {/* Pill badge */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold w-max shadow-lg"
                style={{ background: 'rgba(255,255,255,0.1)' }}>
                <Sparkles className="w-4 h-4 text-[#8ed3d1] animate-pulse" />
                <span>Lightning-Fast Food Delivery</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
            </div>

            {/* Headline */}
            <div className="animate-fade-up delay-100">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-white drop-shadow-sm">
                Hungry?{' '}
                <br />
                <span className="relative inline-block">
                  <span style={{
                    background: 'linear-gradient(90deg, #8ed3d1 0%, #4bb5b3 50%, #dcf2f2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Good things
                  </span>
                </span>{' '}
                are on<br className="hidden sm:block" /> the way.
              </h1>
            </div>

            {/* Sub-heading */}
            <p className="text-[#bce5e4] text-base sm:text-lg max-w-xl font-medium leading-relaxed animate-fade-up delay-200">
              Order from 500+ top restaurants, local favourites, and home chefs in Kannur with real-time GPS tracking.
            </p>

            {/* Search */}
            <div className="pt-1 pb-2 animate-fade-up delay-300">
              <SearchBar variant="hero" />
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 pt-1 animate-fade-up delay-400">
              {[
                { icon: Clock,       label: '30 Min Delivery' },
                { icon: ShieldCheck, label: 'Hygiene Verified' },
                { icon: ThumbsUp,    label: 'No Min. Order' },
                { icon: Star,        label: '4.8★ Rated App', fill: true },
              ].map(({ icon: Icon, label, fill }) => (
                <div key={label} className="flex items-center gap-2 text-[#dcf2f2] text-xs sm:text-sm font-semibold">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(142,211,209,0.15)' }}>
                    <Icon className={`w-3.5 h-3.5 text-[#8ed3d1] ${fill ? 'fill-[#8ed3d1]' : ''}`} />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap gap-3 pt-2 animate-fade-up delay-500">
              <a
                href="#restaurants"
                className="inline-flex items-center gap-2 bg-white text-[#004B49] font-black text-sm px-5 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 btn-press"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 font-bold text-sm px-5 py-3 rounded-2xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300 btn-press"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                How It Works
              </a>
            </div>
          </div>

          {/* ── RIGHT: Visual card ── */}
          <div className="hidden lg:block lg:col-span-5 relative animate-slide-right delay-300">
            <div className="relative ml-auto w-full max-w-sm">
              {/* Main card */}
              <div
                className="shine rounded-3xl p-4 border border-white/20 shadow-2xl space-y-3 animate-float-slow"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
              >
                <div className="relative h-60 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"
                    alt="Featured Food"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                      🔥 Trending Today
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 backdrop-blur-md p-3 rounded-xl text-white flex justify-between items-center border border-white/10"
                    style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div>
                      <p className="font-bold text-sm">Gourmet Burger Combo</p>
                      <p className="text-xs text-[#bce5e4]">Taco Town & Burgers</p>
                    </div>
                    <span className="font-extrabold text-base text-[#8ed3d1]">₹249</span>
                  </div>
                </div>

                {/* Quick stats inside card */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Restaurants', value: '500+' },
                    { label: 'Avg. Time',   value: '28 min' },
                    { label: 'Happy Users', value: '50K+' },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <p className="font-black text-white text-base">{value}</p>
                      <p className="text-[10px] text-[#8ed3d1] font-semibold">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge 1 */}
              <div className="absolute -top-5 -left-8 bg-white text-gray-900 p-3 rounded-2xl shadow-2xl border border-gray-100/80 flex items-center gap-2.5 animate-float"
                style={{ animationDuration: '4s' }}>
                <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-xl">🍕</div>
                <div>
                  <p className="font-bold text-xs">Hot & Fresh</p>
                  <p className="text-[10px] text-gray-500">From ₹149</p>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute -bottom-5 -right-6 bg-white text-gray-900 p-3 rounded-2xl shadow-2xl border border-gray-100/80 flex items-center gap-2.5 animate-float"
                style={{ animationDuration: '5.5s', animationDelay: '1s' }}>
                <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-xl">🍛</div>
                <div>
                  <p className="font-bold text-xs">Malabar Biryani</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <p className="text-[10px] text-[#005C5E] font-semibold">4.8 Rating</p>
                  </div>
                </div>
              </div>

              {/* Pulsing ring on card */}
              <div className="absolute -inset-3 rounded-3xl opacity-20 animate-pulse-ring pointer-events-none" style={{ border: '2px solid #4bb5b3' }} />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50 hover:opacity-80 transition-opacity cursor-pointer animate-bounce"
          onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-white text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
