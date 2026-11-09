import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, Utensils, Zap, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const DishCard = ({ dish, restaurantId, restaurantName }) => {
  const { getItemQuantity, addItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [liked, setLiked]       = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const dishId = dish._id || dish.id;
  const qty    = getItemQuantity(dishId);

  const resolvedRestId   = restaurantId || dish.restaurant?._id || dish.restaurant?.id || dish.restaurant || dish.restaurantId;
  const resolvedRestName = restaurantName || dish.restaurant?.name || dish.restaurantName || '';

  const fallbackImage =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60';

  const handleAdd = () => {
    addItem({ ...dish, id: dishId }, resolvedRestId, resolvedRestName);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };

  const handleBuyNow = () => {
    addItem({ ...dish, id: dishId }, resolvedRestId, resolvedRestName);
    navigate('/cart');
  };

  return (
    <div className="group relative bento-card shine flex overflow-hidden">

      {/* ── LEFT: Info ── */}
      <div className="flex-1 p-4 pb-3 flex flex-col justify-between min-w-0">

        {/* Badges */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          {/* Veg/Non-veg dot */}
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            dish.isVeg ? 'border-emerald-500' : 'border-red-500'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>

          {dish.isBestseller && (
            <span className="flex items-center gap-0.5 badge-fire">
              <Star className="w-2.5 h-2.5 fill-current" /> BEST
            </span>
          )}

          {resolvedRestName && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-white/[0.04] px-1.5 py-0.5 rounded-md border border-white/[0.06] truncate max-w-[90px]">
              <Utensils className="w-2.5 h-2.5 text-orange-400 flex-shrink-0" />
              <span className="truncate">{resolvedRestName}</span>
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-white mb-0.5 leading-snug group-hover:text-orange-400 transition-colors duration-200 line-clamp-2">
          {dish.name}
        </h3>

        {/* Price */}
        <p className="text-base font-black mb-1 gradient-text">₹{dish.price}</p>

        {/* Rating + Category */}
        <div className="flex items-center gap-2 mb-2">
          {dish.rating && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)' }}>
              <Star className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-400">{dish.rating}</span>
            </div>
          )}
          {dish.category && (
            <span className="text-[10px] font-medium text-slate-600 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.05]">
              {dish.category}
            </span>
          )}
        </div>

        {/* Description */}
        {dish.description && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {dish.description}
          </p>
        )}

        {/* Buy Now */}
        <button
          onClick={handleBuyNow}
          className="mt-auto inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-200 btn-press w-fit"
        >
          <Zap className="w-3 h-3" fill="currentColor" />
          Buy Now
        </button>
      </div>

      {/* ── RIGHT: Image ── */}
      <div className="relative w-32 flex-shrink-0 flex flex-col items-end pt-4 pr-4">
        <div className="relative w-32 h-28 rounded-2xl overflow-hidden bg-[#1a1a1f] border border-white/[0.08]">
          <img
            src={dish.image || fallbackImage}
            alt={dish.name}
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          />
          {/* Heart */}
          <button
            onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform btn-press"
          >
            <Heart className={`w-3 h-3 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
          </button>
        </div>

        {/* ADD / Stepper */}
        <div className="mt-2 w-28">
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className={`w-full border font-black text-xs py-2 rounded-xl uppercase text-center transition-all duration-200 btn-press ${
                justAdded
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-500 text-white shadow-md shadow-orange-500/30 animate-pop-in'
                  : 'bg-transparent border-orange-500/40 text-orange-400 hover:bg-orange-500/15 hover:border-orange-500/60'
              }`}
            >
              {justAdded ? (
                <span className="flex items-center justify-center gap-1">
                  <ShoppingCart className="w-3 h-3" /> Added!
                </span>
              ) : 'ADD'}
            </button>
          ) : (
            <div className="w-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-between shadow-lg shadow-orange-500/30 overflow-hidden animate-pop-in">
              <button onClick={() => removeItem(dishId)} className="px-2.5 py-2 hover:bg-black/20 transition-colors text-white" aria-label="Decrease">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-white text-sm">{qty}</span>
              <button onClick={handleAdd} className="px-2.5 py-2 hover:bg-black/20 transition-colors text-white" aria-label="Increase">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;
