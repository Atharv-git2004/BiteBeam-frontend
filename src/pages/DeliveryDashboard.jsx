import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Package, MapPin, Phone, User, CheckCircle, Truck, Navigation,
  ShoppingBag, ChefHat, AlertCircle, RefreshCw, Play, Square,
  Sparkles, ArrowRight, X, Bell, Wifi, WifiOff,
  DollarSign, Activity, Star, QrCode, Banknote, CreditCard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import LiveMap from "../components/LiveMap";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;
const ALARM_SOUND_URL = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

// ─── Simulated Kannur delivery route ─────────────────────────────────────────
const SIMULATED_ROUTE = [
  { lat: 11.8689, lng: 75.3712 },
  { lat: 11.8702, lng: 75.3705 },
  { lat: 11.8718, lng: 75.3692 },
  { lat: 11.8735, lng: 75.3681 },
  { lat: 11.8752, lng: 75.3670 },
  { lat: 11.8770, lng: 75.3658 },
  { lat: 11.8788, lng: 75.3645 },
  { lat: 11.8805, lng: 75.3633 },
  { lat: 11.8825, lng: 75.3621 },
];

// ─── Status badge ─────────────────────────────────────────────────────────────
function statusBadge(ds) {
  const map = {
    unassigned:       { label: "Awaiting Pickup",    cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    assigned:         { label: "Assigned to You",    cls: "bg-sky-500/20 text-sky-400 border-sky-500/30" },
    picked_up:        { label: "Picked Up",          cls: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
    out_for_delivery: { label: "Out for Delivery",   cls: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
    delivered:        { label: "Delivered ✓",        cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  };
  const s = map[ds] || { label: ds, cls: "bg-gray-700 text-gray-400 border-gray-600" };
  return <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>;
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent = "text-teal-400" }) {
  return (
    <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-gray-700/50 flex items-center justify-center">
        <Icon className={`w-5 h-5 ${accent}`} />
      </div>
      <div>
        <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className={`text-xl font-black ${accent}`}>{value}</p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Payment Collection Modal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function PaymentModal({ order, onConfirm, onCancel, submitting }) {
  const [method, setMethod] = useState(null); // "upi" | "cash"

  const amount = order.totalAmount?.toFixed(0) || "0";

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700/60 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-5 relative">
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Collect Payment</h2>
              <p className="text-xs text-white/70">Order #{order._id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-2xl px-4 py-3 text-center">
            <p className="text-xs text-white/70 mb-0.5">Amount to Collect</p>
            <p className="text-3xl font-black text-white">₹{amount}</p>
            <p className="text-xs text-white/60 mt-0.5">{order.restaurantName} • {order.items?.length || 0} items</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-400 text-center">Choose payment method collected from customer:</p>

          {/* UPI / QR Option */}
          <button
            onClick={() => setMethod("upi")}
            className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${
              method === "upi"
                ? "border-teal-500/60 bg-teal-500/10 ring-1 ring-teal-500/30"
                : "border-gray-700/50 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">UPI / QR Code</p>
              <p className="text-xs text-gray-400">Customer paid via QR scan, PhonePe, GPay, or any UPI app</p>
            </div>
            {method === "upi" && (
              <CheckCircle className="w-5 h-5 text-teal-400 ml-auto shrink-0" />
            )}
          </button>

          {/* QR Code Display (shown when UPI selected) */}
          {method === "upi" && (
            <div className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2">
              {/* Placeholder QR — in production, generate a real UPI deep-link QR */}
              <div className="w-32 h-32 bg-gray-100 border-4 border-gray-200 rounded-xl flex items-center justify-center">
                <div className="grid grid-cols-3 gap-1 p-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-sm ${
                        [0, 2, 6, 8, 4, 1, 7].includes(i) ? "bg-gray-900" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs font-bold text-gray-700 text-center">Scan to pay ₹{amount}</p>
              <p className="text-[10px] text-gray-500 text-center">UPI ID: bitebeam@upi</p>
              <div className="flex gap-2 mt-1">
                {["GPay", "PhonePe", "Paytm"].map((app) => (
                  <span key={app} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{app}</span>
                ))}
              </div>
            </div>
          )}

          {/* Cash Option */}
          <button
            onClick={() => setMethod("cash")}
            className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 text-left ${
              method === "cash"
                ? "border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                : "border-gray-700/50 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Banknote className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Cash on Delivery</p>
              <p className="text-xs text-gray-400">Customer paid ₹{amount} in cash to you</p>
            </div>
            {method === "cash" && (
              <CheckCircle className="w-5 h-5 text-emerald-400 ml-auto shrink-0" />
            )}
          </button>

          {/* Cash confirmation note */}
          {method === "cash" && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-xs text-emerald-300 font-medium flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Confirm you have received ₹{amount} cash from the customer before proceeding.</span>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={() => method && onConfirm(method)}
            disabled={!method || submitting}
            className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
              method
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 active:scale-95"
                : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> Recording payment...</>
            ) : (
              <><CheckCircle className="w-5 h-5" /> Confirm & Mark Delivered</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Incoming Order Alert Modal with Sound
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function IncomingOrderModal({ alertData, onAccept, onReject, accepting }) {
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!alertData) return;
    const playAlarm = () => {
      try {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        const audio = new Audio(ALARM_SOUND_URL);
        audio.volume = 0.9;
        audioRef.current = audio;
        audio.play().catch(() => {});
      } catch (e) {}
    };
    playAlarm();
    intervalRef.current = setInterval(playAlarm, 2500);
    return () => {
      clearInterval(intervalRef.current);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, [alertData]);

  if (!alertData) return null;

  const stopSound = () => {
    clearInterval(intervalRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-amber-500/30 rounded-3xl shadow-2xl shadow-amber-500/10 max-w-md w-full overflow-hidden animate-bounce-in">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-center relative">
          <div className="absolute top-3 right-3">
            <Bell className="w-6 h-6 text-white animate-bounce" />
          </div>
          <span className="text-4xl block mb-2">🔔</span>
          <h2 className="text-xl font-black text-white">New Order Alert!</h2>
          <p className="text-sm text-white/80 mt-1">A customer needs delivery now</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-800 rounded-2xl p-4 space-y-3 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat size={16} className="text-amber-400" />
                <span className="font-bold text-white text-sm">{alertData.restaurantName}</span>
              </div>
              <span className="text-lg font-black text-teal-400">₹{alertData.totalAmount}</span>
            </div>
            <div className="text-xs text-gray-400 space-y-1.5">
              <p className="flex items-center gap-1.5">
                <MapPin size={12} className="text-teal-400 shrink-0" />
                <span>Pickup: {alertData.restaurantLocation || "Fort Road, Kannur"}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin size={12} className="text-rose-400 shrink-0" />
                <span>Drop: {alertData.deliveryAddress}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <User size={12} className="text-sky-400 shrink-0" />
                <span>Customer: {alertData.customerName}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShoppingBag size={12} className="text-violet-400 shrink-0" />
                <span>{alertData.itemsCount || 1} items</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { stopSound(); onReject(); }}
              className="py-3.5 rounded-2xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <X size={16} /> Reject
            </button>
            <button
              onClick={() => { stopSound(); onAccept(alertData.orderId || alertData._id); }}
              disabled={accepting}
              className="py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {accepting ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              {accepting ? "Accepting..." : "Accept Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Active Order Panel — GPS + Status + Payment Flow
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ActiveOrderPanel({ order, onBack, onStatusUpdated }) {
  const { token, user } = useAuth();
  const { emitLocationUpdate, connected } = useSocket();

  const [estimatedTime] = useState(order.estimatedDeliveryTime || "15-20 mins");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [currentCoords, setCurrentCoords] = useState(
    order.currentLatLng?.lat ? order.currentLatLng : SIMULATED_ROUTE[0]
  );

  // GPS
  const [realGpsActive, setRealGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const watchIdRef = useRef(null);

  // Simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const simTimerRef = useRef(null);

  // Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (simTimerRef.current !== null) clearInterval(simTimerRef.current);
    };
  }, []);

  const stopSimulation = () => {
    if (simTimerRef.current !== null) { clearInterval(simTimerRef.current); simTimerRef.current = null; }
    setIsSimulating(false);
  };

  const toggleRealGps = () => {
    if (realGpsActive) {
      if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
      setRealGpsActive(false);
      return;
    }
    if (!navigator.geolocation) { setGpsError("Geolocation not supported"); return; }
    setGpsError("");
    setRealGpsActive(true);
    stopSimulation();
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentCoords(coords);
        emitLocationUpdate({ orderId: order._id, ...coords, deliveryPartnerId: user?._id });
        fetch(`${API_URL}/delivery/order/${order._id}/location`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(coords),
        }).catch(() => {});
      },
      (err) => { setGpsError(`GPS Error: ${err.message}`); setRealGpsActive(false); },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );
  };

  const startSimulation = () => {
    if (isSimulating) { stopSimulation(); return; }
    if (realGpsActive) { navigator.geolocation.clearWatch(watchIdRef.current); setRealGpsActive(false); }
    setIsSimulating(true);
    let stepIndex = 0;
    simTimerRef.current = setInterval(() => {
      if (stepIndex >= SIMULATED_ROUTE.length) {
        clearInterval(simTimerRef.current); simTimerRef.current = null;
        setIsSimulating(false); return;
      }
      const pt = SIMULATED_ROUTE[stepIndex];
      setCurrentCoords(pt);
      setSimStep(stepIndex);
      emitLocationUpdate({ orderId: order._id, lat: pt.lat, lng: pt.lng, deliveryPartnerId: user?._id });
      fetch(`${API_URL}/delivery/order/${order._id}/location`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(pt),
      }).catch(() => {});
      stepIndex++;
    }, 1800);
  };

  // Update status for picked_up / out_for_delivery — directly calls API
  const updateStatus = async (statusKey) => {
    // "delivered" click → open payment modal instead
    if (statusKey === "delivered") {
      setShowPaymentModal(true);
      return;
    }
    setUpdating(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/delivery/order/${order._id}/delivery-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deliveryStatus: statusKey, estimatedDeliveryTime: estimatedTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      onStatusUpdated(data);
      // Auto-start bike simulation when order is picked up
      if (statusKey === "picked_up" || statusKey === "out_for_delivery") {
        if (!isSimulating && !realGpsActive) startSimulation();
      }
    } catch (err) { setError(err.message); }
    finally { setUpdating(false); }
  };

  // Called from PaymentModal after choosing payment method
  const handlePaymentConfirm = async (method) => {
    setPaymentSubmitting(true);
    try {
      const paymentMethod = method === "upi" ? "UPI QR" : "Cash on Delivery";
      const paymentCollectedBy = method === "cash" ? "delivery_partner" : "customer";

      const res = await fetch(`${API_URL}/delivery/order/${order._id}/collect-payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paymentMethod, paymentCollectedBy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment confirmation failed");

      stopSimulation();
      setShowPaymentModal(false);
      onStatusUpdated(data);
    } catch (err) {
      setError(err.message);
      setShowPaymentModal(false);
    } finally { setPaymentSubmitting(false); }
  };

  const ds = order.deliveryStatus || "assigned";
  const progress = Math.round((simStep / (SIMULATED_ROUTE.length - 1)) * 100);
  const isDelivered = ds === "delivered";

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-teal-400 font-bold text-sm hover:text-teal-300 transition-colors">
        ← Back to Orders
      </button>

      {/* Order Header */}
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 flex items-start justify-between">
        <div>
          <span className="text-xs font-mono text-gray-500">ORDER #{order._id?.slice(-8).toUpperCase()}</span>
          <h2 className="text-xl font-black text-white mt-0.5">{order.restaurantName || "Restaurant"}</h2>
          <p className="text-xs text-gray-400 mt-1">
            Total: <strong className="text-teal-400">₹{order.totalAmount?.toFixed(0)}</strong> • {order.items?.length || 0} Items
          </p>
          {isDelivered && order.paymentStatus === "paid" && (
            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" /> Payment Collected
            </span>
          )}
        </div>
        {statusBadge(ds)}
      </div>

      {/* Pickup & Drop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <ChefHat size={14} className="text-teal-400" />
            <span>1. Pickup Restaurant</span>
          </div>
          <p className="font-bold text-white">{order.restaurant?.name || order.restaurantName}</p>
          <p className="text-xs text-gray-400 flex items-start gap-1">
            <MapPin size={12} className="text-teal-400 shrink-0 mt-0.5" />
            <span>{order.restaurant?.location || "Fort Road, Kannur"}</span>
          </p>
        </div>
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <User size={14} className="text-rose-400" />
            <span>2. Customer Drop</span>
          </div>
          <p className="font-bold text-white">{order.user?.name || "Customer"}</p>
          <p className="text-xs text-gray-400 flex items-start gap-1">
            <MapPin size={12} className="text-rose-400 shrink-0 mt-0.5" />
            <span>{order.deliveryAddress || "Kannur, Kerala"}</span>
          </p>
          {order.user?.phone && (
            <a href={`tel:${order.user.phone}`} className="inline-flex items-center gap-1.5 text-xs text-teal-400 font-bold hover:underline pt-1">
              <Phone size={12} /> Call ({order.user.phone})
            </a>
          )}
        </div>
      </div>

      {/* Status Flow Controls */}
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Delivery Flow</h3>
          <span className="text-xs text-gray-500">Real-time push to customer</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            <AlertCircle size={14} /> <span>{error}</span>
          </div>
        )}

        {isDelivered ? (
          <div className="flex items-center justify-center gap-3 py-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-black text-emerald-400 text-base">Order Delivered!</p>
              <p className="text-xs text-gray-400">
                Payment: <span className="font-bold text-emerald-300">{order.paymentMethod || "Confirmed"}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "picked_up",        label: "1. Picked Up",       icon: ShoppingBag, activeColor: "violet" },
              { key: "out_for_delivery", label: "2. Out for Delivery", icon: Truck,       activeColor: "teal" },
              { key: "delivered",        label: "3. Collect Payment",  icon: DollarSign,  activeColor: "emerald" },
            ].map(({ key, label, icon: Icon, activeColor }) => {
              const isActive = ds === key;
              const isDeliverBtn = key === "delivered";
              return (
                <button
                  key={key}
                  onClick={() => updateStatus(key)}
                  disabled={updating || isDelivered}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all font-bold text-xs active:scale-95 ${
                    isActive
                      ? `border-${activeColor}-500/50 bg-${activeColor}-500/15 text-${activeColor}-400`
                      : isDeliverBtn
                      ? "border-emerald-600/40 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                      : "border-gray-700/50 hover:border-gray-600 bg-gray-800/50 text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                  {isDeliverBtn && <span className="text-[9px] opacity-70">(Opens Payment)</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* GPS Broadcast Section */}
      {!isDelivered && (
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation size={20} className="text-teal-400" />
              <h3 className="font-bold text-white text-base">GPS Location Broadcast</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-gray-600"}`} />
              <span className="text-xs font-semibold text-gray-500">{connected ? "Live" : "Offline"}</span>
            </div>
          </div>

          {currentCoords && (
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="font-mono text-teal-400 font-bold flex items-center gap-2">
                📍 {currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}
              </div>
              {isSimulating && (
                <span className="bg-teal-500/20 text-teal-400 px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1 border border-teal-500/30">
                  <Sparkles size={12} /> {progress}%
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={startSimulation}
              className={`p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                isSimulating
                  ? "bg-amber-500/90 hover:bg-amber-500 text-black"
                  : "bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white"
              }`}
            >
              {isSimulating ? <><Square size={16} /> Pause Simulation</> : <><Play size={16} fill="currentColor" /> Simulate Bike Route</>}
            </button>
            <button
              type="button"
              onClick={toggleRealGps}
              className={`p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
                realGpsActive
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                  : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:text-gray-300 hover:border-gray-600"
              }`}
            >
              <Navigation size={16} className={realGpsActive ? "animate-spin text-rose-400" : ""} />
              {realGpsActive ? "Stop Device GPS" : "Use Real GPS"}
            </button>
          </div>

          {gpsError && <p className="text-xs text-rose-400 font-medium">{gpsError}</p>}

          <div className="pt-2">
            <LiveMap
              restaurantName={order.restaurantName || "Restaurant"}
              deliveryAddress={order.deliveryAddress}
              bikeCoords={currentCoords}
              deliveryPartnerName="You (Rider)"
              deliveryStatus={ds}
              height="320px"
            />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          order={order}
          onConfirm={handlePaymentConfirm}
          onCancel={() => setShowPaymentModal(false)}
          submitting={paymentSubmitting}
        />
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN DELIVERY DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function DeliveryDashboard() {
  const { token, user } = useAuth();
  const { socket, connected } = useSocket();

  const [tab, setTab] = useState("available");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    const endpoint = tab === "available" ? "/delivery/available-orders" : "/delivery/my-deliveries";
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      const list = Array.isArray(data) ? data : [];
      setOrders(list);
      if (tab === "my-deliveries") {
        const delivered = list.filter((o) => o.deliveryStatus === "delivered");
        setCompletedCount(delivered.length);
        setTotalEarnings(delivered.reduce((sum, o) => sum + (o.totalAmount || 0) * 0.15, 0));
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [tab, token]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data) => {
      setNewOrderAlert(data);
      if (tab === "available") loadOrders();
    };

    const handleOrderClaimed = (data) => {
      setOrders((prev) => prev.filter((o) => o._id !== data.orderId));
    };

    const handleAcceptedByPartner = (data) => {
      if (newOrderAlert && (newOrderAlert.orderId === data.orderId || newOrderAlert._id === data.orderId)) {
        setNewOrderAlert(null);
      }
      setOrders((prev) => prev.filter((o) => o._id !== data.orderId));
    };

    socket.on("new_delivery_order", handleNewOrder);
    socket.on("order_claimed", handleOrderClaimed);
    socket.on("order_accepted_by_partner", handleAcceptedByPartner);

    return () => {
      socket.off("new_delivery_order", handleNewOrder);
      socket.off("order_claimed", handleOrderClaimed);
      socket.off("order_accepted_by_partner", handleAcceptedByPartner);
    };
  }, [socket, tab, loadOrders, newOrderAlert]);

  const handleAccept = async (orderId) => {
    setAcceptingId(orderId);
    try {
      const res = await fetch(`${API_URL}/delivery/order/${orderId}/accept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to accept");
      setNewOrderAlert(null);
      setTab("my-deliveries");
      setSelectedOrder(data);
    } catch (err) { alert(err.message); }
    finally { setAcceptingId(null); }
  };

  const handleRejectAlert = () => setNewOrderAlert(null);

  const handleStatusUpdated = (updated) => {
    setSelectedOrder(updated);
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
  };

  // ── Active Order View ─────────────────────────────────────────────────────
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <ActiveOrderPanel
            order={selectedOrder}
            onBack={() => { setSelectedOrder(null); loadOrders(); }}
            onStatusUpdated={handleStatusUpdated}
          />
        </div>
        <IncomingOrderModal
          alertData={newOrderAlert}
          onAccept={handleAccept}
          onReject={handleRejectAlert}
          accepting={!!acceptingId}
        />
      </div>
    );
  }

  // ── Main Dashboard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-teal-600 to-teal-500 text-white rounded-2xl shadow-lg shadow-teal-500/20">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Delivery Hub</h1>
              <p className="text-xs text-gray-500 font-medium">BiteBeam Partner Fleet</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOnline((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                isOnline
                  ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                  : "border-gray-700 bg-gray-800 text-gray-500"
              }`}
            >
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isOnline ? "Online" : "Offline"}
            </button>

            <button
              onClick={loadOrders}
              className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full transition-colors border border-gray-700/50"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>

            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center text-xs font-black text-white shadow-lg border-2 border-gray-800">
              {user?.name?.[0]?.toUpperCase() || "D"}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Activity} label="Socket" value={connected ? "Connected" : "Offline"} accent={connected ? "text-emerald-400" : "text-red-400"} />
          <StatCard icon={Package} label="In Queue" value={orders.length} />
          <StatCard icon={Star} label="Completed" value={completedCount} accent="text-amber-400" />
          <StatCard icon={DollarSign} label="Earnings" value={`₹${totalEarnings.toFixed(0)}`} accent="text-emerald-400" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-800/70 rounded-2xl border border-gray-700/50">
          {["available", "my-deliveries"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                tab === t
                  ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t === "available" ? `Available Orders (${orders.length})` : "My Deliveries"}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
            <AlertCircle size={18} /> <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-gray-500">Loading delivery queue...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-700/50 space-y-3">
            <Package size={48} className="text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-gray-300">No Orders Here</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {tab === "available"
                ? "When customers place orders, they appear here in real-time with a sound alert."
                : "No active deliveries. Switch to Available Orders to pick one up."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-gray-700/50 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5 transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-600">#{order._id?.slice(-8).toUpperCase()}</span>
                      {statusBadge(order.deliveryStatus || "unassigned")}
                      {order.paymentStatus === "paid" && (
                        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                          Paid
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{order.restaurantName || "Restaurant"}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-teal-400" />
                      Pickup: {order.restaurant?.location || "Fort Road, Kannur"}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-rose-400" />
                      Drop: {order.deliveryAddress}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-teal-400">₹{order.totalAmount?.toFixed(0)}</p>
                    <span className="text-[11px] text-gray-500">{order.items?.length || 1} items</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-gray-700/30">
                  {tab === "available" && !order.deliveryPartnerId ? (
                    <button
                      onClick={() => handleAccept(order._id)}
                      disabled={acceptingId === order._id}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                    >
                      {acceptingId === order._id
                        ? <><RefreshCw size={14} className="animate-spin" /> Accepting...</>
                        : <><CheckCircle size={14} /> Accept & Start Run</>
                      }
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2"
                    >
                      <span>Manage Run & GPS</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incoming Order Alert Modal */}
      <IncomingOrderModal
        alertData={newOrderAlert}
        onAccept={handleAccept}
        onReject={handleRejectAlert}
        accepting={!!acceptingId}
      />

      {/* CSS animations */}
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          50% { transform: scale(1.02); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}
