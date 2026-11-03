import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Minus, Plus, Trash2, ArrowLeft, Loader2,
  MapPin, Navigation, CheckCircle, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// ──────────────────────────────────────────────────────────────────────────────
// Delivery Address Form Component (embedded below cart items)
// ──────────────────────────────────────────────────────────────────────────────
function DeliveryAddressForm({ address, onChange }) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [locSuccess, setLocSuccess] = useState('');
  const [expanded, setExpanded] = useState(true);

  // Reverse-geocode using Nominatim (free, no API key)
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocError('');
    setLocSuccess('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const human = await reverseGeocode(lat, lng);
        onChange({
          ...address,
          street: human,
          lat,
          lng,
        });
        setLocSuccess('📍 Location detected & auto-filled!');
        setLocating(false);
      },
      (err) => {
        setLocError('Could not get location. Please enter manually.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#dcf2f2] flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#004B49]" />
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-900 text-sm">Delivery Address</p>
            <p className="text-xs text-gray-500 line-clamp-1">
              {address.street || 'Enter your delivery address'}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-50">
          {/* Use My Location */}
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locating}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#bce5e4] text-[#004B49] font-semibold text-sm hover:bg-[#f0f9f9] transition-colors disabled:opacity-60"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            {locating ? 'Detecting location...' : 'Use My Current Location'}
          </button>

          {locSuccess && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" /> {locSuccess}
            </p>
          )}
          {locError && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5" /> {locError}
            </p>
          )}

          <div className="text-xs text-gray-400 text-center font-medium">— or fill in manually —</div>

          {/* Street / Flat */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Street / Flat / Area *
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => onChange({ ...address, street: e.target.value })}
              placeholder="e.g. Flat 12, Fort Road, Near Beach"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bce5e4] focus:border-[#005C5E] transition"
            />
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Landmark (optional)</label>
            <input
              type="text"
              value={address.landmark}
              onChange={(e) => onChange({ ...address, landmark: e.target.value })}
              placeholder="e.g. Opposite to Town Hall"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bce5e4] focus:border-[#005C5E] transition"
            />
          </div>

          {/* City & Pincode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => onChange({ ...address, city: e.target.value })}
                placeholder="Kannur"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bce5e4] focus:border-[#005C5E] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode *</label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => onChange({ ...address, pincode: e.target.value })}
                placeholder="670001"
                maxLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bce5e4] focus:border-[#005C5E] transition"
              />
            </div>
          </div>

          {/* Optional: lat/lng display if auto-detected */}
          {address.lat && address.lng && (
            <p className="text-[11px] text-gray-400 bg-gray-50 px-3 py-2 rounded-lg font-mono">
              📍 GPS: {address.lat.toFixed(5)}, {address.lng.toFixed(5)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main CartPage
// ──────────────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, placeOrder } = useCart();
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [addrError, setAddrError] = useState('');

  const [address, setAddress] = useState({
    street: '',
    landmark: '',
    city: 'Kannur',
    pincode: '670001',
    lat: null,
    lng: null,
  });

  const isCartEmpty = items.length === 0;

  const deliveryFee = totalPrice > 299 ? 0 : 30;
  const platformFee = 5;
  const gst = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + deliveryFee + platformFee + gst;
  const restaurantName = items[0]?.restaurantName || 'Restaurant';

  if (isCartEmpty) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center">Add items from a restaurant to get started</p>
        <Link
          to="/"
          className="bg-[#004B49] hover:bg-[#003837] text-white rounded-xl px-6 py-3 font-semibold transition-colors shadow-md"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const buildDeliveryAddressString = () => {
    const parts = [address.street, address.landmark, address.city, address.pincode].filter(Boolean);
    return parts.join(', ');
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    // Validate address
    if (!address.street.trim()) {
      setAddrError('Please enter your delivery address before placing the order.');
      document.getElementById('address-section')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!address.city.trim()) {
      setAddrError('Please enter your city.');
      return;
    }
    setAddrError('');

    setPlacing(true);
    try {
      const fullAddress = buildDeliveryAddressString();

      const payload = {
        restaurantId: items[0]?.restaurantId ? String(items[0].restaurantId) : null,
        restaurantName,
        items: items.map((i) => ({
          name: i.dish.name,
          price: i.dish.price,
          quantity: i.quantity,
        })),
        totalAmount: grandTotal,
        deliveryAddress: fullAddress,
        deliveryLat: address.lat || null,
        deliveryLng: address.lng || null,
        paymentMethod: 'Online UPI',
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      placeOrder(); // clear cart
      if (data._id) {
        navigate(`/track/${data._id}`);
      } else {
        navigate('/orders');
      }
    } catch (err) {
      placeOrder();
      navigate('/orders');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={24} className="text-gray-700" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-500 text-sm">Order from {restaurantName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Items + Address */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Items</h2>
            <div className="space-y-6">
              {items.map((item) => {
                const dishKey = item.dish._id || item.dish.id;
                return (
                  <div key={dishKey} className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          item.dish.isVeg ? 'bg-green-600' : 'bg-red-600'
                        }`}
                      />
                      <span className="font-medium text-gray-800 line-clamp-1">{item.dish.name}</span>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 ml-2">
                      <div className="flex items-center bg-white border border-[#bce5e4] rounded-lg shadow-sm">
                        <button
                          onClick={() => updateQuantity(dishKey, item.quantity - 1)}
                          className="p-2 text-[#004B49] hover:bg-[#f0f9f9] transition-colors rounded-l-lg"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(dishKey, item.quantity + 1)}
                          className="p-2 text-[#004B49] hover:bg-[#f0f9f9] transition-colors rounded-r-lg"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="w-16 text-right font-semibold text-gray-800">
                        ₹{item.dish.price * item.quantity}
                      </div>
                      <button
                        onClick={() => removeItem(dishKey)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1.5"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address */}
          <div id="address-section">
            <DeliveryAddressForm address={address} onChange={setAddress} />
          </div>

          {addrError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {addrError}
            </div>
          )}
        </div>

        {/* RIGHT: Bill Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Bill Details</h2>

            <div className="space-y-4 text-gray-600 text-sm">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-medium">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="font-medium text-[#005C5E]">FREE</span>
                ) : (
                  <span className="font-medium">₹{deliveryFee}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="font-medium">₹{platformFee}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Charges</span>
                <span className="font-medium">₹{gst}</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="font-bold text-gray-900 text-lg">₹{grandTotal}</span>
                </div>
                {totalPrice > 299 && (
                  <p className="text-xs text-[#005C5E] font-semibold mt-1 text-right">
                    🎉 Free delivery on this order!
                  </p>
                )}
              </div>
            </div>

            {/* Address preview pill */}
            {address.street && (
              <div className="mt-4 bg-[#f0f9f9] rounded-xl px-4 py-3 border border-[#bce5e4]">
                <p className="text-[11px] font-bold text-[#004B49] mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Delivering to
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {buildDeliveryAddressString()}
                </p>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full mt-6 bg-[#004B49] hover:bg-[#003837] text-white font-bold py-4 rounded-xl text-lg transition-all shadow-md hover:shadow-xl active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {placing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={20} />
                  <span>Place Order · ₹{grandTotal}</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 Secure payment · COD & UPI supported
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
