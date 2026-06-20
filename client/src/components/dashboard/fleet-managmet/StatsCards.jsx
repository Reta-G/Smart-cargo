import React from "react";
import { Truck, CheckCircle, Wrench, Users, Plus } from "lucide-react";
import { VEHICLE_STATUS } from "../../../utils/vehicleStatus.js";

const StatsCards = ({
  total = 0,
  available = 0,
  maintenance = 0,
  drivers = 0,
  vehicles = [],
}) => {
  const useVehicles = Array.isArray(vehicles) && vehicles.length > 0;

  const totalCount = useVehicles ? vehicles.length : total;

  const availableCount = useVehicles
    ? vehicles.filter((v) => v.status === VEHICLE_STATUS.AVAILABLE).length
    : available;

  const maintenanceCount = useVehicles
    ? vehicles.filter((v) => v.status === VEHICLE_STATUS.MAINTENANCE).length
    : maintenance;

  const driversCount = useVehicles
    ? new Set(
        vehicles
          .filter((v) => v.driver && v.driver !== "Unassigned")
          .map((v) => v.driver)
      ).size
    : drivers;

  const safeTotal = totalCount || 1;
  const availPct = Math.round((availableCount / safeTotal) * 100);
  const driversPct = Math.round((driversCount / safeTotal) * 100);

  const cardBase =
    "bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Vehicles */}
      <div className={`${cardBase} border-l-4 border-blue-200 dark:border-blue-500`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
              <Truck size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-300">
                Total Vehicles
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {totalCount}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="rounded-md bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/30"
            title="Add vehicle"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-slate-700">
            <div className="h-full bg-blue-500" style={{ width: `100%` }} />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-400">
            All registered fleet vehicles
          </div>
        </div>
      </div>

      {/* Available Vehicles */}
      <div className={`${cardBase} border-l-4 border-emerald-200 dark:border-emerald-500`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-300">
                Available
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {availableCount}
              </div>
            </div>
          </div>
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            {availPct}%
          </div>
        </div>

        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-emerald-100 dark:bg-slate-700">
            <div className="h-full bg-emerald-500" style={{ width: `${availPct}%` }} />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-400">
            Ready for dispatch
          </div>
        </div>
      </div>

      {/* Maintenance */}
      <div className={`${cardBase} border-l-4 border-amber-200 dark:border-amber-500`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
              <Wrench size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-300">
                In Maintenance
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {maintenanceCount}
              </div>
            </div>
          </div>
          <div className="text-xs font-medium text-amber-700 dark:text-amber-300">
            {maintenanceCount > 0
              ? `${Math.round((maintenanceCount / safeTotal) * 100)}%`
              : "0%"}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-amber-50 p-2 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            Repair Active
          </div>
          <div className="rounded-md bg-amber-50 p-2 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            Awaiting Info
          </div>
        </div>
      </div>

      {/* Active Drivers */}
      <div className={`${cardBase} border-l-4 border-indigo-200 dark:border-indigo-500`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
              <Users size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-300">
                Active Drivers
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                {driversCount}
              </div>
            </div>
          </div>
          <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            {driversPct}%
          </div>
        </div>

        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-indigo-100 dark:bg-slate-700">
            <div className="h-full bg-indigo-600" style={{ width: `${driversPct}%` }} />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-400">
            Drivers currently on shift
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;