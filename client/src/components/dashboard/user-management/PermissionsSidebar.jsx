import React from "react";
import { Shield, ChevronRight, Check } from "lucide-react";
import { ROLE_CONFIG, USER_ROLE_LABELS } from "./constants";

export const PermissionsSidebar = ({
  permissions = [],
  onPermissionChange = () => {},
  logs = [],
  onViewAllLogs = () => {},
}) => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Role & Permissions */}
      <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center font-bold text-slate-800 dark:text-white">
            <Shield className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
            Role & Permissions
          </h3>
        </div>

        <div className="space-y-4">
          {permissions.map((p) => {
            const config = ROLE_CONFIG[p.role] || {};
            const label = USER_ROLE_LABELS[p.role] || p.role;

            return (
              <div key={p.role} className="flex items-center justify-between">
                <button
                  type="button"
                  className={`flex flex-1 items-center space-x-2 rounded-lg border border-transparent px-3 py-2 text-sm font-semibold transition-all ${config.badgeColor || ""}`}
                >
                  {config.icon}
                  <span>{label}</span>
                </button>

                <div className="ml-4 flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <label className="mb-1 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-300">
                      Shipments
                    </label>
                    <button
                      type="button"
                      onClick={() => onPermissionChange(p.role, "manageShipments")}
                      className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                        p.permissions.manageShipments
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {p.permissions.manageShipments && <Check className="h-3 w-3" />}
                    </button>
                  </div>

                  <div className="flex flex-col items-center">
                    <label className="mb-1 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-300">
                      Vehicles
                    </label>
                    <button
                      type="button"
                      onClick={() => onPermissionChange(p.role, "trackVehicles")}
                      className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                        p.permissions.trackVehicles
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {p.permissions.trackVehicles && <Check className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="w-full rounded-lg bg-blue-700 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all active:scale-95 hover:bg-blue-800 dark:shadow-black/20"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Activity */}
      <div className="flex-1 rounded-xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white">Recent Activity</h3>
        </div>

        <div className="space-y-6">
          {logs.slice(0, 3).map((log) => (
            <div key={log.id} className="flex space-x-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                  <span className="cursor-pointer font-bold text-blue-600 hover:underline dark:text-blue-400">
                    {log.userName}
                  </span>{" "}
                  {log.action}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-400">
                  {log.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right">
          <button
            type="button"
            onClick={onViewAllLogs}
            className="ml-auto flex items-center text-sm font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsSidebar;