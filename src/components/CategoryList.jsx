import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { categories } from '../data/mockData';

export default function CategoryList({ activeCategory, onCategorySelect }) {
  const scrollContainerRef = useRef(null);

  const scroll = (dir) => {
    scrollContainerRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div id="categories" className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 bg-[#FAF7F2]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 reveal">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1C1410] tracking-tight">
            What's on your mind?
          </h2>
          <p className="text-sm text-[#A5A79B] font-medium mt-0.5">
            Explore top cuisines and dishes near you
          </p>
        </div>
        {activeCategory && (
          <button
            onClick={() => onCategorySelect(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#590907] bg-[#590907]/10 hover:bg-[#590907]/20 px-3 py-1.5 rounded-full transition-all duration-200 border border-[#590907]/20 btn-press animate-pop-in"
          >
            <X className="w-3.5 h-3.5" /> {activeCategory}
          </button>
        )}
      </div>

      {/* Scroll container */}
      <div className="relative reveal">
        <button onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#F5EFE4] border border-[#D8CEBA] hidden md:flex items-center justify-center hover:bg-[#590907]/10 hover:border-[#590907]/30 text-[#A5A79B] hover:text-[#590907] transition-all duration-200 btn-press shadow-lg"
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
                    ? 'bg-gradient-to-b from-[#590907]/15 to-[#590907]/05 border border-[#590907]/30 shadow-lg shadow-[#590907]/10 scale-105'
                    : 'bg-[#F5EFE4] border border-[#D8CEBA] hover:border-[#590907]/20 hover:bg-[#590907]/[0.04] hover:-translate-y-1'
                }`}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-200 hover:scale-110 ${
                  isActive ? 'bg-[#590907]/10 shadow-inner' : 'bg-[#FAF7F2] border border-[#D8CEBA]/60'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-xs sm:text-sm font-bold tracking-tight text-center leading-tight max-w-[72px] ${
                  isActive ? 'text-[#590907]' : 'text-[#4A443C]'
                }`}>
                  {cat.name}
                </span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#590907] animate-pulse" />}
              </button>
            );
          })}
        </div>

        <button onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#F5EFE4] border border-[#D8CEBA] hidden md:flex items-center justify-center hover:bg-[#590907]/10 hover:border-[#590907]/30 text-[#A5A79B] hover:text-[#590907] transition-all duration-200 btn-press shadow-lg"
          aria-label="Scroll right">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
