import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChefHat, Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  ClipboardList, Store, AlertCircle, CheckCircle, X,
  ArrowLeft, Loader2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FileUpload from "../components/FileUpload";

const STATUS_FLOW = {
  confirmed: { next: "preparing", label: "Start Preparing", color: "text-[#004B49] bg-[#dcf2f2] border-[#bce5e4]" },
  preparing: { next: "on_the_way", label: "Out for Delivery", color: "text-blue-600 bg-blue-50 border-blue-200" },
  on_the_way: { next: "delivered", label: "Mark Delivered", color: "text-[#005C5E] bg-[#f0f9f9] border-[#bce5e4]" },
  delivered: { next: null, label: "Delivered ✓", color: "text-gray-600 bg-gray-50 border-gray-200" },
  cancelled: { next: null, label: "Cancelled", color: "text-red-600 bg-red-50 border-red-200" },
};

const STATUS_BADGE = {
  confirmed: "bg-[#dcf2f2] text-[#004B49]",
  preparing: "bg-yellow-100 text-yellow-700",
  on_the_way: "bg-blue-100 text-blue-700",
  delivered: "bg-[#dcf2f2] text-[#005C5E]",
  cancelled: "bg-red-100 text-red-700",
};

const EMPTY_DISH = {
  name: "", price: "", category: "Main Course", description: "",
  image: "", isVeg: true, isBestseller: false, isAvailable: true,
};

export default function SellerDashboard() {
  const { user, authFetch } = useAuth();
  const [tab, setTab] = useState("orders");
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dish modal state
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishForm, setDishForm] = useState(EMPTY_DISH);
  const [saving, setSaving] = useState(false);

  // Restaurant form state
  const [restaurantForm, setRestaurantForm] = useState({
    name: "", location: "", time: "25-30 mins",
    priceForTwo: "₹350 for two", isVeg: false, image: "", tags: [],
  });
  const [savingRestaurant, setSavingRestaurant] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [restData, dishData, orderData] = await Promise.allSettled([
        authFetch("/restaurants/my-restaurant"),
        authFetch("/dishes/my-dishes"),
        authFetch("/orders/seller-orders"),
      ]);

      if (restData.status === "fulfilled" && restData.value) {
        setRestaurant(restData.value);
        setRestaurantForm({
          name: restData.value.name || "",
          location: restData.value.location || "",
          time: restData.value.time || "25-30 mins",
          priceForTwo: restData.value.priceForTwo || "₹350 for two",
          isVeg: restData.value.isVeg || false,
          image: restData.value.image || "",
          tags: restData.value.tags || [],
        });
      } else {
        // No restaurant profile registered yet; direct seller to set it up
        setRestaurant(null);
        setTab("restaurant");
      }

      if (dishData.status === "fulfilled" && Array.isArray(dishData.value)) {
        setDishes(dishData.value);
      }
      if (orderData.status === "fulfilled" && Array.isArray(orderData.value)) {
        setOrders(orderData.value);
      }
    } catch (err) {
      setError("Failed to load seller information. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const showMsg = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  // ── DISH CRUD ──
  const openAddDish = () => {
    setEditingDish(null);
    setDishForm(EMPTY_DISH);
    setShowDishModal(true);
  };

  const openEditDish = (dish) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name, price: dish.price, category: dish.category,
      description: dish.description, image: dish.image,
      isVeg: dish.isVeg, isBestseller: dish.isBestseller, isAvailable: dish.isAvailable,
    });
    setShowDishModal(true);
  };

  const saveDish = async () => {
    if (!restaurant) return alert("Please save your restaurant profile first.");
    setSaving(true);
    try {
      if (editingDish) {
        const updated = await authFetch(`/dishes/${editingDish._id}`, {
          method: "PUT",
          body: JSON.stringify({ ...dishForm, price: Number(dishForm.price) }),
        });
        setDishes((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
        showMsg("Dish updated ✓");
      } else {
        const created = await authFetch("/dishes", {
          method: "POST",
          body: JSON.stringify({
            ...dishForm,
            price: Number(dishForm.price),
            restaurantId: restaurant._id,
          }),
        });
        setDishes((prev) => [...prev, created]);
        showMsg("Dish added ✓");
      }
      setShowDishModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteDish = async (id) => {
    if (!confirm("Remove this dish?")) return;
    try {
      await authFetch(`/dishes/${id}`, { method: "DELETE" });
      setDishes((prev) => prev.filter((d) => d._id !== id));
      showMsg("Dish removed ✓");
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleAvailability = async (dish) => {
    try {
      const updated = await authFetch(`/dishes/${dish._id}`, {
        method: "PUT",
        body: JSON.stringify({ isAvailable: !dish.isAvailable }),
      });
      setDishes((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
    } catch (err) {
      alert(err.message);
    }
  };

  // ── ORDER STATUS UPDATE ──
  const advanceOrderStatus = async (order) => {
    const next = STATUS_FLOW[order.status]?.next;
    if (!next) return;
    try {
      const updated = await authFetch(`/orders/${order._id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: next }),
      });
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      showMsg(`Order status → ${next.replace("_", " ")} ✓`);
    } catch (err) {
      alert(err.message);
    }
  };

  // ── RESTAURANT SAVE ──
  const saveRestaurant = async () => {
    if (!restaurantForm.name?.trim() || !restaurantForm.location?.trim()) {
      alert("Please enter both Restaurant Name and Location.");
      return;
    }
    setSavingRestaurant(true);
    try {
      let updated;
      if (restaurant && restaurant._id) {
        updated = await authFetch(`/restaurants/${restaurant._id}`, {
          method: "PUT",
          body: JSON.stringify(restaurantForm),
        });
      } else {
        updated = await authFetch("/restaurants", {
          method: "POST",
          body: JSON.stringify(restaurantForm),
        });
      }
      setRestaurant(updated);
      showMsg("Restaurant profile saved ✓");
      loadAll();
    } catch (err) {
      alert(err.message || "Failed to save restaurant");
    } finally {
      setSavingRestaurant(false);
    }
  };

  const TABS = [
    { id: "orders", label: "Orders", icon: ClipboardList, count: orders.filter(o => o.status !== "delivered").length },
    { id: "menu", label: "Menu", icon: ChefHat, count: dishes.length },
    { id: "restaurant", label: "Restaurant", icon: Store, count: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-900">Seller Dashboard</h1>
              <p className="text-sm text-gray-500">
                {restaurant ? restaurant.name : "Set up your restaurant"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {success && (
              <span className="text-xs font-bold text-[#004B49] bg-[#dcf2f2] px-3 py-1.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />{success}
              </span>
            )}
            <div className="w-9 h-9 rounded-full bg-[#dcf2f2] flex items-center justify-center text-sm font-bold text-[#004B49]">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex gap-1 pb-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                tab === t.id
                  ? "border-[#004B49] text-[#004B49]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.count != null && t.count > 0 && (
                <span className="bg-[#004B49] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#004B49] animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{error}</p>
              <p className="text-sm mt-1">Make sure the backend server is running on port 5000.</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── ORDERS TAB ── */}
            {tab === "orders" && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-gray-900">
                  Incoming Orders ({orders.length})
                </h2>
                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No orders yet</p>
                  </div>
                ) : (
                  orders.map((order) => {
                    const sf = STATUS_FLOW[order.status];
                    return (
                      <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <p className="font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {order.user?.name || "Customer"} • {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_BADGE[order.status]}`}>
                            {order.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-gray-700">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>₹{order.totalAmount}</span>
                          </div>
                        </div>

                        {sf?.next && (
                          <button
                            onClick={() => advanceOrderStatus(order)}
                            className={`text-sm font-bold px-4 py-2 rounded-xl border transition-all hover:opacity-80 ${sf.color}`}
                          >
                            {sf.label} →
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ── MENU TAB ── */}
            {tab === "menu" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-gray-900">Menu Items ({dishes.length})</h2>
                  <button
                    onClick={openAddDish}
                    className="flex items-center gap-2 bg-[#004B49] hover:bg-[#003837] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Dish
                  </button>
                </div>

                {dishes.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                    <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No dishes yet. Add your first one!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dishes.map((dish) => (
                      <div key={dish._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="relative h-36">
                          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                          {!dish.isAvailable && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className={`w-3 h-3 rounded-sm border ${dish.isVeg ? "border-green-600" : "border-red-600"} flex items-center justify-center`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${dish.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                                </div>
                                <span className="font-bold text-gray-900 text-sm">{dish.name}</span>
                              </div>
                              <p className="text-[#004B49] font-black">₹{dish.price}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{dish.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => toggleAvailability(dish)}
                              className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                                dish.isAvailable ? "text-[#005C5E]" : "text-gray-400"
                              }`}
                            >
                              {dish.isAvailable
                                ? <ToggleRight className="w-5 h-5 text-[#004B49]" />
                                : <ToggleLeft className="w-5 h-5" />}
                              {dish.isAvailable ? "In Stock" : "Out of Stock"}
                            </button>
                            <div className="flex gap-2">
                              <button onClick={() => openEditDish(dish)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteDish(dish._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── RESTAURANT TAB ── */}
            {tab === "restaurant" && (
              <div className="max-w-2xl">
                <h2 className="text-lg font-black text-gray-900 mb-6">
                  {restaurant ? "Edit Restaurant Profile" : "Set Up Your Restaurant"}
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 shadow-sm">
                  {[
                    { label: "Restaurant Name", name: "name", type: "text", placeholder: "e.g. Ammachi's Kitchen" },
                    { label: "Location / Area", name: "location", type: "text", placeholder: "e.g. Kannur Town" },
                    { label: "Delivery Time", name: "time", type: "text", placeholder: "e.g. 25-30 mins" },
                    { label: "Price for Two", name: "priceForTwo", type: "text", placeholder: "e.g. ₹350 for two" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        value={restaurantForm[field.name]}
                        onChange={(e) => setRestaurantForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005C5E] transition"
                      />
                    </div>
                  ))}

                  {/* Real File Upload for Restaurant Cover Image */}
                  <FileUpload
                    label="Restaurant Cover Photo"
                    value={restaurantForm.image}
                    onChange={(url) => setRestaurantForm((prev) => ({ ...prev, image: url }))}
                    aspectRatio="video"
                  />

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={restaurantForm.tags.join(", ")}
                      onChange={(e) => setRestaurantForm(prev => ({
                        ...prev,
                        tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean),
                      }))}
                      placeholder="Indian, Biryani, Seafood"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005C5E] transition"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={restaurantForm.isVeg}
                      onChange={(e) => setRestaurantForm(prev => ({ ...prev, isVeg: e.target.checked }))}
                      className="w-4 h-4 accent-[#004B49]"
                    />
                    <span className="text-sm font-semibold text-gray-700">Pure Vegetarian Restaurant</span>
                  </label>

                  <button
                    onClick={saveRestaurant}
                    disabled={savingRestaurant}
                    className="w-full bg-[#004B49] hover:bg-[#003837] text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-60"
                  >
                    {savingRestaurant ? "Saving..." : restaurant ? "Update Restaurant" : "Create Restaurant"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── DISH MODAL ── */}
      {showDishModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">
                {editingDish ? "Edit Dish" : "Add New Dish"}
              </h3>
              <button onClick={() => setShowDishModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Dish Name", name: "name", type: "text", placeholder: "e.g. Malabar Biryani" },
                { label: "Price (₹)", name: "price", type: "number", placeholder: "e.g. 180" },
                { label: "Category", name: "category", type: "text", placeholder: "e.g. Biryani" },
                { label: "Description", name: "description", type: "text", placeholder: "Short dish description..." },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={dishForm[field.name]}
                    onChange={(e) => setDishForm(prev => ({ ...prev, [field.name]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005C5E] transition"
                  />
                </div>
              ))}

              {/* Real File Upload for Dish Photo */}
              <FileUpload
                label="Dish Photo"
                value={dishForm.image}
                onChange={(url) => setDishForm((prev) => ({ ...prev, image: url }))}
                aspectRatio="square"
              />

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={dishForm.isVeg}
                    onChange={(e) => setDishForm(p => ({ ...p, isVeg: e.target.checked }))}
                    className="w-4 h-4 accent-green-600" />
                  <span className="text-sm font-semibold text-gray-700">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={dishForm.isBestseller}
                    onChange={(e) => setDishForm(p => ({ ...p, isBestseller: e.target.checked }))}
                    className="w-4 h-4 accent-[#004B49]" />
                  <span className="text-sm font-semibold text-gray-700">Bestseller</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDishModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveDish}
                  disabled={saving || !dishForm.name || !dishForm.price}
                  className="flex-1 py-3 rounded-xl bg-[#004B49] hover:bg-[#003837] text-white font-bold text-sm transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingDish ? "Update Dish" : "Add Dish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
