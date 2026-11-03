import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, ChevronRight, Utensils, AlertCircle } from 'lucide-react';
import { restaurants as mockRestaurants, menuItems as mockMenuItems } from '../data/mockData';
import DishCard from '../components/DishCard';
import { useCart } from '../context/CartContext';

export default function RestaurantDetail() {
  const { id } = useParams();
  const { totalItems, totalPrice } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadRestaurantData = async () => {
      try {
        // 1. First try fetching from MongoDB backend API
        const [resRest, resDishes] = await Promise.all([
          fetch(`http://localhost:5000/api/restaurants/${id}`),
          fetch(`http://localhost:5000/api/dishes/restaurant/${id}`),
        ]);

        let mongoRest = null;
        let mongoDishes = [];

        if (resRest.ok) {
          mongoRest = await resRest.json();
        }
        if (resDishes.ok) {
          mongoDishes = await resDishes.json();
        }

        if (isMounted) {
          if (mongoRest) {
            setRestaurant(mongoRest);
            setDishes(Array.isArray(mongoDishes) ? mongoDishes : []);
            setLoading(false);
            return;
          }

          // 2. Fallback to mock data (for mock IDs 1, 2, 3...)
          const mockRest = mockRestaurants.find(
            (r) => String(r.id) === String(id) || String(r._id) === String(id)
          );

          if (mockRest) {
            setRestaurant(mockRest);
            const mockMenu = mockMenuItems.filter(
              (item) => String(item.restaurantId) === String(mockRest.id)
            );
            setDishes(mockMenu);
          } else {
            setRestaurant(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          // In case backend is offline, check mock data
          const mockRest = mockRestaurants.find(
            (r) => String(r.id) === String(id) || String(r._id) === String(id)
          );
          if (mockRest) {
            setRestaurant(mockRest);
            setDishes(
              mockMenuItems.filter(
                (item) => String(item.restaurantId) === String(mockRest.id)
              )
            );
          } else {
            setRestaurant(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRestaurantData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#004B49] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold">Loading restaurant & menu...</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center page-transition px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Restaurant not found</h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          We couldn't locate this restaurant in the database or directory.
        </p>
        <Link to="/" className="px-6 py-3 bg-[#004B49] hover:bg-[#003837] text-white font-bold rounded-xl transition-all shadow-md">
          Back to Home
        </Link>
      </div>
    );
  }

  const tagsList = Array.isArray(restaurant.tags)
    ? restaurant.tags
    : typeof restaurant.tags === "string"
    ? restaurant.tags.split(",").map((t) => t.trim())
    : ["Multi-cuisine"];

  // Group dishes by category
  const groupedMenu = dishes.reduce((acc, item) => {
    const cat = item.category || "Specialties";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const restId = restaurant._id || restaurant.id;
  const defaultImage =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="page-transition pb-24">
      {/* HERO HEADER */}
      <div className="relative h-64 md:h-80 w-full bg-gray-200">
        <img 
          src={restaurant.image || defaultImage} 
          alt={restaurant.name} 
          onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent"></div>
        
        <div className="absolute inset-0 w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-between py-6">
          <Link to="/" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <ArrowLeft size={24} />
          </Link>

          <div className="text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {tagsList.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-200">
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-xl">
                <Star className="text-yellow-400 fill-current w-4 h-4" />
                <span>{restaurant.rating || 4.5} ({restaurant.reviewCount || "50"}+)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-xl">
                <Clock className="w-4 h-4 text-[#8ed3d1]" />
                <span>{restaurant.time || "25-35 mins"}</span>
              </div>
              <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-xl">
                <span>{restaurant.priceForTwo || "₹350 for two"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU SECTION */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-[#004B49]" />
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Restaurant Menu</h2>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {dishes.length} Items Available
          </span>
        </div>

        {dishes.length > 0 ? (
          Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-black text-gray-800 border-b pb-2 mb-4 flex items-center justify-between">
                <span>{category}</span>
                <span className="text-xs font-semibold text-gray-400">({items.length})</span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {items.map((dish) => (
                  <DishCard 
                    key={dish._id || dish.id} 
                    dish={dish} 
                    restaurantId={restId} 
                    restaurantName={restaurant.name} 
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No dishes added to this menu yet.</p>
          </div>
        )}
      </div>

      {/* STICKY CART BAR */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="w-full bg-[#004B49] text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between">
            <div className="font-bold">
              {totalItems} items | ₹{totalPrice}
            </div>
            <Link to="/cart" className="flex items-center gap-2 font-bold hover:gap-3 transition-all">
              <span>View Cart</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}