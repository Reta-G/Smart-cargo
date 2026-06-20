import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  STATUS_LABELS_EN,
  STATUS_STYLES,
  SHIPMENT_STATUS,
} from "../../utils/shipmentStatus.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ?? "http://localhost:5000";

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

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const MyShipments = () => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("ALL");
  const [q, setQ] = useState("");

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch shipments from backend (customer-only)
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("auth_token");
        if (!token) {
          setShipments([]);
          setError("Missing token. Please login again.");
          return;
        }

        const url = `${API_BASE}/api/user/shipments?limit=200&status=${encodeURIComponent(
          status
        )}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.message || "Failed to load shipments");
        }

        setShipments(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        setShipments([]);
        setError(e?.message || "Server error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [status]);

  // Simple search filter (client-side)
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return shipments;

    return shipments.filter((s) => {
      const text = [
        s.shipmentNo,
        s.client,
        s.origin,
        s.destination,
        s.status,
        s.eta,
        s.driverName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(needle);
    });
  }, [shipments, q]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-300 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            My Shipments
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            View and search all your shipments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/user-dashboard")}
          className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="ALL">All</option>
            <option value={SHIPMENT_STATUS.PENDING}>Pending</option>
            <option value={SHIPMENT_STATUS.IN_TRANSIT}>In transit</option>
            <option value={SHIPMENT_STATUS.DELIVERED}>Delivered</option>
            <option value={SHIPMENT_STATUS.DELAYED}>Delayed</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
            Search
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by shipment no, client, route, status..."
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          Loading shipments...
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Shipments ({filtered.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            Showing results for your account only.
          </p>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
              <tr>
                <th className="px-6 py-4">Shipment</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">ETA</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {!loading && filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-slate-500 dark:text-slate-300"
                  >
                    No shipments found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {s.shipmentNo || s.id}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {s.client || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {s.origin} → {s.destination}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {s.driverName || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {s.eta || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {fmtDate(s.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/my-shipments/${s.id}`)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyShipments;