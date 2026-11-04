import React, { useState, useEffect, useRef } from 'react';
import { SearchX, Flame, Sparkles, ChevronRight } from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import { restaurants as mockRestaurants } from '../data/mockData';

// Skeleton card for loading state
function RestaurantSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="h-44 skeleton" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 skeleton rounded-lg w-2/3" />
          <div className="h-5 w-10 skeleton rounded-lg" />
        </div>
        <div className="h-3 skeleton rounded-lg w-1/2" />
        <div className="h-3 skeleton rounded-lg w-3/4 mt-3" />
      </div>
    </div>
  );
}

export default function RestaurantList({ activeCategory }) {
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading]              = useState(true);
  const [hasLive, setHasLive]              = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/restaurants`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setRestaurantList([...data, ...mockRestaurants]);
            setHasLive(true);
          } else {
            setRestaurantList(mockRestaurants);
          }
        }
      })
      .catch(() => {
        if (isMounted) setRestaurantList(mockRestaurants);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  /* Staggered reveal for cards */
  useEffect(() => {
    if (loading || !containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.restaurant-card-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [loading, restaurantList, activeCategory]);

  const filteredRestaurants = activeCategory
    ? restaurantList.filter((r) => {
        const tags = Array.isArray(r.tags)
          ? r.tags
          : typeof r.tags === 'string'
          ? r.tags.split(',')
          : [];
        return tags.some((t) => t.trim().toLowerCase() === activeCategory.toLowerCase());
      })
    : restaurantList;

  return (
    <section id="restaurants" className="py-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 reveal">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#004B49] to-[#005C5E] flex items-center justify-center shadow-md">
              <Flame className="w-4 h-4 text-white fill-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Top Restaurants Near You
            </h2>
            {hasLive && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#005C5E] bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#004B49]" />
                Live Partners
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium">
            {activeCategory
              ? `Showing top places serving ${activeCategory}`
              : 'Explore top-rated dining spots in Kannur'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            {loading ? '...' : `${filteredRestaurants.length} Available`}
          </span>
          <button className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#004B49] bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3 py-1.5 rounded-full transition-colors btn-press">
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 w-full">
          {Array.from({ length: 8 }).map((_, i) => <RestaurantSkeleton key={i} />)}
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 w-full"
        >
          {filteredRestaurants.map((restaurant, idx) => (
            <div
              key={restaurant._id || restaurant.id}
              className="restaurant-card-item reveal"
              style={{ transitionDelay: `${Math.min(idx * 60, 400)}ms` }}
            >
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gradient-to-br from-gray-50 to-brand-50/30 rounded-3xl border border-dashed border-brand-200/60 reveal">
          <div className="w-20 h-20 bg-brand-100 text-[#004B49] rounded-2xl flex items-center justify-center mb-5 shadow-inner">
            <SearchX className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            No places match "{activeCategory}". Try a different cuisine above.
          </p>
        </div>
      )}
    </section>
  );
}
