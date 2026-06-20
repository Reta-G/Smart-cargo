import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

import { STATUS_LABELS_EN, STATUS_STYLES } from "../../utils/shipmentStatus.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ?? "http://localhost:5000";
const POLL_MS = 10_000;

// Fix missing marker icons in Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const StatusPill = ({ status }) => {
  const cls =
    STATUS_STYLES[status] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
  const label = STATUS_LABELS_EN[status] || status || "—";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>
      {label}
    </span>
  );
};

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const Field = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
      {label}
    </div>
    <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
      {value ?? "—"}
    </div>
  </div>
);

// recenters map when coords change
const Recenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (typeof lat === "number" && typeof lng === "number") {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
};

const ShipmentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);
  const timerRef = useRef(null);

  const token = () => localStorage.getItem("auth_token");

  const fetchShipment = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
        setError("");
      }

      const t = token();
      if (!t) {
        setShipment(null);
        setError("Missing token. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/shipments/${id}`, {
        headers: { Authorization: `Bearer ${t}` },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to load shipment");

      setShipment(json.data);
      setLastRefreshedAt(new Date().toISOString());

      // Once delivered, you may stop polling (optional but professional)
      if (json.data?.status === "DELIVERED" && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } catch (e) {
      // On silent refresh: don’t wipe UI, just show small error
      if (silent) {
        setError(e?.message || "Auto-refresh error");
      } else {
        setShipment(null);
        setError(e?.message || "Server error");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial load + polling
  useEffect(() => {
    if (!id) return;

    fetchShipment({ silent: false });

    timerRef.current = setInterval(() => {
      fetchShipment({ silent: true });
    }, POLL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const lat = shipment?.currentLat ?? null;
  const lng = shipment?.currentLng ?? null;

  const hasLocation = useMemo(() => {
    return (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !Number.isNaN(lat) &&
      !Number.isNaN(lng)
    );
  }, [lat, lng]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-300 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Shipment Details
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Auto-refreshing every {POLL_MS / 1000}s.
            {lastRefreshedAt ? (
              <>
                {" "}
                Last refreshed: <b>{fmtDateTime(lastRefreshedAt)}</b>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate("/my-shipments")}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            Back to My Shipments
          </button>

          <button
            type="button"
            onClick={() => navigate("/user-dashboard")}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          Loading shipment...
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {!loading && shipment && (
        <>
          {/* Summary */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                  Shipment
                </div>
                <div className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                  {shipment.shipmentNo || shipment.id}
                </div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {shipment.origin} → {shipment.destination}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusPill status={shipment.status} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Client" value={shipment.client} />
            <Field label="Origin" value={shipment.origin} />
            <Field label="Destination" value={shipment.destination} />
            <Field label="ETA" value={shipment.eta || "—"} />
            <Field label="Driver" value={shipment.driverName || "—"} />
            <Field label="Last Location Time" value={fmtDateTime(shipment.lastLocationAt)} />
            <Field label="Created At" value={fmtDateTime(shipment.createdAt)} />
            <Field label="Updated At" value={fmtDateTime(shipment.updatedAt)} />
            {shipment.status === "DELIVERED" && (
              <>
                <Field label="Delivered At" value={fmtDateTime(shipment.deliveredAt)} />
                <Field label="Received By" value={shipment.recipientName || "—"} />
                <Field label="Delivery Notes" value={shipment.deliveryNotes || "—"} />
              </>
            )}
          </div>

          {/* Map */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Location (Last Known)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Marker updates automatically when the driver sends new location.
              </p>
            </div>

            {!hasLocation ? (
              <div className="px-6 py-10 text-sm text-slate-600 dark:text-slate-300">
                No location available yet. (Driver has not sent location updates.)
              </div>
            ) : (
              <div className="h-[420px]">
                <MapContainer
                  center={[lat, lng]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Recenter lat={lat} lng={lng} />

                  <Marker position={[lat, lng]}>
                    <Popup>
                      <div className="text-sm">
                        <div className="font-bold">{shipment.shipmentNo}</div>
                        <div>
                          Lat: {lat}, Lng: {lng}
                        </div>
                        <div>Time: {fmtDateTime(shipment.lastLocationAt)}</div>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShipmentDetails;