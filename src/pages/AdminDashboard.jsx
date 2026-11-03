import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, ShoppingBag, Store, TrendingUp, Trash2,
  ArrowLeft, Loader2, AlertCircle, Shield, CheckCircle, Search
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ROLE_COLORS = {
  user: "bg-blue-100 text-blue-700",
  seller: "bg-green-100 text-green-700",
  admin: "bg-purple-100 text-purple-700",
};

export default function AdminDashboard() {
  const { user, authFetch } = useAuth();
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, usersData] = await Promise.all([
        authFetch("/admin/stats"),
        authFetch("/admin/users"),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load data. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const changeRole = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const updated = await authFetch(`/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
      showMsg(`Role updated to ${newRole} ✓`);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Permanently delete this user?")) return;
    try {
      await authFetch(`/admin/users/${userId}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      showMsg("User deleted ✓");
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const STAT_CARDS = stats
    ? [
        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-[#004B49] text-white shadow-md shadow-[#004B49]/20" },
        { label: "Customers", value: stats.totalUsers, icon: Users, color: "bg-blue-500 text-white" },
        { label: "Sellers", value: stats.totalSellers, icon: Store, color: "bg-green-500 text-white" },
        { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "bg-purple-500 text-white" },
        { label: "Active Orders", value: stats.activeOrders, icon: TrendingUp, color: "bg-yellow-500 text-white" },
        { label: "Restaurants", value: stats.totalRestaurants, icon: Store, color: "bg-red-400 text-white" },
      ]
    : [];

  const TABS = [
    { id: "stats", label: "Dashboard", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
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
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="text-xl font-black text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500 font-medium">BiteBeam Platform Control</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {success && (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />{success}
              </span>
            )}
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs font-bold text-purple-700">Admin</span>
            </div>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
                tab === t.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{error}</p>
              <p className="text-sm mt-1">Make sure the backend is running on port 5000 and you are logged in as Admin.</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── STATS TAB ── */}
            {tab === "stats" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-black text-gray-900 mb-4">Platform Overview</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {STAT_CARDS.map((card) => (
                      <div key={card.label} className={`${card.color} p-6 rounded-2xl shadow-md`}>
                        <card.icon className="w-7 h-7 mb-3 opacity-80" />
                        <p className="text-3xl font-black">{card.value}</p>
                        <p className="text-sm font-semibold opacity-80 mt-1">{card.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-base font-black text-gray-900 mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((u) => (
                      <div key={u._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                            {u.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[u.role]}`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setTab("users")}
                    className="mt-4 text-sm font-bold text-purple-600 hover:underline"
                  >
                    View all users →
                  </button>
                </div>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {tab === "users" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg font-black text-gray-900">
                    All Users ({users.length})
                  </h2>
                  {/* Search */}
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name or email..."
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-5">User</div>
                    <div className="col-span-3 text-center">Role</div>
                    <div className="col-span-2 text-center hidden sm:block">Joined</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {filteredUsers.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      <p className="font-medium">No users found</p>
                    </div>
                  ) : (
                    filteredUsers.map((u) => (
                      <div
                        key={u._id}
                        className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50/50 transition-colors ${
                          u._id === user?._id ? "bg-purple-50/30" : ""
                        }`}
                      >
                        {/* User info */}
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                            {u.name[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {u.name}
                              {u._id === user?._id && (
                                <span className="ml-1.5 text-[10px] font-bold text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{u.email}</p>
                          </div>
                        </div>

                        {/* Role selector */}
                        <div className="col-span-3 flex justify-center">
                          <select
                            value={u.role}
                            disabled={u._id === user?._id || updatingId === u._id}
                            onChange={(e) => changeRole(u._id, e.target.value)}
                            className={`text-xs font-bold px-2 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:cursor-not-allowed disabled:opacity-50 ${ROLE_COLORS[u.role]}`}
                          >
                            <option value="user">user</option>
                            <option value="seller">seller</option>
                            <option value="admin">admin</option>
                          </select>
                        </div>

                        {/* Joined date */}
                        <div className="col-span-2 text-center hidden sm:block">
                          <span className="text-xs text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex justify-end">
                          {u._id !== user?._id && (
                            <button
                              onClick={() => deleteUser(u._id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
