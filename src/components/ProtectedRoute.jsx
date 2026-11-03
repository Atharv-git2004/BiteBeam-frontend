import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute wraps route elements and strictly redirects unauthenticated
 * or unauthorized users. Pass allowedRoles={['admin']} or allowedRoles={['seller']} to restrict by role.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // While rehydrating auth state and verifying session with backend, show spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#004B49] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-semibold text-sm">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to unified login page, remembering where they intended to go
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization against the user's MongoDB assigned role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role || "user";
    if (!allowedRoles.includes(userRole)) {
      // Forbidden: redirect to their authorized landing page
      if (userRole === "admin") return <Navigate to="/admin" replace />;
      if (userRole === "seller") return <Navigate to="/seller" replace />;
      if (userRole === "delivery") return <Navigate to="/delivery/dashboard" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
