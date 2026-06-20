import React from "react";
import { X, Wrench, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const MaintenanceModal = ({
  vehicleId,
  onClose = () => {},
  inline = false,

  // ✅ NEW: backend-ready props
  logs = [],
  activities = [],
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "Awaiting Parts":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";
    }
  };

  const safeLogs = Array.isArray(logs) ? logs : [];
  const safeActivities = Array.isArray(activities) ? activities : [];

  if (inline) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700 md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
              <Wrench className="h-5 w-5 text-slate-600 dark:text-slate-200" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                Maintenance
              </h3>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-300">
                {vehicleId || "Select a vehicle"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4 dark:text-slate-200 md:p-6">
          {vehicleId ? (
            <>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Showing maintenance log for{" "}
                <span className="font-medium text-slate-800 dark:text-white">
                  {vehicleId}
                </span>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-3 py-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                        Date
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                        Description
                      </th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {safeLogs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 py-6 text-sm text-slate-500 dark:text-slate-300"
                        >
                          No maintenance logs yet.
                        </td>
                      </tr>
                    ) : (
                      safeLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/40"
                        >
                          <td className="px-3 py-2 text-sm text-slate-500 dark:text-slate-300">
                            {log.date}
                          </td>
                          <td className="px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
                            {log.description}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`rounded-md border px-2 py-1 text-[10px] font-bold ${getStatusBadge(
                                log.status
                              )}`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                Next service in 1,200 miles
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-md border px-3 py-2 dark:border-slate-600 dark:text-white"
                >
                  Close
                </button>
                <button className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
                  Complete Log
                </button>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-300">
              Select a vehicle from the table to view maintenance details here.
            </div>
          )}
        </div>
      </div>
    );
  }

  // non-inline modal version (kept, but also uses props)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div className="relative flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <header className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700 md:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
              <Wrench className="h-5 w-5 text-slate-600 dark:text-slate-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Maintenance Log
              </h2>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-300">
                {vehicleId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                    Description
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-slate-500 dark:text-slate-300">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {safeLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-sm text-slate-500 dark:text-slate-300">
                      No maintenance logs yet.
                    </td>
                  </tr>
                ) : (
                  safeLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-300">
                        {log.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                        {log.description}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md border px-2 py-1 text-[10px] font-bold ${getStatusBadge(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white">
              <Clock className="h-4 w-4" /> Recent Activities
            </h3>

            {safeActivities.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                No activities yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {safeActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex justify-between text-sm text-slate-600 dark:text-slate-300"
                  >
                    <span>{activity.description}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-400">
                      {activity.date}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-200">
                Upcoming Service
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Next scheduled maintenance is in 1,200 miles or on June 15, 2024.
              </p>
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700/40">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-md border px-4 py-2 dark:border-slate-600 dark:text-white"
            >
              Close
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">
              <CheckCircle2 className="h-4 w-4" /> Complete Log
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MaintenanceModal;