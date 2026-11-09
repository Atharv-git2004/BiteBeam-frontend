import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Search, CreditCard, Truck, Percent,
  Sparkles, RefreshCw, ArrowRight, Flame, Star, Zap,
} from 'lucide-react';
import HeroSection    from '../components/HeroSection';
import CategoryList   from '../components/CategoryList';
import RestaurantList from '../components/RestaurantList';
import DishCard       from '../components/DishCard';
import { offers, popularDishes as mockPopularDishes, restaurants } from '../data/mockData';
import useScrollReveal from '../hooks/useScrollReveal';

/* Dark skeleton */
function DishSkeleton() {
  return (
    <div className="bg-[#111113] rounded-[20px] border border-[#1f1f28] flex overflow-hidden">
      <div className="flex-1 p-4 space-y-3">
        <div className="flex gap-1.5"><div className="w-4 h-4 skeleton rounded-sm" /><div className="w-16 h-4 skeleton rounded-md" /></div>
        <div className="h-5 skeleton rounded-lg w-3/4" />
        <div className="h-5 skeleton rounded-lg w-1/4" />
        <div className="h-3 skeleton rounded-lg w-full" />
        <div className="h-3 skeleton rounded-lg w-2/3" />
        <div className="h-8 skeleton rounded-xl w-24 mt-2" />
      </div>
      <div className="w-32 p-4"><div className="w-full h-28 skeleton rounded-2xl" /></div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [dishes, setDishes]                 = useState([]);
  const [loadingDishes, setLoadingDishes]   = useState(true);
  const [isLiveFromDB, setIsLiveFromDB]     = useState(false);

  useScrollReveal();

  const fetchDishes = async () => {
    setLoadingDishes(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dishes`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) { setDishes(data); setIsLiveFromDB(true); }
      else { setDishes(mockPopularDishes); setIsLiveFromDB(false); }
    } catch {
      setDishes(mockPopularDishes); setIsLiveFromDB(false);
    } finally {
      setLoadingDishes(false);
    }
  };

  useEffect(() => { fetchDishes(); }, []);

  const getRestaurantName = (rId) => restaurants.find((x) => x.id === rId)?.name || '';

  const displayedDishes = activeCategory
    ? dishes.filter((d) => {
        const cat  = (d.category || '').toLowerCase();
        const name = (d.name || '').toLowerCase();
        const target = activeCategory.toLowerCase();
        return cat.includes(target) || name.includes(target);
      })
    : dishes;

  return (
    <div className="page-transition min-h-screen bg-[#09090b]">

      {/* 1. HERO */}
      <HeroSection />

      {/* 2. CATEGORIES */}
      <section className="border-b border-white/[0.04]">
        <CategoryList activeCategory={activeCategory} onCategorySelect={setActiveCategory} />
      </section>

      {/* 3. OFFERS — Bento-style horizontal carousel */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-10 bg-[#09090b]">
        <div className="flex items-center justify-between mb-6 reveal">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Percent className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Best Offers For You</h2>
              <p className="text-xs text-slate-500 font-medium">Swipe to explore exclusive deals</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1 badge-fire">
            <Flame className="w-3 h-3 fill-current" /> Hot Deals
          </span>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4">
          {offers.map((offer, idx) => (
            <div
              key={offer.id}
              className={`min-w-[300px] sm:min-w-[340px] rounded-3xl p-6 text-white bg-gradient-to-br ${offer.bgGradient} relative overflow-hidden flex flex-col justify-between group shine card-hover reveal border border-white/10`}
              style={{ transitionDelay: `${idx * 70}ms` }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-2xl bg-white/10 -mr-10 -mt-10 pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
                  <Sparkles className="w-3 h-3" /> Special Promo
                </div>
                <h3 className="text-2xl font-black mb-1 leading-tight">{offer.title}</h3>
                <p className="text-sm opacity-80 font-medium mb-5">{offer.description}</p>
              </div>
              <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-xs font-semibold opacity-70">Use Code:</span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-xl text-xs font-black tracking-widest border border-white/20 shadow-sm">
                    {offer.code}
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RESTAURANTS */}
      <RestaurantList activeCategory={activeCategory} />

      {/* 5. DISHES GRID */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 bg-[#09090b] border-t border-white/[0.04]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 reveal">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Popular Dishes</h2>
              {isLiveFromDB && (
                <span className="hidden sm:flex items-center gap-1 badge-neon">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Menu
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {activeCategory ? `Showing dishes in "${activeCategory}"` : 'Handpicked by our partner restaurants and home chefs'}
            </p>
          </div>
          <button
            onClick={fetchDishes}
            disabled={loadingDishes}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 px-3.5 py-2 rounded-xl transition-all shadow-sm btn-press disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDishes ? 'animate-spin' : ''}`} />
            Refresh Menu
          </button>
        </div>

        {loadingDishes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {Array.from({ length: 6 }).map((_, i) => <DishSkeleton key={i} />)}
          </div>
        ) : displayedDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {displayedDishes.map((dish, idx) => {
              const dishId   = dish._id || dish.id;
              const restId   = dish.restaurant?._id || dish.restaurant?.id || dish.restaurantId;
              const restName = dish.restaurant?.name || dish.restaurantName || getRestaurantName(dish.restaurantId);
              return (
                <div key={dishId} className="reveal" style={{ transitionDelay: `${Math.min(idx * 55, 350)}ms` }}>
                  <DishCard dish={dish} restaurantId={restId} restaurantName={restName} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#111113] rounded-3xl border border-dashed border-orange-500/15 reveal">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-slate-400 font-semibold">No dishes found in this category.</p>
            <button onClick={() => setActiveCategory(null)} className="mt-3 text-sm text-orange-400 font-bold hover:underline btn-press">
              Clear Filter →
            </button>
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-t border-white/[0.04] bg-[#09090b]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-xl mx-auto mb-14 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" fill="currentColor" /> Simple & Fast
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">How BiteBeam Works</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Getting your favourite food delivered is as easy as 1-2-3</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {[
              { icon: Search,     step: '01', title: 'Choose Your Dish',  desc: 'Browse thousands of menus from top local restaurants and home chefs.', from: 'from-orange-500', to: 'to-amber-500' },
              { icon: CreditCard, step: '02', title: 'Easy Payment',      desc: 'Pay seamlessly via UPI, Cards, Net Banking, or Cash on Delivery.',     from: 'from-violet-500', to: 'to-blue-500' },
              { icon: Truck,      step: '03', title: 'Fast Delivery',     desc: 'Track your rider in real time as your food arrives steaming hot.',      from: 'from-emerald-500', to: 'to-teal-500' },
            ].map(({ icon: Icon, step, title, desc, from, to }, idx) => (
              <div key={step} className="relative bento-card p-8 text-center reveal" style={{ transitionDelay: `${idx * 120}ms` }}>
                {/* Step label */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black text-slate-700 tracking-widest">{step}</div>

                <div className={`w-16 h-16 bg-gradient-to-br ${from} ${to} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-base font-black text-white mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 bg-[#09090b] reveal">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center mesh-bg noise-overlay border border-white/[0.06]"
          style={{ background: '#111113' }}>
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(255,87,34,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(255,152,0,0.2) 0%, transparent 60%)' }} />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 text-xs font-bold uppercase tracking-wider text-orange-400 mb-5"
              style={{ background: 'rgba(255,87,34,0.08)' }}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Start Ordering Today
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Craving something<br />
              <span className="gradient-text">delicious?</span>
            </h2>
            <p className="text-slate-500 text-base sm:text-lg font-medium mb-8 max-w-md mx-auto">
              Join 50,000+ happy customers ordering daily on BiteBeam.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#restaurants"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-200 hover:-translate-y-0.5 btn-press">
                <Zap className="w-4 h-4" fill="currentColor" /> Order Now
              </a>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3.5 rounded-2xl border border-white/10 text-slate-400 hover:bg-white/[0.05] hover:text-white hover:border-white/20 transition-all duration-200 btn-press">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
