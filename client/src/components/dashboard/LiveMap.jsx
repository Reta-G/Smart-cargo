import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { vehiclesApi } from "../../api/vehiclesApi.js";

// ✅ Professional: colored marker by status
const statusColor = (status) => {
  switch (status) {
    case "In Transit":
      return "#3b82f6"; // blue
    case "Delivering":
      return "#10b981"; // green
    case "Idle":
      return "#94a3b8"; // gray
    case "Delayed":
      return "#ef4444"; // red
    default:
      return "#6366f1"; // indigo
  }
};

const createDotIcon = (color) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width:14px;height:14px;border-radius:9999px;
        background:${color};
        border:2px solid white;
        box-shadow: 0 8px 18px rgba(0,0,0,0.25);
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const LiveMap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const loadLocations = async () => {
    setError("");
    try {
      const res = await vehiclesApi.locations();
      setVehicles(res.data || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      setError(e.message || "Failed to load vehicle locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();

    // ✅ Optional: refresh every 15 seconds
    const interval = setInterval(loadLocations, 15000);
    return () => clearInterval(interval);
  }, []);

  const center = useMemo(() => {
    if (vehicles.length > 0) {
      return [vehicles[0].lat, vehicles[0].lng];
    }
    return [9.03, 38.74]; // default Addis Ababa
  }, [vehicles]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Live Fleet Map
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
            {loading ? "Loading locations..." : `Last updated: ${lastUpdated || "—"}`}
          </p>
        </div>

        <button
          type="button"
          onClick={loadLocations}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700">
        <MapContainer center={center} zoom={12} className="h-full w-full">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {vehicles.map((v) => (
            <Marker
              key={v.id}
              position={[v.lat, v.lng]}
              icon={createDotIcon(statusColor(v.status))}
            >
              <Popup>
                <strong>{v.name}</strong>
                <br />
                Status: {v.status}
                <br />
                Updated: {v.updatedAt ? new Date(v.updatedAt).toLocaleString() : "—"}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {!loading && !error && vehicles.length === 0 && (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
          No vehicle locations available.
        </p>
      )}
    </div>
  );
};

export default LiveMap;