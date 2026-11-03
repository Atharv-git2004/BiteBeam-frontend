import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default coordinates for Kannur, Kerala
const DEFAULT_RESTAURANT = { lat: 11.8689, lng: 75.3712 };
const DEFAULT_CUSTOMER = { lat: 11.8825, lng: 75.3621 };

export default function LiveMap({
  restaurantLocation,
  restaurantName = "Restaurant",
  deliveryAddress = "Customer Address",
  bikeCoords = null,
  deliveryPartnerName = "Delivery Partner",
  deliveryStatus = "on_the_way",
  height = "380px",
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const bikeMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const markersGroupRef = useRef(null);

  // Parse or provide fallback lat/lng for restaurant & customer
  const restCoords =
    restaurantLocation?.lat && restaurantLocation?.lng
      ? { lat: restaurantLocation.lat, lng: restaurantLocation.lng }
      : DEFAULT_RESTAURANT;

  const destCoords = DEFAULT_CUSTOMER;

  // Initialize Map — runs only once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const centerLat = (restCoords.lat + destCoords.lat) / 2;
    const centerLng = (restCoords.lng + destCoords.lng) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // ✅ 100% FREE OpenStreetMap tiles — no API key, no billing required
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markersGroup = L.featureGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Restaurant Marker
    const restaurantIcon = L.divIcon({
      className: "",
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="background:#004B49;color:white;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 12px rgba(0,75,73,0.45);border:2.5px solid white;">
            🍽️
          </div>
          <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid #004B49;margin-top:-1px;"></div>
        </div>`,
      iconSize: [38, 50],
      iconAnchor: [19, 50],
      popupAnchor: [0, -50],
    });

    L.marker([restCoords.lat, restCoords.lng], { icon: restaurantIcon })
      .bindPopup(
        `<b style="color:#004B49">${restaurantName}</b><br/><span style="color:#666;font-size:12px;">📍 Pickup Point</span>`
      )
      .addTo(markersGroup);

    // Customer Destination Marker
    const customerIcon = L.divIcon({
      className: "",
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="background:#e11d48;color:white;width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 4px 12px rgba(225,29,72,0.4);border:2.5px solid white;">
            🏠
          </div>
          <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid #e11d48;margin-top:-1px;"></div>
        </div>`,
      iconSize: [38, 50],
      iconAnchor: [19, 50],
      popupAnchor: [0, -50],
    });

    L.marker([destCoords.lat, destCoords.lng], { icon: customerIcon })
      .bindPopup(
        `<b style="color:#e11d48">Your Delivery Address</b><br/><span style="color:#666;font-size:12px;">${deliveryAddress}</span>`
      )
      .addTo(markersGroup);

    // Initial route polyline
    const routeLine = L.polyline(
      [
        [restCoords.lat, restCoords.lng],
        [destCoords.lat, destCoords.lng],
      ],
      { color: "#004B49", weight: 4, dashArray: "8, 10", opacity: 0.65 }
    ).addTo(map);
    routeLineRef.current = routeLine;

    try {
      map.fitBounds(markersGroup.getBounds(), { padding: [50, 50] });
    } catch (e) {}

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      bikeMarkerRef.current = null;
      routeLineRef.current = null;
      markersGroupRef.current = null;
    };
  }, []); // eslint-disable-line

  // Update/animate moving bike marker whenever bikeCoords changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const bikeLat =
      bikeCoords?.lat ??
      (deliveryStatus === "delivered" ? destCoords.lat : restCoords.lat);
    const bikeLng =
      bikeCoords?.lng ??
      (deliveryStatus === "delivered" ? destCoords.lng : restCoords.lng);

    const bikeIcon = L.divIcon({
      className: "",
      html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:52px;height:52px;border-radius:50%;background:rgba(0,92,94,0.22);animation:leaflet-ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:42px;height:42px;border-radius:50%;background:#005C5E;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 6px 18px rgba(0,0,0,0.28);">
            🛵
          </div>
        </div>`,
      iconSize: [52, 52],
      iconAnchor: [26, 26],
    });

    if (!bikeMarkerRef.current) {
      bikeMarkerRef.current = L.marker([bikeLat, bikeLng], {
        icon: bikeIcon,
        zIndexOffset: 1000,
      })
        .bindPopup(
          `<b>${deliveryPartnerName}</b><br/><span style="color:#005C5E;font-weight:bold;">🛵 On the move</span>`
        )
        .addTo(map);
    } else {
      bikeMarkerRef.current.setLatLng([bikeLat, bikeLng]);
    }

    if (routeLineRef.current) {
      routeLineRef.current.setLatLngs([
        [restCoords.lat, restCoords.lng],
        [bikeLat, bikeLng],
        [destCoords.lat, destCoords.lng],
      ]);
    }

    // Pan smoothly to follow bike when real coords arrive
    if (bikeCoords?.lat && bikeCoords?.lng) {
      map.panTo([bikeCoords.lat, bikeCoords.lng], { animate: true, duration: 0.8 });
    }
  }, [bikeCoords, deliveryPartnerName, deliveryStatus]); // eslint-disable-line

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-gray-100">
      {/* Inject ping animation */}
      <style>{`
        @keyframes leaflet-ping {
          0% { transform: scale(0.8); opacity: 0.8; }
          70% { transform: scale(2); opacity: 0; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

      <div ref={mapContainerRef} style={{ width: "100%", height }} />

      {/* Live GPS badge */}
      <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-gray-100 flex items-center gap-2 text-xs font-bold text-[#004B49]">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>OpenStreetMap · Live GPS</span>
      </div>

      {/* Fit bounds button */}
      <button
        type="button"
        onClick={() => {
          if (mapInstanceRef.current && markersGroupRef.current) {
            try {
              mapInstanceRef.current.fitBounds(
                markersGroupRef.current.getBounds(),
                { padding: [50, 50] }
              );
            } catch (e) {}
          }
        }}
        className="absolute bottom-3 right-3 z-[400] bg-white/90 backdrop-blur-md hover:bg-white text-gray-700 px-3 py-1.5 rounded-xl shadow-md border border-gray-200 text-xs font-semibold transition-all hover:scale-105"
      >
        🗺 Fit Route
      </button>
    </div>
  );
}
