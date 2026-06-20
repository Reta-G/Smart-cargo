import React from "react";
import { Search, ChevronLeft, ChevronRight, Truck, MoreVertical, MapPin } from "lucide-react";
import { SHIPMENT_STATUS, STATUS_LABELS_EN, STATUS_STYLES } from "../../../utils/shipmentStatus.js";

const tabs = [
  { value: "ALL", label: "All" },
  { value: SHIPMENT_STATUS.PENDING, label: STATUS_LABELS_EN.PENDING },
  { value: SHIPMENT_STATUS.IN_TRANSIT, label: STATUS_LABELS_EN.IN_TRANSIT },
  { value: SHIPMENT_STATUS.DELIVERED, label: STATUS_LABELS_EN.DELIVERED },
  { value: SHIPMENT_STATUS.DELAYED, label: STATUS_LABELS_EN.DELAYED },
];

export const ShipmentTable = ({
  data = [],
  totalItems = 0,
  itemsPerPage = 5,
  currentPage = 1,
  onPageChange = () => {},
  activeFilter = "ALL",
  onFilterChange = () => {},
  searchTerm = "",
  onSearchChange = () => {},
  onUpdateStatus = () => {},
  onAssignDriver = () => {},
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startResult = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endResult = Math.min(currentPage * itemsPerPage, totalItems);

  const getStatusStyles = (statusCode) => {
    return (
      STATUS_STYLES[statusCode] ||
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
    );
  };

  const getStatusLabel = (statusCode) => STATUS_LABELS_EN[statusCode] || statusCode || "—";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/30 px-4 py-3 dark:border-slate-700 dark:bg-slate-700/20 md:flex-row md:items-center lg:px-6 lg:py-4">
        <div className="no-scrollbar flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onFilterChange(tab.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                activeFilter === tab.value
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search table..."
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-4 text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-700/40 dark:text-slate-300">
              <th className="w-32 px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status & Driver</th>
              <th className="px-6 py-4">ETA</th>
              <th className="px-6 py-4 text-right">Operations</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-700 dark:bg-slate-800">
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-blue-50/30 dark:hover:bg-slate-700/30"
                >
                  <td className="px-6 py-5 font-bold text-slate-800 dark:text-white">
                    {row.id}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                        <MapPin size={16} className="dark:text-slate-200" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                        {row.client}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-bold ${getStatusStyles(
                          row.status
                        )}`}
                      >
                        {getStatusLabel(row.status)}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-300">
                        — {row.driver}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5 italic text-slate-500 dark:text-slate-300">
                    {row.eta}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onAssignDriver(row.id)}
                        className="rounded bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                      >
                        Assign
                      </button>

                      <button
                        onClick={() => onUpdateStatus(row.id)}
                        className="rounded border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                      >
                        Status
                      </button>

                      <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center text-slate-400 dark:text-slate-300">
                    <Truck size={40} className="mb-4 opacity-20" />
                    <p>No shipments found</p>
                    <button
                      onClick={() => {
                        onFilterChange("ALL");
                        onSearchChange("");
                      }}
                      className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between border-t border-slate-100 bg-white p-4 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <span>
          Showing {startResult} to {endResult} of {totalItems}
        </span>

        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded border p-1.5 disabled:opacity-30 dark:border-slate-600"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-7 w-7 rounded text-[11px] font-bold ${
                p === currentPage ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="rounded border p-1.5 disabled:opacity-30 dark:border-slate-600"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};