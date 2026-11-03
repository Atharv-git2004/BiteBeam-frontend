import React from 'react';
import { Star, Minus, Plus, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

const DishCard = ({ dish, restaurantId, restaurantName }) => {
  const { getItemQuantity, addItem, removeItem } = useCart();
  
  // Resolve ID for both MongoDB (_id) and mock data (id)
  const dishId = dish._id || dish.id;
  const quantity = getItemQuantity(dishId);

  // Resolve restaurant info (if populated by Mongoose)
  const resolvedRestId = restaurantId || (dish.restaurant?._id || dish.restaurant?.id) || dish.restaurant || dish.restaurantId;
  const resolvedRestName = restaurantName || dish.restaurant?.name || dish.restaurantName || '';

  const fallbackImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60";

  return (
    <div className="flex flex-row justify-between gap-4 py-6 border-b border-gray-100 bg-white group">
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col justify-start">
        {/* Indicators Row */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {/* Veg/Non-veg Indicator */}
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center ${
              dish.isVeg ? 'border-green-600' : 'border-red-600'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                dish.isVeg ? 'bg-green-600' : 'bg-red-600'
              }`}
            />
          </div>
          
          {/* Bestseller Badge */}
          {dish.isBestseller && (
            <div className="flex items-center gap-1 text-xs font-semibold text-[#004B49] bg-[#f0f9f9] border border-[#bce5e4] px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-[#004B49]" />
              Bestseller
            </div>
          )}

          {/* Restaurant Origin Badge (if on home page or global menu) */}
          {resolvedRestName && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              <Utensils className="w-3 h-3 text-[#005C5E]" />
              {resolvedRestName}
            </span>
          )}
        </div>

        {/* Dish Info */}
        <h3 className="text-lg font-bold text-gray-900 mb-0.5 group-hover:text-[#005C5E] transition-colors">
          {dish.name}
        </h3>
        <p className="text-base font-bold text-[#004B49] mb-1">₹{dish.price}</p>
        
        {/* Rating & Category */}
        <div className="flex items-center gap-3 mb-2">
          {dish.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#005C5E] fill-[#005C5E]" />
              <span className="text-sm font-semibold text-gray-700">{dish.rating}</span>
            </div>
          )}
          {dish.category && (
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
              {dish.category}
            </span>
          )}
        </div>

        {/* Description */}
        {dish.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
            {dish.description}
          </p>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-32 h-32 flex-shrink-0 relative rounded-2xl ml-4 overflow-visible">
        <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
          <img
            src={dish.image || fallbackImage}
            alt={dish.name}
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* ADD Button / Stepper */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24">
          {quantity === 0 ? (
            <button
              onClick={() => addItem({ ...dish, id: dishId }, resolvedRestId, resolvedRestName)}
              className="w-full bg-white border border-[#005C5E]/30 shadow-md text-[#004B49] hover:bg-[#004B49] hover:text-white font-black text-xs px-3 py-2 rounded-xl uppercase text-center transition-all duration-200"
            >
              ADD
            </button>
          ) : (
            <div className="w-full bg-white border border-[#005C5E]/30 shadow-md rounded-xl flex items-center justify-between overflow-hidden">
              <button
                onClick={() => removeItem(dishId)}
                className="px-2 py-2 hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 text-[#004B49]" />
              </button>
              <span className="font-extrabold text-[#004B49] text-xs">
                {quantity}
              </span>
              <button
                onClick={() => addItem({ ...dish, id: dishId }, resolvedRestId, resolvedRestName)}
                className="px-2 py-2 hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 text-[#004B49]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;
