import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle, Clock, ChefHat, Truck, MapPin, ArrowLeft, Navigation, RefreshCw } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

export default function OrdersPage() {
  const { orders: localOrders } = useCart();
  const { token, isAuthenticated } = useAuth();
  const [backendOrders, setBackendOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchMyOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setBackendOrders(data);
        }
      } catch (err) {
        console.warn("Could not fetch backend orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [token]);

  // Combine backend orders with local orders (avoiding duplicates)
  const combinedOrders = [
    ...backendOrders,
    ...localOrders.filter((lo) => !backendOrders.some((bo) => bo._id === lo.id || bo._id === lo._id)),
  ];

  if (!loading && combinedOrders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 page-transition">
        <Package className="w-24 h-24 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-8 text-center">Your order history will appear here</p>
        <Link
          to="/"
          className="bg-[#004B49] hover:bg-[#003837] text-white rounded-xl px-6 py-3 font-semibold transition-colors shadow-md hover:shadow-lg"
        >
          Start Ordering
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 page-transition">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Your Orders</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {combinedOrders.map((order) => {
          const orderId = order._id || order.id;
          const totalAmt = order.totalAmount || order.total || 0;
          const status = order.status || "confirmed";

          return (
            <div key={orderId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              {/* ORDER HEADER */}
              <div className="flex flex-wrap justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {order.restaurantName || "BiteBeam Restaurant"}
                  </h2>
                  <span className="text-xs font-mono text-gray-400">Order #{String(orderId).slice(-8).toUpperCase()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#dcf2f2] text-[#004B49]">
                    {status.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <Link
                    to={`/track/${orderId}`}
                    className="flex items-center gap-1.5 bg-[#004B49] hover:bg-[#003837] text-white px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Navigation size={13} />
                    <span>Live Track 🛵</span>
                  </Link>
                </div>
              </div>

              {/* ITEMS */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wider">Items Ordered</h3>
                <div className="space-y-1.5">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} &times; {item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center pt-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={16} className="text-[#005C5E]" />
                  <span>Est. Delivery: {order.estimatedDeliveryTime || order.estimatedDelivery || "25-35 mins"}</span>
                </div>
                <span className="font-black text-gray-900 text-lg">Total: ₹{totalAmt.toFixed(0)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-block bg-[#dcf2f2] text-[#004B49] hover:bg-[#bce5e4] font-semibold py-3 px-8 rounded-xl transition-colors"
        >
          Order More Food
        </Link>
      </div>
    </div>
  );
}
