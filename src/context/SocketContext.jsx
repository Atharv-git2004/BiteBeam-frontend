import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

const SOCKET_URL = "http://localhost:5000";

export function SocketProvider({ children }) {
  const { token, user } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      setConnected(true);
      console.log("🔌 Socket connected:", socketRef.current.id);

      // If delivery partner, join their personal room
      if (user?.role === "delivery" && user?._id) {
        socketRef.current.emit("join_delivery_room", user._id);
      }
    });

    socketRef.current.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
    };
  }, [token, user?._id, user?.role]);

  const joinOrderRoom = (orderId) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("join_order_room", orderId);
    }
  };

  const emitLocationUpdate = ({ orderId, lat, lng, deliveryPartnerId }) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("delivery_location_update", { orderId, lat, lng, deliveryPartnerId });
    }
  };

  const onOrderStatusChanged = (callback) => {
    if (!socketRef.current) return () => {};
    socketRef.current.on("order_status_changed", callback);
    return () => socketRef.current?.off("order_status_changed", callback);
  };

  const onLocationUpdated = (callback) => {
    if (!socketRef.current) return () => {};
    socketRef.current.on("location_updated", callback);
    return () => socketRef.current?.off("location_updated", callback);
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        joinOrderRoom,
        emitLocationUpdate,
        onOrderStatusChanged,
        onLocationUpdated,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
}

export default SocketContext;
