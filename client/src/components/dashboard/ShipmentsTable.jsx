import React, { useMemo } from "react";
import {
  STATUS_LABELS_AM,
  STATUS_STYLES,
  isNewShipment,
  formatShortDate,
} from "../../utils/shipmentStatus.js";

const ShipmentsTable = ({ shipments = [], onViewAll }) => {
  // dashboard should show only recent few
  const rows = useMemo(() => shipments.slice(0, 6), [shipments]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          የቅርብ ጊዜ ጭነቶች
        </h3>

        <button
          type="button"
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ሁሉንም ይመልከቱ
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 dark:border-slate-700 dark:text-slate-300">
              <th className="py-3">የጭነት መለያ</th>
              <th>ደንበኛ</th>
              <th>መንገድ</th>
              <th>ሁኔታ</th>
              <th>ቀን</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-gray-500 dark:text-slate-300">
                  No shipments yet.
                </td>
              </tr>
            ) : (
              rows.map((s) => {
                // Expect backend status codes like IN_TRANSIT/DELIVERED/PENDING/DELAYED
                const label = STATUS_LABELS_AM[s.status] || s.status || "—";
                const pill =
                  STATUS_STYLES[s.status] ||
                  "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200";

                return (
                  <tr
                    key={s.id}
                    className="border-b transition hover:bg-gray-50 last:border-none dark:border-slate-700 dark:hover:bg-slate-700/40"
                  >
                    <td className="py-3 font-medium text-gray-800 dark:text-white">
                      <div className="flex items-center gap-2">
                        {s.id}
                        {isNewShipment(s.createdAt) && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="text-gray-700 dark:text-slate-200">
                      {s.client}
                    </td>

                    <td className="text-gray-600 dark:text-slate-300">
                      {s.origin} → {s.destination}
                    </td>

                    <td>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${pill}`}>
                        {label}
                      </span>
                    </td>

                    <td className="text-gray-500 dark:text-slate-400">
                      {formatShortDate(s.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentsTable;