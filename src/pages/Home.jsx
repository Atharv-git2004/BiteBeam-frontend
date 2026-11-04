import React, { useState, useEffect, useRef } from 'react';
import {
  Tag, TrendingUp, Search, CreditCard, Truck, Percent,
  Sparkles, RefreshCw, ArrowRight, Flame, Star, Zap,
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CategoryList from '../components/CategoryList';
import RestaurantList from '../components/RestaurantList';
import DishCard from '../components/DishCard';
import { offers, popularDishes as mockPopularDishes, restaurants } from '../data/mockData';
import useScrollReveal from '../hooks/useScrollReveal';

// Dish skeleton
function DishSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="flex gap-0">
        <div className="flex-1 p-4 space-y-3">
          <div className="flex gap-1.5">
            <div className="w-4 h-4 skeleton rounded-sm" />
            <div className="w-16 h-4 skeleton rounded-md" />
          </div>
          <div className="h-5 skeleton rounded-lg w-3/4" />
          <div className="h-5 skeleton rounded-lg w-1/4" />
          <div className="h-3 skeleton rounded-lg w-full" />
          <div className="h-3 skeleton rounded-lg w-2/3" />
          <div className="h-8 skeleton rounded-xl w-24 mt-2" />
        </div>
        <div className="w-32 p-4">
          <div className="w-full h-28 skeleton rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [dishes, setDishes]                 = useState([]);
  const [loadingDishes, setLoadingDishes]   = useState(true);
  const [isLiveFromDB, setIsLiveFromDB]     = useState(false);

  // Activate scroll-reveal on every render cycle
  useScrollReveal();

  const fetchDishes = async () => {
    setLoadingDishes(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dishes`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setDishes(data);
        setIsLiveFromDB(true);
      } else {
        setDishes(mockPopularDishes);
        setIsLiveFromDB(false);
      }
    } catch {
      setDishes(mockPopularDishes);
      setIsLiveFromDB(false);
    } finally {
      setLoadingDishes(false);
    }
  };

  useEffect(() => { fetchDishes(); }, []);

  const getRestaurantName = (rId) => {
    const r = restaurants.find((x) => x.id === rId);
    return r ? r.name : '';
  };

  const displayedDishes = activeCategory
    ? dishes.filter((d) => {
        const cat  = (d.category || '').toLowerCase();
        const name = (d.name || '').toLowerCase();
        const target = activeCategory.toLowerCase();
        return cat.includes(target) || name.includes(target);
      })
    : dishes;

  return (
    <div className="page-transition min-h-screen bg-white">

      {/* 1. HERO */}
      <HeroSection />

      {/* 2. CATEGORIES */}
      <section className="bg-white border-b border-gray-100/60">
        <CategoryList activeCategory={activeCategory} onCategorySelect={setActiveCategory} />
      </section>

      {/* 3. OFFERS CAROUSEL */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-10">
        <div className="flex items-center justify-between mb-6 reveal">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
              <Percent className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Best Offers For You
              </h2>
              <p className="text-xs text-gray-500 font-medium">Swipe to explore exclusive deals</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full">
            <Flame className="w-3.5 h-3.5 fill-orange-500" /> Hot Deals
          </span>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-5 pb-4">
          {offers.map((offer, idx) => (
            <div
              key={offer.id}
              className={`min-w-[300px] sm:min-w-[340px] rounded-3xl p-6 text-white bg-gradient-to-br ${offer.bgGradient} shadow-xl relative overflow-hidden flex flex-col justify-between group shine card-hover reveal`}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-2xl bg-white/10 -mr-10 -mt-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-xl bg-black/10 -ml-6 -mb-6 pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3 h-3" /> Special Promo
                </div>
                <h3 className="text-2xl font-black mb-1 leading-tight">{offer.title}</h3>
                <p className="text-sm opacity-90 font-medium mb-5">{offer.description}</p>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-xs font-semibold opacity-80">Use Code:</span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-white text-gray-900 rounded-xl text-xs font-black tracking-widest shadow-md">
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
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 bg-gray-50/50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 reveal">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#004B49] to-[#005C5E] flex items-center justify-center shadow-md">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Popular Dishes
              </h2>
              {isLiveFromDB && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#005C5E] bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live Menu
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {activeCategory
                ? `Showing dishes in "${activeCategory}"`
                : 'Handpicked by our partner restaurants and home chefs'}
            </p>
          </div>

          <button
            onClick={fetchDishes}
            disabled={loadingDishes}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#004B49] bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3.5 py-2 rounded-xl transition-all shadow-sm btn-press disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDishes ? 'animate-spin' : ''}`} />
            Refresh Menu
          </button>
        </div>

        {loadingDishes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {Array.from({ length: 6 }).map((_, i) => <DishSkeleton key={i} />)}
          </div>
        ) : displayedDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {displayedDishes.map((dish, idx) => {
              const dishId   = dish._id || dish.id;
              const restId   = dish.restaurant?._id || dish.restaurant?.id || dish.restaurantId;
              const restName = dish.restaurant?.name || dish.restaurantName || getRestaurantName(dish.restaurantId);
              return (
                <div
                  key={dishId}
                  className="reveal"
                  style={{ transitionDelay: `${Math.min(idx * 60, 360)}ms` }}
                >
                  <DishCard dish={dish} restaurantId={restId} restaurantName={restName} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-brand-200/60 reveal">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-gray-600 font-semibold">No dishes found in this category.</p>
            <button
              onClick={() => setActiveCategory(null)}
              className="mt-3 text-sm text-[#005C5E] font-bold hover:underline btn-press"
            >
              Clear Filter →
            </button>
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-t border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-xl mx-auto mb-14 reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-[#004B49] text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5" fill="currentColor" /> Simple & Fast
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-3">
              How BiteBeam Works
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Getting your favourite food delivered is as easy as 1-2-3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200" />

            {[
              { icon: Search,     step: '1', title: 'Choose Your Dish',  desc: 'Browse thousands of menus from top local restaurants and home chefs.', color: 'from-[#004B49] to-[#005C5E]' },
              { icon: CreditCard, step: '2', title: 'Easy Payment',      desc: 'Pay seamlessly via UPI, Cards, Net Banking, or Cash on Delivery.',     color: 'from-orange-500 to-red-500' },
              { icon: Truck,      step: '3', title: 'Fast Delivery',     desc: 'Track your rider in real time as your food arrives steaming hot.',      color: 'from-green-500 to-emerald-600' },
            ].map(({ icon: Icon, step, title, desc, color }, idx) => (
              <div
                key={step}
                className="relative bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center card-hover reveal"
                style={{ transitionDelay: `${idx * 120}ms` }}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-brand-200 flex items-center justify-center text-xs font-black text-[#004B49] shadow-md">
                  {step}
                </div>

                <div className={`w-16 h-16 bg-gradient-to-br ${color} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-16 reveal">
        <div
          className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center noise-overlay animate-gradient"
          style={{
            background: 'linear-gradient(135deg, #003837 0%, #004B49 40%, #005C5E 70%, #007a78 100%)',
            backgroundSize: '300% 300%',
          }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #8ed3d1 0%, transparent 50%), radial-gradient(circle at 80% 50%, #4bb5b3 0%, transparent 50%)' }} />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 text-white/80 text-xs font-bold uppercase tracking-wider mb-5"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <Sparkles className="w-3.5 h-3.5 text-[#8ed3d1] animate-pulse" /> Start Ordering Today
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Craving something<br />
              <span style={{ background: 'linear-gradient(90deg, #8ed3d1, #dcf2f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                delicious?
              </span>
            </h2>
            <p className="text-[#bce5e4] text-base sm:text-lg font-medium mb-8 max-w-md mx-auto">
              Join 50,000+ happy customers ordering daily on BiteBeam.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#restaurants"
                className="inline-flex items-center gap-2 bg-white text-[#004B49] font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 btn-press">
                <Zap className="w-4 h-4" fill="currentColor" /> Order Now
              </a>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3.5 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-200 btn-press"
                style={{ backdropFilter: 'blur(8px)' }}>
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
