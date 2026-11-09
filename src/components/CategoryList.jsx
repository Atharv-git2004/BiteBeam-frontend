import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { categories } from '../data/mockData';

export default function CategoryList({ activeCategory, onCategorySelect }) {
  const scrollContainerRef = useRef(null);

  const scroll = (dir) => {
    scrollContainerRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div id="categories" className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 bg-[#09090b]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 reveal">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            What's on your mind?
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Explore top cuisines and dishes near you
          </p>
        </div>
        {activeCategory && (
          <button
            onClick={() => onCategorySelect(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-full transition-all duration-200 border border-orange-500/20 btn-press animate-pop-in"
          >
            <X className="w-3.5 h-3.5" /> {activeCategory}
          </button>
        )}
      </div>

      {/* Scroll container */}
      <div className="relative reveal">
        <button onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#1a1a1f] border border-white/[0.08] hidden md:flex items-center justify-center hover:bg-orange-500/15 hover:border-orange-500/30 text-slate-400 hover:text-orange-400 transition-all duration-200 btn-press shadow-xl"
          aria-label="Scroll left">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div ref={scrollContainerRef}
          className="flex items-start overflow-x-auto gap-3 pb-2 scroll-smooth hide-scrollbar">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect(isActive ? null : cat.name)}
                style={{ animationDelay: `${idx * 35}ms` }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-250 btn-press animate-fade-up ${
                  isActive
                    ? 'bg-gradient-to-b from-orange-500/20 to-amber-500/10 border border-orange-500/30 shadow-lg shadow-orange-500/10 scale-105'
                    : 'bg-[#111113] border border-white/[0.06] hover:border-orange-500/20 hover:bg-orange-500/[0.05] hover:-translate-y-1'
                }`}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-200 hover:scale-110 ${
                  isActive ? 'bg-orange-500/15 shadow-inner' : 'bg-[#1a1a1f] border border-white/[0.05]'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-xs sm:text-sm font-bold tracking-tight text-center leading-tight max-w-[72px] ${
                  isActive ? 'text-orange-400' : 'text-slate-400'
                }`}>
                  {cat.name}
                </span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />}
              </button>
            );
          })}
        </div>

        <button onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#1a1a1f] border border-white/[0.08] hidden md:flex items-center justify-center hover:bg-orange-500/15 hover:border-orange-500/30 text-slate-400 hover:text-orange-400 transition-all duration-200 btn-press shadow-xl"
          aria-label="Scroll right">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
