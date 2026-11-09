import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ChevronRight, Flame, Zap } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const restId = restaurant._id || restaurant.id;
  const tagsList = Array.isArray(restaurant.tags)
    ? restaurant.tags
    : typeof restaurant.tags === 'string'
    ? restaurant.tags.split(',').map((t) => t.trim())
    : ['Multi-cuisine'];

  const defaultImage =
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

  const rating     = parseFloat(restaurant.rating) || 4.5;
  const ratingColor = rating >= 4.5 ? '#00e676' : rating >= 4.0 ? '#69f0ae' : '#ffd740';

  const deliveryTime = restaurant.time || '25-35 min';
  const isFast       = parseInt(deliveryTime) <= 30;
  const isTrending   = restaurant.featured || rating >= 4.7;

  return (
    <Link to={`/restaurant/${restId}`} className="block group">
      <div className="bento-card shine flex flex-col h-full overflow-hidden">

        {/* ── Image ── */}
        <div className="relative h-44 w-full overflow-hidden bg-[#1a1a1f] flex-shrink-0 rounded-t-[20px]">
          <img
            src={restaurant.image || defaultImage}
            alt={restaurant.name}
            onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
          />
          {/* Deep gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {isTrending && (
              <span className="flex items-center gap-1 badge-fire">
                <Flame className="w-2.5 h-2.5" /> Trending
              </span>
            )}
            {restaurant._id && !restaurant.featured && (
              <span className="badge-neon">✓ Verified</span>
            )}
          </div>

          {/* Bottom overlay row */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: isFast ? '#00e676' : '#94a3b8' }}
            >
              {isFast ? <Zap className="w-3 h-3 fill-current" /> : <Clock className="w-3 h-3" />}
              {deliveryTime}
            </span>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-300"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            >
              {restaurant.priceForTwo || '₹350 for two'}
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-4 flex flex-col flex-grow justify-between gap-2 bg-[#111113]">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors truncate leading-snug">
                {restaurant.name}
              </h3>
              {/* Rating badge */}
              <div
                className="flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-lg flex-shrink-0"
                style={{ background: `${ratingColor}18`, border: `1px solid ${ratingColor}30`, color: ratingColor }}
              >
                {rating}
                <Star className="w-2.5 h-2.5 fill-current" />
              </div>
            </div>
            <p className="text-xs text-slate-500 truncate">{tagsList.slice(0, 3).join(' · ')}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate max-w-[110px]">{restaurant.location || 'Kannur, Kerala'}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
              <ChevronRight className="w-3.5 h-3.5 text-orange-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Hover glow border */}
        <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,87,34,0.25)' }} />
      </div>
    </Link>
  );
}
