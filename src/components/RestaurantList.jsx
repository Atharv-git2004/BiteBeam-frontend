import React, { useState, useEffect, useRef } from 'react';
import { SearchX, Flame, Sparkles, ChevronRight } from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import { restaurants as mockRestaurants } from '../data/mockData';

function RestaurantSkeleton() {
  return (
    <div className="bg-[#111113] rounded-[20px] border border-[#1f1f28] overflow-hidden">
      <div className="h-44 skeleton rounded-t-[20px]" />
      <div className="p-4 space-y-3 bg-[#111113]">
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
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
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
      .catch(() => { if (isMounted) setRestaurantList(mockRestaurants); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  /* Staggered reveal */
  useEffect(() => {
    if (loading || !containerRef.current) return;
    const cards    = containerRef.current.querySelectorAll('.restaurant-card-item');
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }); },
      { threshold: 0.08 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [loading, restaurantList, activeCategory]);

  const filtered = activeCategory
    ? restaurantList.filter((r) => {
        const tags = Array.isArray(r.tags) ? r.tags : typeof r.tags === 'string' ? r.tags.split(',') : [];
        return tags.some((t) => t.trim().toLowerCase() === activeCategory.toLowerCase());
      })
    : restaurantList;

  return (
    <section id="restaurants" className="py-10 w-full px-4 sm:px-6 lg:px-8 xl:px-12 bg-[#09090b]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 reveal">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Flame className="w-4 h-4 text-white fill-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Top Restaurants Near You
            </h2>
            {hasLive && (
              <span className="hidden sm:flex items-center gap-1 badge-neon">
                <Sparkles className="w-3 h-3" /> Live
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium">
            {activeCategory ? `Showing top places serving ${activeCategory}` : 'Explore top-rated dining spots in Kannur'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
            {loading ? '...' : `${filtered.length} Available`}
          </span>
          <button className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 px-3 py-1.5 rounded-full transition-colors btn-press">
            See all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 w-full">
          {Array.from({ length: 8 }).map((_, i) => <RestaurantSkeleton key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 w-full">
          {filtered.map((r, idx) => (
            <div
              key={r._id || r.id}
              className="restaurant-card-item reveal"
              style={{ transitionDelay: `${Math.min(idx * 55, 400)}ms` }}
            >
              <RestaurantCard restaurant={r} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#111113] rounded-3xl border border-dashed border-orange-500/15 reveal">
          <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/15 rounded-2xl flex items-center justify-center mb-5">
            <SearchX className="w-10 h-10 text-orange-400" />
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">No restaurants found</h3>
          <p className="text-sm text-slate-500 max-w-xs">No places match "{activeCategory}". Try a different cuisine above.</p>
        </div>
      )}
    </section>
  );
}
