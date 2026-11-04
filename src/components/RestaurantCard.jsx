import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const restId = restaurant._id || restaurant.id;
  const tagsList = Array.isArray(restaurant.tags)
    ? restaurant.tags
    : typeof restaurant.tags === 'string'
    ? restaurant.tags.split(',').map((t) => t.trim())
    : ['Multi-cuisine'];

  const defaultImage =
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

  const rating = restaurant.rating || 4.5;
  const ratingColor =
    rating >= 4.5 ? 'bg-green-600' : rating >= 4.0 ? 'bg-green-500' : 'bg-yellow-500';

  return (
    <Link to={`/restaurant/${restId}`} className="block group">
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100/80 flex flex-col h-full card-hover shine">

        {/* ── Image ── */}
        <div className="relative h-44 w-full overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={restaurant.image || defaultImage}
            alt={restaurant.name}
            onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600 ease-out"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          {/* Top badge */}
          <div className="absolute top-3 left-3">
            {restaurant.featured ? (
              <span className="bg-gradient-to-r from-[#004B49] to-[#005C5E] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                ⭐ Featured
              </span>
            ) : restaurant._id ? (
              <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                ✓ Verified
              </span>
            ) : null}
          </div>

          {/* Bottom overlay row */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="backdrop-blur-md bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8ed3d1]" />
              {restaurant.time || '25-35 min'}
            </span>
            <span className="backdrop-blur-md bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
              {restaurant.priceForTwo || '₹350 for two'}
            </span>
          </div>
        </div>

        {/* ── Card Content ── */}
        <div className="p-4 flex flex-col flex-grow justify-between gap-2">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#005C5E] transition-colors truncate leading-snug">
                {restaurant.name}
              </h3>
              {/* Rating badge */}
              <div className={`flex items-center gap-1 text-white text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${ratingColor}`}>
                <span>{rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
            </div>

            {/* Tags */}
            <p className="text-xs text-gray-400 truncate">{tagsList.slice(0, 3).join(' · ')}</p>
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[120px]">{restaurant.location || 'Kannur, Kerala'}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-700 transition-colors duration-200">
              <ChevronRight className="w-3.5 h-3.5 text-[#005C5E] group-hover:text-white transition-colors duration-200" />
            </div>
          </div>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1.5px rgba(0,91,94,0.25)' }} />
      </div>
    </Link>
  );
}
