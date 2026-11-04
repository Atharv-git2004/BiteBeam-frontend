import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Minus, Plus, Utensils, Zap, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const DishCard = ({ dish, restaurantId, restaurantName }) => {
  const { getItemQuantity, addItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const dishId = dish._id || dish.id;
  const quantity = getItemQuantity(dishId);

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
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100/80 shadow-sm card-hover shine">
      {/* Top section — image right, info left */}
      <div className="flex gap-0">
        {/* ── LEFT: Info ── */}
        <div className="flex-1 p-4 pb-3 flex flex-col justify-between min-w-0">
          {/* Badges row */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            {/* Veg / Non-veg indicator */}
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              dish.isVeg ? 'border-green-500' : 'border-red-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            {dish.isBestseller && (
              <span className="flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                BESTSELLER
              </span>
            )}

            {resolvedRestName && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md truncate max-w-[100px]">
                <Utensils className="w-2.5 h-2.5 text-[#005C5E] flex-shrink-0" />
                <span className="truncate">{resolvedRestName}</span>
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="text-base font-bold text-gray-900 mb-0.5 leading-snug group-hover:text-[#005C5E] transition-colors duration-200 line-clamp-2">
            {dish.name}
          </h3>

          {/* Price */}
          <p className="text-lg font-black text-[#004B49] mb-1">
            ₹{dish.price}
          </p>

          {/* Rating + Category */}
          <div className="flex items-center gap-2 mb-2">
            {dish.rating && (
              <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md">
                <Star className="w-3 h-3 fill-green-600 text-green-600" />
                <span className="text-xs font-bold text-green-700">{dish.rating}</span>
              </div>
            )}
            {dish.category && (
              <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                {dish.category}
              </span>
            )}
          </div>

          {/* Description */}
          {dish.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
              {dish.description}
            </p>
          )}

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="mt-auto inline-flex items-center gap-1.5 bg-gradient-to-r from-[#004B49] to-[#005C5E] hover:from-[#003837] hover:to-[#004B49] text-white font-bold text-[11px] px-3.5 py-2 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#004B49]/30 transition-all duration-200 btn-press w-fit"
          >
            <Zap className="w-3 h-3" fill="currentColor" />
            Buy Now
          </button>
        </div>

        {/* ── RIGHT: Image ── */}
        <div className="relative w-32 h-full flex-shrink-0 self-stretch">
          <div className="relative w-32 h-32 mt-4 mr-4 rounded-2xl overflow-hidden bg-gray-100 shadow-md border border-gray-100">
            <img
              src={dish.image || fallbackImage}
              alt={dish.name}
              onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Heart button */}
            <button
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform btn-press"
            >
              <Heart className={`w-3 h-3 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* ADD / Stepper — positioned below image */}
          <div className="absolute bottom-0 right-0 w-32 px-2 pb-3">
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                className={`w-full bg-white border-2 border-[#005C5E]/30 hover:border-[#004B49] shadow-md text-[#004B49] hover:bg-[#004B49] hover:text-white font-black text-xs py-2 rounded-xl uppercase text-center transition-all duration-200 btn-press ${
                  justAdded ? 'animate-pop-in bg-[#004B49] text-white border-[#004B49]' : ''
                }`}
              >
                {justAdded ? (
                  <span className="flex items-center justify-center gap-1">
                    <ShoppingCart className="w-3 h-3" /> Added!
                  </span>
                ) : 'ADD'}
              </button>
            ) : (
              <div className="w-full bg-[#004B49] rounded-xl flex items-center justify-between shadow-md overflow-hidden animate-pop-in">
                <button
                  onClick={() => removeItem(dishId)}
                  className="px-2.5 py-2 hover:bg-[#003837] transition-colors text-white"
                  aria-label="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-extrabold text-white text-sm">{quantity}</span>
                <button
                  onClick={handleAdd}
                  className="px-2.5 py-2 hover:bg-[#005C5E] transition-colors text-white"
                  aria-label="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
