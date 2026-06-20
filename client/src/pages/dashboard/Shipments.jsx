import React, { useEffect, useMemo, useState } from "react";
import { StatCard } from "../../components/dashboard/Shipments/StatCard";
import { Modal } from "../../components/dashboard/Shipments/Modal";
import { ShipmentTable } from "../../components/dashboard/Shipments/ShipmentTable";
import { SHIPMENT_STATUS, STATUS_LABELS_EN } from "../../utils/shipmentStatus.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ?? "http://localhost:5000";

const REQ_STATUS = {
  NEW: "NEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

const reqPillStyles = {
  NEW: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  APPROVED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200",
};

const RequestStatusPill = ({ status }) => {
  const cls =
    reqPillStyles[status] ||
    "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${cls}`}>
      {status || "—"}
    </span>
  );
};

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

// Convert DB Shipment -> UI format expected by your ShipmentTable
const normalizeShipment = (s) => ({
  // show shipmentNo in UI
  id: s.shipmentNo || s.id,

  // keep DB id for PATCH
  _dbId: s.id,

  client: s.client,
  origin: s.origin,
  destination: s.destination,

  status: s.status,
  eta: s.eta,

  // for display (ShipmentTable uses `driver`)
  driver: s.driverName || "Unassigned",

  // ✅ keep driverId for pre-select in dropdown
  driverId: s.driverId || null,

  // ✅ keep vehicleId for pre-select in vehicle dropdown
  vehicleId: s.vehicleId || null,

  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

const Shipments = () => {
  // -----------------------
  // Tabs
  // -----------------------
  const [tab, setTab] = useState("SHIPMENTS"); // "SHIPMENTS" | "ORDERS"

  const authToken = () => localStorage.getItem("auth_token");

  // -----------------------
  // Drivers (REAL)
  // -----------------------
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driversError, setDriversError] = useState("");

  const loadDrivers = async () => {
    try {
      setDriversLoading(true);
      setDriversError("");

      const token = authToken();
      if (!token) {
        setDrivers([]);
        setDriversError("Missing token. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to load drivers");

      setDrivers(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setDrivers([]);
      setDriversError(e?.message || "Server error");
    } finally {
      setDriversLoading(false);
    }
  };

  // Load drivers when you open the Shipments tab (so dropdown is ready)
  useEffect(() => {
    if (tab !== "SHIPMENTS") return;
    loadDrivers();
    loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // -----------------------
  // Vehicles (REAL)
  // -----------------------
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState("");

  const loadVehicles = async () => {
    try {
      setVehiclesLoading(true);
      setVehiclesError("");

      const token = authToken();
      if (!token) {
        setVehicles([]);
        setVehiclesError("Missing token. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/vehicles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to load vehicles");

      setVehicles(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setVehicles([]);
      setVehiclesError(e?.message || "Server error");
    } finally {
      setVehiclesLoading(false);
    }
  };

  // -----------------------
  // Shipments (REAL DB)
  // -----------------------
  const [shipments, setShipments] = useState([]);
  const [shipLoading, setShipLoading] = useState(true);
  const [shipError, setShipError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "assign" | "status"
  const [selectedShipment, setSelectedShipment] = useState(null);

  // For assign: modalDriverId and modalVehicleId
  // For status: modalValue = status
  const [modalDriverId, setModalDriverId] = useState("");
  const [modalVehicleId, setModalVehicleId] = useState("");
  const [modalValue, setModalValue] = useState("");

  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadAdminShipments = async () => {
    try {
      setShipLoading(true);
      setShipError("");

      const token = authToken();
      if (!token) {
        setShipments([]);
        setShipError("Missing token. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/shipments?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to load shipments");

      setShipments((json.data || []).map(normalizeShipment));
    } catch (e) {
      setShipments([]);
      setShipError(e?.message || "Server error");
    } finally {
      setShipLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== "SHIPMENTS") return;
    loadAdminShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filteredData = shipments.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      String(item.id || "").toLowerCase().includes(q) ||
      String(item.client || "").toLowerCase().includes(q);

    const matchesFilter = activeFilter === "ALL" || item.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const openAssignDriver = async (id) => {
    const shipment = shipments.find((s) => s.id === id);
    if (!shipment) return;

    // Ensure drivers and vehicles are loaded (in case)
    if (drivers.length === 0 && !driversLoading) {
      await loadDrivers();
    }
    if (vehicles.length === 0 && !vehiclesLoading) {
      await loadVehicles();
    }

    setSelectedShipment(shipment);
    setModalType("assign");

    // preselect currently assigned driverId and vehicleId
    setModalDriverId(shipment.driverId || "Unassigned");
    setModalVehicleId(shipment.vehicleId || "Unassigned");

    setModalError("");
    setIsModalOpen(true);
  };

  const openUpdateStatus = (id) => {
    const shipment = shipments.find((s) => s.id === id);
    if (!shipment) return;
    setSelectedShipment(shipment);
    setModalType("status");
    setModalValue(shipment.status);
    setModalError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (modalSaving) return;
    setIsModalOpen(false);
    setSelectedShipment(null);
    setModalType(null);
    setModalDriverId("");
    setModalVehicleId("");
    setModalValue("");
    setModalError("");
    setModalSaving(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedShipment?._dbId) return;

    try {
      setModalSaving(true);
      setModalError("");

      const token = authToken();
      if (!token) {
        setModalError("Missing token. Please login again.");
        return;
      }

      const body = {};
      if (modalType === "assign") {
        body.driverId = modalDriverId; // ✅ driverId or "Unassigned"
        body.vehicleId = modalVehicleId; // ✅ vehicleId or "Unassigned"
      }
      if (modalType === "status") body.status = modalValue;

      const res = await fetch(`${API_BASE}/api/admin/shipments/${selectedShipment._dbId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to save changes");

      await loadAdminShipments();
      handleCloseModal();
    } catch (e) {
      setModalError(e?.message || "Server error");
    } finally {
      setModalSaving(false);
    }
  };

  // -----------------------
  // Orders / Requests (real backend)
  // -----------------------
  const [reqStatus, setReqStatus] = useState("NEW");
  const [reqSearch, setReqSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState("");
  const [reqBusyId, setReqBusyId] = useState("");
  const [reqMsg, setReqMsg] = useState("");

  const loadRequests = async () => {
    try {
      setReqLoading(true);
      setReqError("");
      setReqMsg("");

      const token = authToken();
      if (!token) {
        setRequests([]);
        setReqError("Missing token. Please login again.");
        return;
      }

      const url = `${API_BASE}/api/admin/requests?limit=200&status=${encodeURIComponent(
        reqStatus
      )}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to load requests");

      setRequests(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setRequests([]);
      setReqError(e?.message || "Server error");
    } finally {
      setReqLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== "ORDERS") return;
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, reqStatus]);

  const filteredRequests = useMemo(() => {
    const needle = reqSearch.trim().toLowerCase();
    if (!needle) return requests;

    return requests.filter((r) => {
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
  }, [requests, reqSearch]);

  const rejectRequest = async (id) => {
    try {
      setReqBusyId(id);
      setReqError("");
      setReqMsg("");

      const token = authToken();
      if (!token) {
        setReqError("Missing token. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/requests/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: REQ_STATUS.REJECTED }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to reject request");

      setRequests((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: REQ_STATUS.REJECTED } : x))
      );

      if (reqStatus !== "ALL" && reqStatus !== REQ_STATUS.REJECTED) {
        setRequests((prev) => prev.filter((x) => x.id !== id));
      }

      setReqMsg("Request rejected.");
    } catch (e) {
      setReqError(e?.message || "Server error");
    } finally {
      setReqBusyId("");
    }
  };

  const convertRequestToShipment = async (id) => {
    try {
      setReqBusyId(id);
      setReqError("");
      setReqMsg("");

      const token = authToken();
      if (!token) {
        setReqError("Missing token. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/requests/${id}/convert`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed to convert request");

      const shipmentNo = json?.data?.shipment?.shipmentNo;

      setRequests((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: REQ_STATUS.APPROVED } : x))
      );

      if (reqStatus !== "ALL" && reqStatus !== REQ_STATUS.APPROVED) {
        setRequests((prev) => prev.filter((x) => x.id !== id));
      }

      setReqMsg(`Converted to Shipment: ${shipmentNo || "created"}`);
      await loadAdminShipments();
    } catch (e) {
      setReqError(e?.message || "Server error");
    } finally {
      setReqBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Shipments & Orders
        </h1>

        {/* Tabs */}
        <div className="flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setTab("SHIPMENTS")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              tab === "SHIPMENTS"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Shipments
          </button>

          <button
            type="button"
            onClick={() => setTab("ORDERS")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              tab === "ORDERS"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Orders (Requests)
          </button>
        </div>
      </div>

      {/* TAB: SHIPMENTS */}
      {tab === "SHIPMENTS" && (
        <>
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 flex-1">
              <StatCard label="Total Shipments" type="TOTAL" color="#6366f1" shipments={shipments} />
              <StatCard label={STATUS_LABELS_EN.IN_TRANSIT} type={SHIPMENT_STATUS.IN_TRANSIT} color="#3b82f6" shipments={shipments} />
              <StatCard label={STATUS_LABELS_EN.DELIVERED} type={SHIPMENT_STATUS.DELIVERED} color="#10b981" shipments={shipments} />
              <StatCard label={STATUS_LABELS_EN.DELAYED} type={SHIPMENT_STATUS.DELAYED} color="#f43f5e" shipments={shipments} />
            </div>

            <button
              type="button"
              onClick={loadAdminShipments}
              className="ml-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Refresh
            </button>
          </div>

          {shipLoading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Loading shipments...
            </div>
          )}

          {shipError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
              {shipError}
            </div>
          )}

          {driversError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-200">
              Driver list warning: {driversError}
            </div>
          )}

          <div className="h-[600px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <ShipmentTable
              data={currentItems}
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              activeFilter={activeFilter}
              onFilterChange={(filter) => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              searchTerm={searchTerm}
              onSearchChange={(term) => {
                setSearchTerm(term);
                setCurrentPage(1);
              }}
              onUpdateStatus={openUpdateStatus}
              onAssignDriver={openAssignDriver}
            />
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={modalType === "assign" ? "Assign Driver & Vehicle" : "Update Status"}
          >
            <div className="p-6">
              {modalError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
                  {modalError}
                </div>
              )}

              <div className="mb-6">
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-300">
                  Shipment:{" "}
                  <span className="font-bold text-slate-800 dark:text-white">
                    {selectedShipment?.id}
                  </span>
                </p>

                {modalType === "assign" ? (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Select Driver
                    </label>

                    <select
                      value={modalDriverId}
                      onChange={(e) => setModalDriverId(e.target.value)}
                      disabled={driversLoading}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="Unassigned">Unassigned</option>
                      {drivers.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.email})
                        </option>
                      ))}
                    </select>

                    {driversLoading && (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                        Loading drivers...
                      </p>
                    )}

                    {!driversLoading && drivers.length === 0 && (
                      <p className="mt-2 text-xs text-amber-700 dark:text-amber-200">
                        No active drivers found. Create a DRIVER account first.
                      </p>
                    )}

                    <label className="mb-1 mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Select Vehicle (Optional)
                    </label>

                    <select
                      value={modalVehicleId}
                      onChange={(e) => setModalVehicleId(e.target.value)}
                      disabled={vehiclesLoading}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="Unassigned">Unassigned</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.vehicleNo || v.id} ({v.type})
                        </option>
                      ))}
                    </select>

                    {vehiclesLoading && (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                        Loading vehicles...
                      </p>
                    )}

                    {!vehiclesLoading && vehicles.length === 0 && (
                      <p className="mt-2 text-xs text-amber-700 dark:text-amber-200">
                        No vehicles found. Add vehicles in Fleet Management first.
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      New Status
                    </label>
                    <select
                      value={modalValue}
                      onChange={(e) => setModalValue(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    >
                      <option value={SHIPMENT_STATUS.PENDING}>{STATUS_LABELS_EN.PENDING}</option>
                      <option value={SHIPMENT_STATUS.IN_TRANSIT}>{STATUS_LABELS_EN.IN_TRANSIT}</option>
                      <option value={SHIPMENT_STATUS.DELIVERED}>{STATUS_LABELS_EN.DELIVERED}</option>
                      <option value={SHIPMENT_STATUS.DELAYED}>{STATUS_LABELS_EN.DELAYED}</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCloseModal}
                  disabled={modalSaving}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-60 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={modalSaving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                >
                  {modalSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">
                Assign driver & vehicle (optional) to shipment. Status updates save directly to DB.
              </p>
            </div>
          </Modal>
        </>
      )}

      {/* TAB: ORDERS */}
      {tab === "ORDERS" && (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Customer Orders (Requests)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Approve & Create converts request to a Shipment.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRequests}
              className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 px-6 py-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Status
              </label>
              <select
                value={reqStatus}
                onChange={(e) => setReqStatus(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="ALL">All</option>
                <option value="NEW">NEW</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                Search
              </label>
              <input
                value={reqSearch}
                onChange={(e) => setReqSearch(e.target.value)}
                placeholder="Search by request no, customer, route..."
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {reqMsg && (
            <div className="px-6 pb-3 text-sm text-emerald-700 dark:text-emerald-200">
              {reqMsg}
            </div>
          )}
          {reqError && (
            <div className="px-6 pb-3 text-sm text-red-700 dark:text-red-200">
              {reqError}
            </div>
          )}

          {reqLoading ? (
            <div className="px-6 py-6 text-sm text-slate-600 dark:text-slate-300">
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
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-slate-500 dark:text-slate-300">
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((r) => (
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
                          <RequestStatusPill status={r.status} />
                        </td>

                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {fmtDateTime(r.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={reqBusyId === r.id}
                              onClick={() => convertRequestToShipment(r.id)}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              Approve & Create
                            </button>
                            <button
                              type="button"
                              disabled={reqBusyId === r.id}
                              onClick={() => rejectRequest(r.id)}
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
      )}
    </div>
  );
};

export default Shipments;