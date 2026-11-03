import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const restId = restaurant._id || restaurant.id;
  const tagsList = Array.isArray(restaurant.tags)
    ? restaurant.tags
    : typeof restaurant.tags === "string"
    ? restaurant.tags.split(",").map((t) => t.trim())
    : ["Multi-cuisine"];

  const defaultImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";

  return (
    <Link to={`/restaurant/${restId}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:shadow-xl shadow-sm border border-gray-100 flex flex-col h-full">
        {/* IMAGE CONTAINER */}
        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
          <img 
            src={restaurant.image || defaultImage} 
            alt={restaurant.name} 
            onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Featured / Live Seller Badge */}
          {restaurant.featured ? (
            <span className="absolute top-3 left-3 bg-[#004B49] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md tracking-wide">
              ★ Featured
            </span>
          ) : restaurant._id ? (
            <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md tracking-wide">
              Verified Partner
            </span>
          ) : null}

          {/* Rating & Delivery Time Overlay Badge at bottom of image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
            <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#8ed3d1]" />
              {restaurant.time || "25-35 mins"}
            </span>
            <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
              {restaurant.priceForTwo || "₹350 for two"}
            </span>
          </div>
        </div>
        
        {/* CARD CONTENT */}
        <div className="p-4 flex flex-col flex-grow justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#005C5E] transition-colors truncate">
                {restaurant.name}
              </h3>
              <div className="flex items-center gap-1 bg-[#005C5E] text-white text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0">
                <span>{restaurant.rating || 4.5}</span>
                <Star className="w-3 h-3 fill-current text-[#8ed3d1]" />
              </div>
            </div>
            
            {/* Tags / Cuisines */}
            <p className="text-xs text-gray-500 truncate mb-1">
              {tagsList.join(', ')}
            </p>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-400 pt-2 border-t border-gray-100">
            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{restaurant.location || "Kannur, Kerala"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
