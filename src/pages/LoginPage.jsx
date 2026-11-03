import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect user based on their MongoDB role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") navigate("/admin", { replace: true });
      else if (user.role === "seller") navigate("/seller", { replace: true });
      else if (user.role === "delivery") navigate("/delivery/dashboard", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      
      // Role-Based Redirection Post-Login based on MongoDB user.role
      if (loggedInUser?.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (loggedInUser?.role === "seller") {
        navigate("/seller", { replace: true });
      } else if (loggedInUser?.role === "delivery") {
        navigate("/delivery/dashboard", { replace: true });
      } else {
        // Standard user: redirect to main User Page/Home Page or customer destination
        const destination = (from && !from.startsWith("/admin") && !from.startsWith("/seller") && !from.startsWith("/delivery")) ? from : "/";
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <div className="bg-gradient-to-tr from-[#004B49] to-[#005C5E] p-2.5 rounded-2xl shadow-md shadow-[#004B49]/20">
              <Zap className="h-7 w-7 text-white" fill="currentColor" />
            </div>
            <span className="text-3xl font-black text-gray-900">
              Bite<span className="text-[#005C5E]">Beam</span>
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-black text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to your account with your email and password
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005C5E] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005C5E] focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004B49] hover:bg-[#003837] disabled:opacity-60 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons for Testing */}
          <div className="pt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
              Quick Demo Fill (Instant Test)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ email: "customer@bitebeam.com", password: "password123" })}
                className="text-xs py-2 px-3 bg-teal-50 hover:bg-teal-100 text-[#004B49] font-medium rounded-lg border border-teal-200 transition text-center"
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: "delivery@bitebeam.com", password: "password123" })}
                className="text-xs py-2 px-3 bg-cyan-50 hover:bg-cyan-100 text-[#005C5E] font-medium rounded-lg border border-cyan-200 transition text-center"
              >
                🛵 Delivery Partner
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: "seller@bitebeam.com", password: "password123" })}
                className="text-xs py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium rounded-lg border border-amber-200 transition text-center"
              >
                🏪 Restaurant Seller
              </button>
              <button
                type="button"
                onClick={() => setForm({ email: "admin@bitebeam.com", password: "password123" })}
                className="text-xs py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 font-medium rounded-lg border border-purple-200 transition text-center"
              >
                👑 Admin
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 pt-2 border-t border-gray-100">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#005C5E] font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
