import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ?? "http://localhost:5000";

const STATUS = {
  NEW: "NEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

const pillStyles = {
  NEW: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  APPROVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
};

const StatusPill = ({ status }) => {
  const cls =
    pillStyles[status] ||
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

const Requests = () => {
  const [status, setStatus] = useState("NEW");
  const [q, setQ] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const token = () => localStorage.getItem("auth_token");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const t = token();
      if (!t) {
        setData([]);
        setError("Missing token. Please login again.");
        return;
      }

      const url = `${API_BASE}/api/admin/requests?limit=200&status=${encodeURIComponent(
        status
      )}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${t}` },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to load requests");

      setData(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setData([]);
      setError(e?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data;

    return data.filter((r) => {
      const text = [
        r.requestNo,
        r.origin,
        r.destination,
        r.cargoType,
        String(r.weightKg ?? ""),
        r.notes,
        r.status,
        r.customer?.name,
        r.customer?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(needle);
    });
  }, [data, q]);

  const setRequestStatus = async (id, newStatus) => {
    try {
      setBusyId(id);
      setError("");

      const t = token();
      if (!t) {
        setError("Missing token. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to update status");

      // update locally (no need to reload)
      setData((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: newStatus, updatedAt: new Date().toISOString() } : x))
      );
    } catch (e) {
      setError(e?.message || "Server error");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-300 dark:bg-slate-900">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Shipment Requests
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Review customer requests, approve or reject.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-3">
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
            <option value={STATUS.NEW}>NEW</option>
            <option value={STATUS.APPROVED}>APPROVED</option>
            <option value={STATUS.REJECTED}>REJECTED</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
            Search
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by request no, customer, route..."
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Requests ({filtered.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            These are customer orders waiting for admin action.
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-slate-600 dark:text-slate-300">
            Loading requests...
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-4">Request</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4">Weight</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-slate-500 dark:text-slate-300">
                      No requests found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        {r.requestNo}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {r.customer?.name || "—"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {r.customer?.email || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {r.origin} → {r.destination}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {r.cargoType || "—"}
                        {r.notes ? (
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {r.notes}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {r.weightKg ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={r.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {fmtDate(r.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busyId === r.id}
                            onClick={() => setRequestStatus(r.id, STATUS.APPROVED)}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={busyId === r.id}
                            onClick={() => setRequestStatus(r.id, STATUS.REJECTED)}
                            className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;