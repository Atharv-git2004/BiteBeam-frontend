import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api";

// Built-in demo accounts for instant local testing and fallback
const DEMO_USERS = {
  "customer@bitebeam.com": {
    _id: "demo_user_cust_001",
    name: "Demo Customer",
    email: "customer@bitebeam.com",
    role: "user",
    phone: "+91 9876543210",
    token: "demo_jwt_token_customer",
  },
  "seller@bitebeam.com": {
    _id: "demo_user_sell_002",
    name: "Chef Ammachi",
    email: "seller@bitebeam.com",
    role: "seller",
    phone: "+91 9876543211",
    token: "demo_jwt_token_seller",
  },
  "admin@bitebeam.com": {
    _id: "demo_user_adm_003",
    name: "Platform Admin",
    email: "admin@bitebeam.com",
    role: "admin",
    phone: "+91 9876543212",
    token: "demo_jwt_token_admin",
  },
  "delivery@bitebeam.com": {
    _id: "demo_user_del_004",
    name: "Delivery Rajan",
    email: "delivery@bitebeam.com",
    role: "delivery",
    phone: "+91 9876543213",
    token: "demo_jwt_token_delivery",
  },
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("bitebeam_token") || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("bitebeam_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bitebeam_token");
    localStorage.removeItem("bitebeam_user");
  };

  const persist = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("bitebeam_token", jwtToken);
    localStorage.setItem("bitebeam_user", JSON.stringify(userData));
  };

  // Synchronize authenticated user profile and assigned MongoDB role on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem("bitebeam_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (res.ok) {
          const freshUser = await res.json();
          setUser(freshUser);
          localStorage.setItem("bitebeam_user", JSON.stringify(freshUser));
        } else if (res.status === 401) {
          logout();
        }
      } catch (err) {
        console.warn("Could not sync profile with MongoDB server:", err.message);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const register = async (name, email, password, role = "user", phone = "") => {
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    let res, data;
    try {
      res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: cleanEmail,
          password,
          role,
          phone: phone ? phone.trim() : "",
        }),
      });
      data = await res.json();
    } catch (networkErr) {
      // Fallback for CORS or Network error so local testing/registration still works smoothly
      console.warn("Register: Network/CORS error — using local fallback registration", networkErr.message);
      const fallbackUser = {
        _id: "demo_user_" + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        role,
        phone: phone ? phone.trim() : "",
        token: "demo_jwt_token_" + Date.now(),
      };
      persist(fallbackUser, fallbackUser.token);
      return fallbackUser;
    }

    if (!res.ok) {
      console.error("Register: Server rejected —", data);
      throw new Error(data.message || "Registration failed. Please try again.");
    }

    console.log("Register: success —", data.email, "| role:", data.role);
    persist(data, data.token);
    return data;
  };

  const login = async (email, password) => {
    const cleanEmail = email ? email.toLowerCase().trim() : "";

    let res, data;
    try {
      res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      data = await res.json();
    } catch (networkErr) {
      console.warn("Login: Network error —", networkErr.message);
      const demoUser = DEMO_USERS[cleanEmail];
      if (demoUser && (password === "password123" || password === "123456")) {
        console.log("Login: using demo account fallback for", cleanemail);
        persist(demoUser, demoUser.token);
        return demoUser;
      }
      throw new Error("Cannot reach the backend server on port 5000. Please make sure the server is running.");
    }

    if (!res.ok) {
      console.error("Login: Server rejected —", data);
      throw new Error(data.message || "Invalid email or password");
    }

    console.log("Login: success —", data.email, "| role:", data.role);
    persist(data, data.token);
    return data;
  };

  const authFetch = async (path, options = {}) => {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      return data;
    } catch (err) {
      console.warn("authFetch error for", path, err.message);
      throw err;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default AuthContext;
