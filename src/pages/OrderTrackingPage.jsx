import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Package,
  CheckCircle,
  ChefHat,
  Truck,
  Navigation,
  Clock,
  Phone,
  User,
  ArrowLeft,
  Zap,
  ShoppingBag,
  Store,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import LiveMap from "../components/LiveMap";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

// ── Stepper with 5 detailed stages ──────────────────────────────────────────
const STEPS = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "picked_up", label: "Picked Up", icon: ShoppingBag },
  { key: "on_the_way", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

function StatusStepper({ status, deliveryStatus }) {
  // Determine normalized active index
  let activeIndex = 0;
  if (status === "delivered" || deliveryStatus === "delivered") {
    activeIndex = 4;
  } else if (status === "on_the_way" || deliveryStatus === "out_for_delivery") {
    activeIndex = 3;
  } else if (deliveryStatus === "picked_up") {
    activeIndex = 2;
  } else if (status === "preparing") {
    activeIndex = 1;
  } else {
    activeIndex = 0;
  }

  return (
    <div className="relative py-4">
      {/* Background track line */}
      <div className="absolute top-9 left-8 right-8 h-1 bg-gray-200 -z-10 rounded-full" />
      {/* Progress fill line */}
      <div
        className="absolute top-9 left-8 h-1 bg-[#004B49] -z-10 rounded-full transition-all duration-700"
        style={{ width: `${Math.min(activeIndex / (STEPS.length - 1), 1) * (100 - 16)}%` }}
      />
      <div className="flex justify-between">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i <= activeIndex;
          const isCurrent = i === activeIndex;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  done
                    ? "bg-[#004B49] text-white shadow-md shadow-[#004B49]/30"
                    : "bg-gray-100 text-gray-400"
                } ${isCurrent ? "ring-4 ring-[#dcf2f2] scale-110" : ""}`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold text-center ${
                  done ? "text-[#004B49]" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Order Tracking Page ────────────────────────────────────────────────
export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const { joinOrderRoom, onOrderStatusChanged, onLocationUpdated, connected } = useSocket();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liveCoords, setLiveCoords] = useState(null);
  const [notification, setNotification] = useState("");

  // Load initial order details
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/orders/track/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setOrder(data);
        if (data.currentLatLng?.lat && data.currentLatLng?.lng) {
          setLiveCoords(data.currentLatLng);
        }
      } catch (err) {
        setError(err.message || "Could not load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  // Join Socket.io room for this specific order
  useEffect(() => {
    if (orderId) {
      joinOrderRoom(orderId);
    }
  }, [orderId, joinOrderRoom]);

  // Listen for real-time location & status updates
  useEffect(() => {
    const unsubLoc = onLocationUpdated((data) => {
      setLiveCoords({ lat: data.lat, lng: data.lng });
    });

    const unsubStatus = onOrderStatusChanged((data) => {
      if (!data.orderId || data.orderId === orderId || data.orderId?.toString() === orderId) {
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                status: data.status || prev.status,
                deliveryStatus: data.deliveryStatus || prev.deliveryStatus,
                estimatedDeliveryTime: data.estimatedDeliveryTime || prev.estimatedDeliveryTime,
                deliveryPartnerId: data.deliveryPartner || prev.deliveryPartnerId,
              }
            : prev
        );
        setNotification(data.message || "Order status updated!");
        setTimeout(() => setNotification(""), 6000);
      }
    });

    return () => {
      unsubLoc();
      unsubStatus();
    };
  }, [orderId, onLocationUpdated, onOrderStatusChanged]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-4 border-[#004B49] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500">Connecting to live tracking...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <Package size={52} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-1">Order Not Found</h2>
        <p className="text-gray-500 mb-6 text-sm">{error || "Could not locate this order."}</p>
        <Link
          to="/orders"
          className="bg-[#004B49] hover:bg-[#003837] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>
    );
  }

  const isDelivered = order.status === "delivered" || order.deliveryStatus === "delivered";
  const partnerName = order.deliveryPartnerId?.name || "Delivery Partner";
  const partnerPhone = order.deliveryPartnerId?.phone || "+91 9876543210";

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Live Order Tracking</h1>
            <p className="text-xs text-gray-400 font-mono">Order #{order._id?.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        {/* Live Socket Status Pill */}
        <div
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm ${
            connected
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-gray-50 text-gray-500 border-gray-200"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
          {connected ? "Live Connected" : "Connecting..."}
        </div>
      </div>

      {/* Real-time Notification Banner */}
      {notification && (
        <div className="bg-gradient-to-r from-[#004B49] to-[#005C5E] text-white rounded-2xl px-5 py-3.5 text-sm font-semibold flex items-center gap-3 shadow-xl animate-bounce">
          <Zap size={20} className="text-[#8ed3d1] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Status Stepper Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-gray-900">Order Journey</h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#dcf2f2] text-[#004B49]">
            {order.status?.replace(/_/g, " ").toUpperCase()}
          </span>
        </div>
        <StatusStepper status={order.status} deliveryStatus={order.deliveryStatus} />
      </div>

      {/* Responsive 2-column layout on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Map Card (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="text-[#004B49]" size={20} />
              <h3 className="font-bold text-gray-900 text-base">Live Delivery Route</h3>
            </div>
            <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Clock size={14} className="text-[#005C5E]" />
              <span>ETA: <strong className="text-[#004B49]">{order.estimatedDeliveryTime || order.estimatedDelivery || "20-30 mins"}</strong></span>
            </div>
          </div>

          {/* Live Leaflet Map Component with Moving Bike */}
          <LiveMap
            restaurantName={order.restaurant?.name || order.restaurantName}
            restaurantLocation={order.restaurant?.location}
            deliveryAddress={order.deliveryAddress}
            bikeCoords={liveCoords}
            deliveryPartnerName={partnerName}
            deliveryStatus={order.deliveryStatus || order.status}
            height="460px"
          />

          <p className="text-xs text-gray-400 text-center">
            {isDelivered
              ? "✅ Order has been delivered to your doorstep. Enjoy your meal!"
              : "🛵 The bike marker updates its position in real-time as your delivery partner rides towards you."}
          </p>
        </div>

        {/* RIGHT COLUMN: Rider, Addresses, and Items (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delivery Partner Details Card */}
          {order.deliveryPartnerId && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#004B49] to-[#005C5E] text-white flex items-center justify-center text-2xl shadow-md">
                  🛵
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-base">{partnerName}</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified Rider
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">BiteBeam Express Delivery • Two-Wheeler</p>
                  <p className="text-xs text-[#005C5E] font-semibold mt-1">
                    {order.deliveryStatus === "picked_up"
                      ? "Order picked up from restaurant"
                      : order.deliveryStatus === "out_for_delivery"
                      ? "En route to delivery address"
                      : "Assigned to your order"}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${partnerPhone}`}
                className="flex items-center gap-2 bg-[#dcf2f2] hover:bg-[#bce5e4] text-[#004B49] font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shrink-0"
              >
                <Phone size={14} />
                <span>Call Rider</span>
              </a>
            </div>
          )}

          {/* Restaurant & Destination Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Restaurant Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Store size={14} className="text-[#004B49]" />
                <span>Restaurant</span>
              </div>
              <p className="font-bold text-gray-900 text-base">{order.restaurant?.name || order.restaurantName}</p>
              <p className="text-xs text-gray-500 flex items-start gap-1">
                <MapPin size={12} className="text-[#004B49] shrink-0 mt-0.5" />
                <span>{order.restaurant?.location || "Kannur, Kerala"}</span>
              </p>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <MapPin size={14} className="text-rose-600" />
                <span>Delivery Destination</span>
              </div>
              <p className="font-bold text-gray-900 text-base">{order.user?.name || "Customer"}</p>
              <p className="text-xs text-gray-500 flex items-start gap-1">
                <MapPin size={12} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{order.deliveryAddress}</span>
              </p>
            </div>
          </div>

          {/* Order Items Breakdown */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#004B49]" />
              Order Items ({order.items?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-800 font-medium">
                    {item.name} <span className="text-gray-400 font-normal">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
              <div className="pt-2 flex justify-between items-center font-bold text-base">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-[#004B49] text-lg">₹{order.totalAmount?.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
