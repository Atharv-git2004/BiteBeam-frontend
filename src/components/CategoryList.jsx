import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '../data/mockData';

export default function CategoryList({ activeCategory, onCategorySelect }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            What's on your mind?
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Explore top cuisines and dishes near you
          </p>
        </div>

        {/* Action / Reset Filter */}
        {activeCategory && (
          <button 
            onClick={() => onCategorySelect(null)}
            className="text-xs font-bold text-[#004B49] bg-[#f0f9f9] hover:bg-[#dcf2f2] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-[#bce5e4]"
          >
            Clear Filter: <span className="underline">{activeCategory}</span> ✕
          </button>
        )}
      </div>
      
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2.5 shadow-lg border border-gray-100 hidden md:flex items-center justify-center hover:bg-[#004B49] hover:text-white text-gray-700 transition-all duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex items-center overflow-x-auto gap-6 pb-4 scroll-smooth hide-scrollbar"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.name;
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(isActive ? null : category.name)}
                className={`flex-shrink-0 flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-200 group/item ${
                  isActive 
                    ? 'bg-[#004B49] text-white shadow-lg shadow-[#004B49]/30 scale-105' 
                    : 'bg-gray-50 hover:bg-[#f0f9f9] text-gray-700 hover:text-[#004B49]'
                }`}
              >
                <div 
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-transform duration-200 group-hover/item:scale-110 ${
                    isActive ? 'bg-white/20' : 'bg-white shadow-sm'
                  }`}
                >
                  {category.icon}
                </div>
                <span className={`text-xs sm:text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-gray-800'}`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2.5 shadow-lg border border-gray-100 hidden md:flex items-center justify-center hover:bg-[#004B49] hover:text-white text-gray-700 transition-all duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
