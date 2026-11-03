import React, { useState, useEffect } from 'react';
import { SearchX, Flame, Sparkles } from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import { restaurants as mockRestaurants } from '../data/mockData';

export default function RestaurantList({ activeCategory }) {
  const [restaurantList, setRestaurantList] = useState(mockRestaurants);
  const [hasLive, setHasLive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/restaurants`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        return res.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Merge seller restaurants with mock restaurants (seller restaurants first)
          setRestaurantList([...data, ...mockRestaurants]);
          setHasLive(true);
        }
      })
      .catch(() => {
        // Fallback to mock data gracefully
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRestaurants = activeCategory
    ? restaurantList.filter((restaurant) => {
        const tags = Array.isArray(restaurant.tags)
          ? restaurant.tags
          : typeof restaurant.tags === "string"
          ? restaurant.tags.split(",")
          : [];
        return tags.some((tag) => tag.trim().toLowerCase() === activeCategory.toLowerCase());
      })
    : restaurantList;

  return (
    <section className="py-8 w-full px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#004B49] fill-[#004B49]" />
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Top Restaurants Near You
            </h2>
            {hasLive && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#005C5E] bg-[#f0f9f9] border border-[#bce5e4] px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#004B49]" />
                Live Partners Active
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {activeCategory 
              ? `Showing top places serving ${activeCategory}` 
              : 'Explore top rated dining spots in Kannur'}
          </p>
        </div>

        <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full w-max">
          {filteredRestaurants.length} Restaurants Available
        </div>
      </div>
      
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id || restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-[#dcf2f2] text-[#004B49] rounded-full flex items-center justify-center mb-4 shadow-inner">
            <SearchX className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-1">No restaurants found</h3>
          <p className="text-sm text-gray-500 max-w-md">
            We couldn't find any restaurants matching "{activeCategory}". Try selecting another cuisine from above.
          </p>
        </div>
      )}
    </section>
  );
}
