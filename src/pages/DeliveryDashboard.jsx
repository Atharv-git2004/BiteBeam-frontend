import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Package,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle,
  Truck,
  Navigation,
  ShoppingBag,
  ChefHat,
  AlertCircle,
  RefreshCw,
  Zap,
  Play,
  Square,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import LiveMap from "../components/LiveMap";

const API_URL = "http://localhost:5000/api";

// ── Waypoints for realistic Kannur delivery bike simulation ─────────────────
const SIMULATED_ROUTE = [
  { lat: 11.8689, lng: 75.3712 }, // Restaurant (Fort Road)
  { lat: 11.8702, lng: 75.3705 },
  { lat: 11.8718, lng: 75.3692 },
  { lat: 11.8735, lng: 75.3681 },
  { lat: 11.8752, lng: 75.3670 },
  { lat: 11.8770, lng: 75.3658 },
  { lat: 11.8788, lng: 75.3645 },
  { lat: 11.8805, lng: 75.3633 },
  { lat: 11.8825, lng: 75.3621 }, // Customer Destination (Payyambalam)
];

function statusBadge(deliveryStatus) {
  const map = {
    unassigned: { label: "Ready for Pickup", cls: "bg-amber-100 text-amber-800 border-amber-200" },
    assigned: { label: "Assigned to You", cls: "bg-blue-100 text-blue-800 border-blue-200" },
    picked_up: { label: "Picked Up", cls: "bg-purple-100 text-purple-800 border-purple-200" },
    out_for_delivery: { label: "Out for Delivery", cls: "bg-[#dcf2f2] text-[#004B49] border-[#bce5e4]" },
    delivered: { label: "Delivered ✓", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  };
  const s = map[deliveryStatus] || { label: deliveryStatus, cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ── Active Order Detail & Live GPS/Simulation Panel ─────────────────────────
function ActiveOrderPanel({ order, onBack, onStatusUpdated }) {
  const { token, user } = useAuth();
  const { emitLocationUpdate, connected } = useSocket();

  const [estimatedTime, setEstimatedTime] = useState(order.estimatedDeliveryTime || "15-20 mins");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [currentCoords, setCurrentCoords] = useState(
    order.currentLatLng?.lat ? order.currentLatLng : SIMULATED_ROUTE[0]
  );

  // Real GPS State
  const [realGpsActive, setRealGpsActive] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const watchIdRef = useRef(null);

  // Simulated Bike Movement State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const simTimerRef = useRef(null);

  // Stop real GPS and simulation on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (simTimerRef.current !== null) clearInterval(simTimerRef.current);
    };
  }, []);

  // 1. Real GPS Tracking
  const toggleRealGps = () => {
    if (realGpsActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setRealGpsActive(false);
      return;
    }

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    setGpsError("");
    setRealGpsActive(true);
    // If simulation was running, stop it
    stopSimulation();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const coords = { lat, lng };
        setCurrentCoords(coords);

        // Emit to socket
        emitLocationUpdate({ orderId: order._id, lat, lng, deliveryPartnerId: user?._id });

        // Backup update to REST API
        fetch(`${API_URL}/delivery/order/${order._id}/location`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(coords),
        }).catch(() => {});
      },
      (err) => {
        setGpsError(`GPS Error: ${err.message}`);
        setRealGpsActive(false);
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );
  };

  // 2. Swiggy/Zomato Simulated Bike Movement
  const startSimulation = () => {
    if (isSimulating) {
      stopSimulation();
      return;
    }

    // Stop real GPS if running
    if (realGpsActive) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      setRealGpsActive(false);
    }

    setIsSimulating(true);
    let stepIndex = 0;

    simTimerRef.current = setInterval(() => {
      if (stepIndex >= SIMULATED_ROUTE.length) {
        // Reached destination
        clearInterval(simTimerRef.current);
        simTimerRef.current = null;
        setIsSimulating(false);
        return;
      }

      const pt = SIMULATED_ROUTE[stepIndex];
      setCurrentCoords(pt);
      setSimStep(stepIndex);

      // Broadcast live coordinates to socket room
      emitLocationUpdate({
        orderId: order._id,
        lat: pt.lat,
        lng: pt.lng,
        deliveryPartnerId: user?._id,
      });

      // Persist to DB
      fetch(`${API_URL}/delivery/order/${order._id}/location`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(pt),
      }).catch(() => {});

      stepIndex++;
    }, 1800);
  };

  const stopSimulation = () => {
    if (simTimerRef.current !== null) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setIsSimulating(false);
  };

  // 3. Status Transitions
  const updateStatus = async (statusKey) => {
    setUpdating(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/delivery/order/${order._id}/delivery-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deliveryStatus: statusKey,
          estimatedDeliveryTime: estimatedTime,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      onStatusUpdated(data);

      // Auto start bike simulation if picked up or out for delivery
      if (statusKey === "picked_up" || statusKey === "out_for_delivery") {
        if (!isSimulating && !realGpsActive) {
          startSimulation();
        }
      } else if (statusKey === "delivered") {
        stopSimulation();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const currentDeliveryStatus = order.deliveryStatus || "assigned";
  const progressPercent = Math.round((simStep / (SIMULATED_ROUTE.length - 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Top back nav */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#004B49] font-bold text-sm hover:underline"
      >
        ← Back to Order Requests
      </button>

      {/* Order Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
          <span className="text-xs font-mono text-gray-400">ORDER #{order._id?.slice(-8).toUpperCase()}</span>
          <h2 className="text-xl font-black text-gray-900 mt-0.5">{order.restaurantName || "BiteBeam Restaurant"}</h2>
          <p className="text-xs text-gray-500 mt-1">
            Total Amount: <strong className="text-gray-900 font-bold">₹{order.totalAmount?.toFixed(0)}</strong> • {order.items?.length || 0} Items
          </p>
        </div>
        {statusBadge(currentDeliveryStatus)}
      </div>

      {/* Pickup & Drop Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pickup */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <ChefHat size={14} className="text-[#004B49]" />
            <span>1. Pickup Restaurant</span>
          </div>
          <p className="font-bold text-gray-900 text-base">{order.restaurant?.name || order.restaurantName}</p>
          <p className="text-xs text-gray-600 flex items-start gap-1">
            <MapPin size={12} className="text-[#004B49] shrink-0 mt-0.5" />
            <span>{order.restaurant?.location || "Fort Road, Kannur, Kerala"}</span>
          </p>
        </div>

        {/* Dropoff */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <User size={14} className="text-rose-600" />
            <span>2. Delivery Customer</span>
          </div>
          <p className="font-bold text-gray-900 text-base">{order.user?.name || "Customer"}</p>
          <p className="text-xs text-gray-600 flex items-start gap-1">
            <MapPin size={12} className="text-rose-600 shrink-0 mt-0.5" />
            <span>{order.deliveryAddress || "Kannur, Kerala"}</span>
          </p>
          {order.user?.phone && (
            <a href={`tel:${order.user.phone}`} className="inline-flex items-center gap-1.5 text-xs text-[#004B49] font-bold hover:underline pt-1">
              <Phone size={12} /> Call Customer ({order.user.phone})
            </a>
          )}
        </div>
      </div>

      {/* Status Controls Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Update Delivery Flow</h3>
          <span className="text-xs text-gray-400">Triggers instant push to customer</span>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-200">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Picked up */}
          <button
            onClick={() => updateStatus("picked_up")}
            disabled={updating || currentDeliveryStatus === "delivered"}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-xs ${
              currentDeliveryStatus === "picked_up"
                ? "border-purple-500 bg-purple-50 text-purple-800"
                : "border-gray-100 hover:border-purple-300 bg-gray-50 text-gray-700"
            }`}
          >
            <ShoppingBag size={20} className="text-purple-600" />
            <span>1. Picked Up Order</span>
          </button>

          {/* Out for Delivery */}
          <button
            onClick={() => updateStatus("out_for_delivery")}
            disabled={updating || currentDeliveryStatus === "delivered"}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-xs ${
              currentDeliveryStatus === "out_for_delivery"
                ? "border-[#004B49] bg-[#dcf2f2] text-[#004B49]"
                : "border-gray-100 hover:border-[#004B49]/40 bg-gray-50 text-gray-700"
            }`}
          >
            <Truck size={20} className="text-[#004B49]" />
            <span>2. Out for Delivery</span>
          </button>

          {/* Delivered */}
          <button
            onClick={() => updateStatus("delivered")}
            disabled={updating || currentDeliveryStatus === "delivered"}
            className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-xs ${
              currentDeliveryStatus === "delivered"
                ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                : "border-gray-100 hover:border-emerald-300 bg-gray-50 text-gray-700"
            }`}
          >
            <CheckCircle size={20} className="text-emerald-600" />
            <span>3. Mark Delivered</span>
          </button>
        </div>
      </div>

      {/* Swiggy/Zomato Live GPS & Moving Bike Broadcast Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation size={20} className="text-[#004B49]" />
            <h3 className="font-bold text-gray-900 text-base">GPS Location Broadcast</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-xs font-semibold text-gray-500">{connected ? "Socket Broadcasting" : "Socket Offline"}</span>
          </div>
        </div>

        {/* Live Coordinate readout */}
        {currentCoords && (
          <div className="bg-[#f0f9f9] border border-[#bce5e4] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="font-mono text-[#004B49] font-bold flex items-center gap-2">
              <span className="text-base">📍</span> Lat: {currentCoords.lat.toFixed(5)}, Lng: {currentCoords.lng.toFixed(5)}
            </div>
            {isSimulating && (
              <span className="bg-[#004B49] text-white px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1 shadow-sm">
                <Sparkles size={12} /> Route Progress: {progressPercent}%
              </span>
            )}
          </div>
        )}

        {/* Dual Mode Action Buttons: Real GPS vs Simulated Moving Bike */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Simulation Mode (Best for Testing & Demonstrations) */}
          <button
            type="button"
            onClick={startSimulation}
            disabled={currentDeliveryStatus === "delivered"}
            className={`p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
              isSimulating
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-gradient-to-r from-[#004B49] to-[#005C5E] hover:from-[#003837] hover:to-[#004B49] text-white"
            }`}
          >
            {isSimulating ? (
              <>
                <Square size={16} />
                <span>Pause Bike Simulation</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>Simulate Moving Bike (Swiggy Style)</span>
              </>
            )}
          </button>

          {/* Real Browser GPS Mode */}
          <button
            type="button"
            onClick={toggleRealGps}
            disabled={currentDeliveryStatus === "delivered"}
            className={`p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
              realGpsActive
                ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Navigation size={16} className={realGpsActive ? "text-rose-600 animate-spin" : "text-gray-500"} />
            <span>{realGpsActive ? "Stop Device GPS" : "Use Real Device GPS"}</span>
          </button>
        </div>

        {gpsError && (
          <p className="text-xs text-rose-600 font-medium">{gpsError}</p>
        )}

        {/* In-dashboard Live Leaflet Map */}
        <div className="pt-2">
          <LiveMap
            restaurantName={order.restaurantName || "Restaurant"}
            deliveryAddress={order.deliveryAddress}
            bikeCoords={currentCoords}
            deliveryPartnerName="You (Rider)"
            deliveryStatus={currentDeliveryStatus}
            height="300px"
          />
        </div>
      </div>
    </div>
  );
}

// ── Main Delivery Dashboard Screen ──────────────────────────────────────────
export default function DeliveryDashboard() {
  const { token, user } = useAuth();
  const { socket, connected } = useSocket();

  const [tab, setTab] = useState("available"); // "available" | "my-deliveries"
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  // Load orders
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    const endpoint = tab === "available" ? "/delivery/available-orders" : "/delivery/my-deliveries";
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tab, token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Real-time listener for incoming customer orders
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data) => {
      setNewOrderAlert(data);
      // If currently on Available Orders tab, refresh or prepend to list
      if (tab === "available") {
        loadOrders();
      }
    };

    const handleOrderClaimed = (data) => {
      // Remove claimed order from list if someone else took it
      setOrders((prev) => prev.filter((o) => o._id !== data.orderId));
    };

    socket.on("new_delivery_order", handleNewOrder);
    socket.on("order_claimed", handleOrderClaimed);

    return () => {
      socket.off("new_delivery_order", handleNewOrder);
      socket.off("order_claimed", handleOrderClaimed);
    };
  }, [socket, tab, loadOrders]);

  // Accept Order
  const handleAccept = async (orderId) => {
    setAcceptingId(orderId);
    try {
      const res = await fetch(`${API_URL}/delivery/order/${orderId}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to accept order");

      setNewOrderAlert(null);
      setTab("my-deliveries");
      setSelectedOrder(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleStatusUpdated = (updated) => {
    setSelectedOrder(updated);
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
  };

  // If viewing an active order
  if (selectedOrder) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <ActiveOrderPanel
          order={selectedOrder}
          onBack={() => {
            setSelectedOrder(null);
            loadOrders();
          }}
          onStatusUpdated={handleStatusUpdated}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-[#004B49] to-[#005C5E] text-white rounded-2xl shadow-md">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Delivery Dashboard</h1>
              <p className="text-xs text-gray-500 font-medium">BiteBeam Partner Fleet Portal</p>
            </div>
          </div>
        </div>

        <button
          onClick={loadOrders}
          className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
          title="Refresh orders"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Real-time Incoming Order Alert Banner */}
      {newOrderAlert && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-bold text-sm">New Delivery Order Available!</p>
              <p className="text-xs opacity-90">
                {newOrderAlert.restaurantName} • {newOrderAlert.restaurantLocation}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAccept(newOrderAlert.orderId)}
            className="bg-white text-gray-900 hover:bg-amber-50 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all shrink-0"
          >
            Accept Now
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
        <button
          onClick={() => setTab("available")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === "available"
              ? "bg-[#004B49] text-white shadow-md"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Available Orders ({orders.length})
        </button>
        <button
          onClick={() => setTab("my-deliveries")}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            tab === "my-deliveries"
              ? "bg-[#004B49] text-white shadow-md"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Active Deliveries
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-4 rounded-2xl border border-red-200">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-[#004B49] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-400">Loading delivery queue...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <Package size={48} className="text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">No Orders in this Tab</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {tab === "available"
              ? "When customers place orders from restaurants in Kannur, they will appear here in real-time."
              : "You do not have any deliveries in progress right now. Switch to Available Orders to pick up a delivery."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:border-[#004B49]/40 hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">#{order._id?.slice(-8).toUpperCase()}</span>
                    {statusBadge(order.deliveryStatus || "unassigned")}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{order.restaurantName || "Restaurant"}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-[#004B49]" />
                    <span>Pickup: {order.restaurant?.location || "Fort Road, Kannur"}</span>
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-rose-600" />
                    <span>Drop: {order.deliveryAddress}</span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-[#004B49]">₹{order.totalAmount?.toFixed(0)}</p>
                  <span className="text-[11px] text-gray-400">{order.items?.length || 1} items</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                {tab === "available" && !order.deliveryPartnerId ? (
                  <button
                    onClick={() => handleAccept(order._id)}
                    disabled={acceptingId === order._id}
                    className="w-full bg-[#004B49] hover:bg-[#003837] text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {acceptingId === order._id ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Accepting...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} /> Accept & Start Run
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full bg-gradient-to-r from-[#004B49] to-[#005C5E] hover:from-[#003837] hover:to-[#004B49] text-white py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Manage Run & GPS Broadcast</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
