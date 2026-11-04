import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { categories } from '../data/mockData';

export default function CategoryList({ activeCategory, onCategorySelect }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id="categories" className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 reveal">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            What's on your mind?
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Explore top cuisines and dishes near you
          </p>
        </div>

        {activeCategory && (
          <button
            onClick={() => onCategorySelect(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#004B49] bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full transition-all duration-200 border border-brand-200 btn-press animate-pop-in"
          >
            <X className="w-3.5 h-3.5" />
            {activeCategory}
          </button>
        )}
      </div>

      {/* Scroll container */}
      <div className="relative reveal">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-9 h-9 shadow-lg border border-gray-100 hidden md:flex items-center justify-center hover:bg-[#004B49] hover:text-white text-gray-600 transition-all duration-200 btn-press"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex items-start overflow-x-auto gap-4 pb-2 scroll-smooth hide-scrollbar"
        >
          {categories.map((category, idx) => {
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(isActive ? null : category.name)}
                style={{ animationDelay: `${idx * 40}ms` }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-250 group/item btn-press animate-fade-up ${
                  isActive
                    ? 'bg-gradient-to-b from-[#004B49] to-[#005C5E] text-white shadow-lg shadow-[#004B49]/30 scale-105'
                    : 'bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-[#004B49] hover:-translate-y-1 hover:shadow-md'
                }`}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-200 group-hover/item:scale-110 ${
                  isActive ? 'bg-white/20 shadow-inner' : 'bg-white shadow-sm border border-gray-100'
                }`}>
                  {category.icon}
                </div>
                <span className={`text-xs sm:text-sm font-bold tracking-tight text-center leading-tight max-w-[72px] ${
                  isActive ? 'text-white' : 'text-gray-800'
                }`}>
                  {category.name}
                </span>

                {/* Active dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8ed3d1] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full w-9 h-9 shadow-lg border border-gray-100 hidden md:flex items-center justify-center hover:bg-[#004B49] hover:text-white text-gray-600 transition-all duration-200 btn-press"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
