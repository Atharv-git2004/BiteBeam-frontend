import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { restaurants, popularDishes } from '../data/mockData';

const SearchBar = ({ variant = 'hero' }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 0);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
  };

  const isHero = variant === 'hero';
  const containerClass = isHero ? 'w-full max-w-xl relative' : 'w-64 relative';
  const inputClass = isHero
    ? 'w-full bg-white shadow-xl py-4 pl-14 pr-6 text-lg rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005C5E]'
    : 'w-full bg-gray-100 py-2 pl-10 pr-4 text-sm rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#005C5E]';
  
  const iconClass = isHero
    ? 'absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6'
    : 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4';

  const searchQuery = query.toLowerCase().trim();
  
  const filteredRestaurants = restaurants.filter(
    r => r.name.toLowerCase().includes(searchQuery) || 
         r.tags.some(tag => tag.toLowerCase().includes(searchQuery))
  ).slice(0, 4);

  const filteredDishes = popularDishes.filter(
    d => d.name.toLowerCase().includes(searchQuery) ||
         d.category.toLowerCase().includes(searchQuery)
  ).slice(0, 4);

  const hasResults = filteredRestaurants.length > 0 || filteredDishes.length > 0;

  return (
    <div className={containerClass} ref={dropdownRef}>
      <div className="relative">
        <Search className={iconClass} />
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => { if (query.length > 0) setShowResults(true); }}
          placeholder="Search for restaurants, cuisines, or dishes..."
          className={inputClass}
        />
      </div>

      {showResults && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto border border-gray-100">
          {!hasResults ? (
            <div className="p-6 text-center text-gray-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {filteredRestaurants.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Restaurants
                  </div>
                  {filteredRestaurants.map((restaurant) => (
                    <Link
                      key={restaurant.id}
                      to={`/restaurant/${restaurant.id}`}
                      onClick={handleResultClick}
                      className="flex flex-col px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-gray-900">{restaurant.name}</span>
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                          {restaurant.rating}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="truncate">{restaurant.tags.join(', ')}</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          {restaurant.time}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {filteredRestaurants.length > 0 && filteredDishes.length > 0 && (
                <div className="h-px bg-gray-100 my-2"></div>
              )}

              {filteredDishes.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Dishes
                  </div>
                  {filteredDishes.map((dish) => {
                    const restaurant = restaurants.find(r => r.id === dish.restaurantId);
                    return (
                      <Link
                        key={dish.id}
                        to={`/restaurant/${dish.restaurantId}`}
                        onClick={handleResultClick}
                        className="flex flex-col px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900">{dish.name}</span>
                          <span className="font-semibold text-gray-900">₹{dish.price}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          From {restaurant?.name || 'Restaurant'}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
