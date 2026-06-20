import React from "react";
import { Plus } from "lucide-react";
import { ROLE_CONFIG, USER_ROLES, USER_ROLE_LABELS } from "./constants";

const ROLE_COLOR = {
  ADMIN: "#ef4444",
  DRIVER: "#10b981",
  CUSTOMER: "#6366f1",
};

export const KPICards = ({ users = [], onAddUser }) => {
  const counts = (role) => {
    if (!Array.isArray(users) || users.length === 0) return 0;
    return users.filter((u) => u.role === role).length;
  };

  const roleCodes = USER_ROLES.filter((r) => r !== "All");

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {roleCodes.map((role) => {
        const config = ROLE_CONFIG[role];
        const count = counts(role);
        const color = ROLE_COLOR[role] || "#94a3b8";
        const label = USER_ROLE_LABELS[role] || role;

        return (
          <div
            key={role}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-800"
            style={{ borderLeft: `4px solid ${color}33` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-white">
                  {count}
                </span>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-300">
                  {label}s
                </span>
              </div>

              <div className={`rounded-lg p-2 ${config?.iconBg || ""}`}>
                {config?.icon}
              </div>
            </div>

            <div className="mt-4 flex flex-col">
              <span className="text-3xl font-extrabold leading-none text-slate-900 dark:text-white">
                {count}
              </span>

              <div className="mt-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${config?.badgeColor || ""}`}>
                  {label}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add User Card */}
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <button
          onClick={onAddUser}
          className="flex min-h-[140px] w-full flex-col items-center justify-center space-y-2 rounded-xl bg-blue-600 font-semibold text-white transition-all active:scale-95 hover:bg-blue-700"
        >
          <div className="rounded-full bg-white/20 p-2">
            <Plus className="h-6 w-6" />
          </div>
          <span>Add User</span>
        </button>
      </div>
    </div>
  );
};

export default KPICards;