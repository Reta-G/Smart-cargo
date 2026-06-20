import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../AuthContext";
import {
  STATUS_LABELS_EN,
  STATUS_STYLES,
  SHIPMENT_STATUS,
} from "../../utils/shipmentStatus.js";
import InstantQuoteModal from "../../components/InstantQuoteModal.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ?? "http://localhost:5000";

const kpiCardBase =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800";

const KpiCard = ({ label, value, hint }) => (
  <div className={kpiCardBase}>
    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
      {label}
    </p>
    <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
      {value}
    </p>
    {hint && (
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">{hint}</p>
    )}
  </div>
);

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

// Request status pill (for NEW/APPROVED/REJECTED)
const reqStatusStyles = {
  NEW: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  APPROVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
};

const RequestStatusPill = ({ status }) => {
  const cls =
    reqStatusStyles[status] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>
      {status || "—"}
    </span>
  );
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const Modal = ({ open, title, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* backdrop */}
      <button
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* panel */}
      <div
        className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              Admin will review your request and arrange the shipment.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Shipments
  const [shipments, setShipments] = useState([]);
  const [loadingShipments, setLoadingShipments] = useState(true);
  const [shipmentsError, setShipmentsError] = useState("");

  // Requests (recent 3)
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState("");

  // Request modal + form
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [notes, setNotes] = useState("");
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");
  const [requestErr, setRequestErr] = useState("");

  const token = () => localStorage.getItem("auth_token");

  const loadShipments = async () => {
    try {
      setLoadingShipments(true);
      setShipmentsError("");

      const t = token();
      if (!t) {
        setShipments([]);
        setShipmentsError("Missing token. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/shipments?limit=50`, {
        headers: { Authorization: `Bearer ${t}` },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to load shipments");

      setShipments(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setShipments([]);
      setShipmentsError(e?.message || "Server error");
    } finally {
      setLoadingShipments(false);
    }
  };

  const loadRequests = async () => {
    try {
      setLoadingRequests(true);
      setRequestsError("");

      const t = token();
      if (!t) {
        setRequests([]);
        setRequestsError("Missing token. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/requests?limit=3`, {
        headers: { Authorization: `Bearer ${t}` },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to load requests");

      setRequests(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setRequests([]);
      setRequestsError(e?.message || "Server error");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadShipments();
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myShipments = useMemo(() => (shipments || []).slice(0, 6), [shipments]);

  const stats = useMemo(() => {
    const total = shipments.length;
    const inTransit = shipments.filter((s) => s.status === SHIPMENT_STATUS.IN_TRANSIT).length;
    const delivered = shipments.filter((s) => s.status === SHIPMENT_STATUS.DELIVERED).length;
    const pending = shipments.filter((s) => s.status === SHIPMENT_STATUS.PENDING).length;
    const delayed = shipments.filter((s) => s.status === SHIPMENT_STATUS.DELAYED).length;
    return { total, inTransit, delivered, pending, delayed };
  }, [shipments]);

  const resetRequestMessages = () => {
    setRequestMsg("");
    setRequestErr("");
  };

  const openModal = () => {
    resetRequestMessages();
    setOpenRequestModal(true);
  };

  const closeModal = () => {
    setOpenRequestModal(false);
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    resetRequestMessages();

    try {
      setSubmittingRequest(true);

      const t = token();
      if (!t) {
        setRequestErr("Missing token. Please login again.");
        return;
      }

      if (!origin.trim() || !destination.trim()) {
        setRequestErr("Origin and Destination are required.");
        return;
      }

      const payload = {
        origin: origin.trim(),
        destination: destination.trim(),
        cargoType: cargoType.trim() || undefined,
        weightKg: weightKg === "" ? undefined : Number(weightKg),
        notes: notes.trim() || undefined,
      };

      const res = await fetch(`${API_BASE}/api/user/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to create request");

      setRequestMsg(`Request created: ${json.data.requestNo}`);

      // clear form
      setOrigin("");
      setDestination("");
      setCargoType("");
      setWeightKg("");
      setNotes("");

      // refresh recent list
      await loadRequests();
    } catch (err) {
      setRequestErr(err?.message || "Server error");
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-300 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t("dashboard.user.title") || "User Dashboard"}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Welcome, <b>{user?.name || "User"}</b>. {t("dashboard.user.description") || "Here is your shipment overview."}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
          >
            Get Instant Quote
          </button>

          <button
            type="button"
            onClick={openModal}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            {t("user.request_shipment") || "Request Shipment"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/my-shipments")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            {t("user.my_shipments") || "My Shipments"}
          </button>
        </div>
      </div>

      {/* Request modal */}
      <Modal open={openRequestModal} title="Request a Shipment" onClose={closeModal}>
        {requestErr && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
            {requestErr}
          </div>
        )}
        {requestMsg && (
          <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-200">
            {requestMsg}
          </div>
        )}

        <form onSubmit={submitRequest} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Origin (From) *"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination (To) *"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value)}
            placeholder="Cargo type (optional)"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="Weight (kg) (optional)"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="sm:col-span-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            rows={3}
          />
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setOrigin("");
                setDestination("");
                setCargoType("");
                setWeightKg("");
                setNotes("");
                resetRequestMessages();
              }}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={submittingRequest}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-70"
            >
              {submittingRequest ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Loading / Error for shipments */}
      {loadingShipments && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          Loading your shipments...
        </div>
      )}
      {shipmentsError && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
          {shipmentsError}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total Shipments" value={stats.total} hint="All your shipments" />
        <KpiCard label="In Transit" value={stats.inTransit} hint="Currently moving" />
        <KpiCard label="Delivered" value={stats.delivered} hint="Completed deliveries" />
        <KpiCard label="Pending" value={stats.pending} hint="Waiting to start" />
        <KpiCard label="Delayed" value={stats.delayed} hint="Need attention" />
      </div>

      {/* Recent Shipments */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-6 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Shipments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Latest shipments and status updates.
            </p>
          </div>

          <button
            type="button"
            className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            onClick={() => navigate("/my-shipments")}
          >
            View All
          </button>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
              <tr>
                <th className="px-6 py-4">Shipment</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">ETA</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {!loadingShipments && myShipments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-slate-500 dark:text-slate-300">
                    No shipments yet.
                  </td>
                </tr>
              ) : (
                myShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {s.shipmentNo || s.id}
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Requests (last 3) */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Requests
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            Your latest shipment requests (orders).
          </p>
        </div>

        {loadingRequests && (
          <div className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
            Loading requests...
          </div>
        )}

        {requestsError && (
          <div className="px-6 py-4 text-sm text-red-700 dark:text-red-200">
            {requestsError}
          </div>
        )}

        {!loadingRequests && !requestsError && (
          <div className="overflow-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-4">Request</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-slate-500 dark:text-slate-300">
                      No requests yet. Click “Request Shipment” to create one.
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {r.requestNo}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {r.origin} → {r.destination}
                      </td>
                      <td className="px-6 py-4">
                        <RequestStatusPill status={r.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {fmtDate(r.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Instant Quote Modal */}
      <InstantQuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
};

export default UserDashboard;