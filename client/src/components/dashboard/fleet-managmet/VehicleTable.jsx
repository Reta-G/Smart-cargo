import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Wrench,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import {
  VEHICLE_STATUS,
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_BADGE_CLASSES,
} from "../../../utils/vehicleStatus.js";

const PAGE_SIZE = 5;

const VehicleTable = ({
  onMaintenanceClick = () => {},
  onCreateVehicle = async () => {},
  vehicles = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    id: "",
    type: "Box Truck",
    driver: "Unassigned",
  });

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: "id", order: "asc" });
  const [page, setPage] = useState(1);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, order: prev.order === "asc" ? "desc" : "asc" };
      }
      return { key, order: "asc" };
    });
  };

  const filteredAndSortedVehicles = useMemo(() => {
    const list = vehicles || [];

    let result = list.filter((vehicle) => {
      const s = searchTerm.trim().toLowerCase();

      const statusLabel = (
        VEHICLE_STATUS_LABELS[vehicle.status] ||
        vehicle.status ||
        ""
      )
        .toString()
        .toLowerCase();

      const matchesSearch =
        (vehicle.id || "").toLowerCase().includes(s) ||
        (vehicle.type || "").toLowerCase().includes(s) ||
        statusLabel.includes(s) ||
        (vehicle.driver || "").toLowerCase().includes(s);

      const matchesStatus =
        statusFilter === "ALL" || vehicle.status === statusFilter;

      const matchesType = typeFilter === "All" || vehicle.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        const va = (a[sortConfig.key] || "").toString();
        const vb = (b[sortConfig.key] || "").toString();
        if (va < vb) return sortConfig.order === "asc" ? -1 : 1;
        if (va > vb) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [vehicles, searchTerm, statusFilter, typeFilter, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedVehicles.length / PAGE_SIZE)
  );

  const paged = filteredAndSortedVehicles.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const SortIcon = ({ column }) => {
    if (sortConfig?.key !== column) {
      return (
        <ChevronDown className="h-4 w-4 text-slate-300 dark:text-slate-500" />
      );
    }
    return sortConfig.order === "asc" ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setCreateError("");

    const id = (newVehicle.id || "").trim();
    if (!id) return;

    const vehicle = {
      id,
      type: newVehicle.type,
      driver: newVehicle.driver || "Unassigned",
      status: VEHICLE_STATUS.AVAILABLE, // ✅ backend-friendly code
      lastSeen: "Just now",
    };

    setCreating(true);
    try {
      // ✅ Professional: UI calls callback, parent decides state/API.
      await onCreateVehicle(vehicle);

      setIsAddModalOpen(false);
      setNewVehicle({ id: "", type: "Box Truck", driver: "Unassigned" });
    } catch (err) {
      setCreateError(err?.message || "Failed to create vehicle");
    } finally {
      setCreating(false);
    }
  };

  const types = [
    "All",
    ...Array.from(new Set((vehicles || []).map((v) => v.type))),
  ];

  const statuses = [
    { value: "ALL", label: "All" },
    {
      value: VEHICLE_STATUS.AVAILABLE,
      label: VEHICLE_STATUS_LABELS.AVAILABLE,
    },
    {
      value: VEHICLE_STATUS.IN_TRANSIT,
      label: VEHICLE_STATUS_LABELS.IN_TRANSIT,
    },
    {
      value: VEHICLE_STATUS.MAINTENANCE,
      label: VEHICLE_STATUS_LABELS.MAINTENANCE,
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Fleet Vehicles
        </h3>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              className="w-64 rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Search ID, type, driver..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="hidden items-center space-x-2 sm:flex">
            <select
              className="rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setCreateError("");
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Vehicle
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-700/50 dark:text-slate-300">
            <tr>
              <th
                className="cursor-pointer px-4 py-3"
                onClick={() => handleSort("id")}
              >
                Vehicle ID <SortIcon column="id" />
              </th>
              <th
                className="cursor-pointer px-4 py-3"
                onClick={() => handleSort("type")}
              >
                Type <SortIcon column="type" />
              </th>
              <th
                className="cursor-pointer px-4 py-3"
                onClick={() => handleSort("status")}
              >
                Status <SortIcon column="status" />
              </th>
              <th
                className="cursor-pointer px-4 py-3"
                onClick={() => handleSort("driver")}
              >
                Driver <SortIcon column="driver" />
              </th>
              <th className="px-4 py-3">Last Seen</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm text-slate-600 dark:text-slate-200">
            {paged.map((vehicle) => {
              const badgeClass =
                VEHICLE_STATUS_BADGE_CLASSES[vehicle.status] ||
                "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

              const statusLabel =
                VEHICLE_STATUS_LABELS[vehicle.status] ||
                vehicle.status ||
                "—";

              return (
                <tr
                  key={vehicle.id}
                  className="border-b hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/30 last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium">{vehicle.id}</td>
                  <td className="px-4 py-3">{vehicle.type}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded border px-2 py-1 text-xs font-medium ${badgeClass}`}
                    >
                      {statusLabel}
                    </span>
                  </td>

                  <td className="px-4 py-3">{vehicle.driver}</td>
                  <td className="px-4 py-3 text-sm text-slate-400 dark:text-slate-400">
                    {vehicle.lastSeen}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="Maintenance"
                        onClick={() => onMaintenanceClick(vehicle.id)}
                        className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <Wrench className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                      </button>

                      {/* backend-ready stubs (we wire later) */}
                      <button
                        title="Assign"
                        className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <UserPlus className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      </button>

                      <button
                        title="Unassign"
                        className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <UserMinus className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </button>

                      <button
                        title="More"
                        className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        <MoreHorizontal className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 p-3 dark:border-slate-700">
        <div className="text-sm text-slate-500 dark:text-slate-300">
          Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(page * PAGE_SIZE, filteredAndSortedVehicles.length)} of{" "}
          {filteredAndSortedVehicles.length} vehicles
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border p-2 disabled:opacity-40 dark:border-slate-600 dark:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-md ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border p-2 disabled:opacity-40 dark:border-slate-600 dark:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Add Vehicle
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                disabled={creating}
              >
                <X className="h-4 w-4 dark:text-white" />
              </button>
            </div>

            {createError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
                {createError}
              </div>
            )}

            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">
                  Vehicle ID
                </label>
                <input
                  required
                  value={newVehicle.id}
                  onChange={(e) =>
                    setNewVehicle((s) => ({ ...s, id: e.target.value }))
                  }
                  className="mt-1 w-full rounded border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  disabled={creating}
                />
              </div>

              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">
                  Type
                </label>
                <select
                  value={newVehicle.type}
                  onChange={(e) =>
                    setNewVehicle((s) => ({ ...s, type: e.target.value }))
                  }
                  className="mt-1 w-full rounded border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  disabled={creating}
                >
                  <option>Box Truck</option>
                  <option>Semi-Trailer</option>
                  <option>Reefer Truck</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">
                  Driver
                </label>
                <input
                  value={newVehicle.driver}
                  onChange={(e) =>
                    setNewVehicle((s) => ({ ...s, driver: e.target.value }))
                  }
                  className="mt-1 w-full rounded border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  disabled={creating}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded border px-4 py-2 dark:border-slate-600 dark:text-white"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
                  disabled={creating}
                >
                  {creating ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTable;