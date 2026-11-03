import React, { useState, useEffect } from 'react';
import { Tag, TrendingUp, Search, CreditCard, Truck, Percent, Sparkles, RefreshCw } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CategoryList from '../components/CategoryList';
import RestaurantList from '../components/RestaurantList';
import DishCard from '../components/DishCard';
import { offers, popularDishes as mockPopularDishes, restaurants } from '../data/mockData';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [isLiveFromDB, setIsLiveFromDB] = useState(false);

  // Fetch live active dishes from MongoDB backend API
  const fetchDishes = async () => {
    setLoadingDishes(true);
    try {
      const response = await fetch("http://localhost:5000/api/dishes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // Successfully loaded live seller dishes from MongoDB
        setDishes(data);
        setIsLiveFromDB(true);
      } else {
        // No dishes in MongoDB yet; fall back gracefully to mock dishes
        setDishes(mockPopularDishes);
        setIsLiveFromDB(false);
      }
    } catch (err) {
      console.warn("Backend dishes endpoint unavailable, using mock dishes:", err.message);
      setDishes(mockPopularDishes);
      setIsLiveFromDB(false);
    } finally {
      setLoadingDishes(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant ? restaurant.name : '';
  };

  // Filter dishes by active category if selected
  const displayedDishes = activeCategory
    ? dishes.filter((dish) => {
        const cat = dish.category || "";
        const name = dish.name || "";
        const target = activeCategory.toLowerCase();
        return cat.toLowerCase().includes(target) || name.toLowerCase().includes(target);
      })
    : dishes;

  return (
    <div className="page-transition min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CATEGORY SELECTION */}
      <section className="bg-white">
        <CategoryList activeCategory={activeCategory} onCategorySelect={setActiveCategory} />
      </section>

      {/* 3. OFFERS CAROUSEL */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Percent className="text-[#004B49] w-6 h-6" />
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Best Offers For You</h2>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Swipe to explore</span>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-4">
          {offers.map(offer => (
            <div 
              key={offer.id} 
              className={`min-w-[320px] rounded-3xl p-6 text-white bg-gradient-to-r ${offer.bgGradient} shadow-xl relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8"></div>
              
              <div>
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  Special Promo
                </div>
                <h3 className="text-2xl font-black mb-1">{offer.title}</h3>
                <p className="text-sm opacity-90 font-medium mb-4">{offer.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-xs font-semibold opacity-80">Use Code:</span>
                <span className="px-3 py-1 bg-white text-gray-900 rounded-xl text-xs font-extrabold tracking-wider shadow-sm">
                  {offer.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. RESTAURANT GRID */}
      <RestaurantList activeCategory={activeCategory} />

      {/* 5. POPULAR & SELLER DISHES GRID */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#dcf2f2] text-[#004B49] rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {activeCategory ? `${activeCategory} Specials` : "Popular Right Now"}
                </h2>
                {isLiveFromDB && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Kitchen Items
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {activeCategory
                  ? `Showing top delicious ${activeCategory} dishes`
                  : "Freshly curated dishes added by our partner restaurants and home chefs"}
              </p>
            </div>
          </div>

          <button
            onClick={fetchDishes}
            disabled={loadingDishes}
            title="Refresh Dishes from Backend"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#004B49] bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDishes ? "animate-spin" : ""}`} />
            <span>Refresh Menu</span>
          </button>
        </div>

        {/* LOADING SKELETON */}
        {loadingDishes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="flex gap-4 p-4 border border-gray-100 rounded-2xl animate-pulse bg-gray-50">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="w-28 h-28 bg-gray-200 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : displayedDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full">
            {displayedDishes.map((dish) => {
              const dishId = dish._id || dish.id;
              const restId = dish.restaurant?._id || dish.restaurant?.id || dish.restaurantId;
              const restName = dish.restaurant?.name || dish.restaurantName || getRestaurantName(dish.restaurantId);

              return (
                <DishCard
                  key={dishId}
                  dish={dish}
                  restaurantId={restId}
                  restaurantName={restName}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No dishes found in this category.</p>
            <button
              onClick={() => setActiveCategory(null)}
              className="mt-3 text-sm text-[#005C5E] font-bold hover:underline"
            >
              Clear Category Filter
            </button>
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="bg-gray-50/80 py-16 border-t border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">How BiteBeam Works</h2>
            <p className="text-gray-500 font-medium">Getting your favorite food delivered is easy as 1-2-3</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-[#dcf2f2] text-[#004B49] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Choose Your Dish</h3>
              <p className="text-gray-500 text-sm">Browse thousands of menus from top local restaurants and home chefs.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-[#dcf2f2] text-[#004B49] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Easy Payment</h3>
              <p className="text-gray-500 text-sm">Pay seamlessly via UPI, Cards, Net Banking, or Cash on Delivery.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-[#dcf2f2] text-[#004B49] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Fast Delivery</h3>
              <p className="text-gray-500 text-sm">Track your rider in real time as your food arrives steaming hot.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
