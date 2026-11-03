import React from 'react';
import SearchBar from './SearchBar';
import { Sparkles, Clock, ShieldCheck, ThumbsUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-[#003837] via-[#004B49] to-[#005C5E] text-white overflow-hidden py-16 md:py-24 shadow-inner">
      {/* Background Glow Overlays in Dark Teal & Dark Cyan */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#8ed3d1]/15 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#002726]/50 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32"></div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold w-max shadow-sm">
              <Sparkles className="w-4 h-4 text-[#8ed3d1]" />
              <span>Lightning-Fast Food Delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none drop-shadow-sm">
              Hungry? <br />
              <span className="text-[#8ed3d1]">Good things</span> are on the way.
            </h1>

            {/* Subheading */}
            <p className="text-[#dcf2f2] text-base sm:text-lg max-w-2xl font-medium leading-relaxed">
              Order from over 500+ top restaurants, local favorites, and home chefs in Kannur with real-time tracking.
            </p>

            {/* Search Bar */}
            <div className="pt-2 pb-4">
              <SearchBar variant="hero" />
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-[#dcf2f2] font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8ed3d1]" />
                <span>30 Min Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8ed3d1]" />
                <span>Hygiene Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-[#8ed3d1]" />
                <span>No Min. Order</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN Showcase (5 cols on lg) */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative ml-auto w-full max-w-lg">
              {/* Main Food Card Visual */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl space-y-4 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80" 
                    alt="Featured Food"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#005C5E] text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                    🔥 Trending Today
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md p-3 rounded-xl text-white flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">Gourmet Burger Combo</p>
                      <p className="text-xs text-[#bce5e4]">Taco Town & Burgers</p>
                    </div>
                    <span className="font-extrabold text-base text-[#8ed3d1]">₹249</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div className="absolute -top-6 -left-6 bg-white text-gray-900 p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                <span className="text-2xl">🍕</span>
                <div>
                  <p className="font-bold text-xs">Hot & Fresh</p>
                  <p className="text-[10px] text-gray-500">From ₹149</p>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -bottom-6 -right-6 bg-white text-gray-900 p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '5s' }}>
                <span className="text-2xl">🍗</span>
                <div>
                  <p className="font-bold text-xs">Malabar Biryani</p>
                  <p className="text-[10px] text-[#005C5E] font-semibold">★ 4.8 Rating</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
