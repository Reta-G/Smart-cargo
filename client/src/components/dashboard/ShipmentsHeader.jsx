import React, { useState } from "react";
import {
  Upload,
  Plus,
  Truck,
  PackageCheck,
  Clock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import KPICard from "./KpiCard";

const ShipmentsHeader = ({
  onCreate = () => {},
  onBulkUpload = () => {},
  onRangeChange = () => {},
}) => {
  const [range, setRange] = useState("7d");

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-slate-50 to-white p-2 shadow-sm dark:from-slate-700 dark:to-slate-800">
            <PackageCheck className="h-6 w-6 text-slate-700 dark:text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Shipments & Orders
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Monitor shipments, track issues and manage orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <select
              value={range}
              onChange={(e) => {
                setRange(e.target.value);
                onRangeChange(e.target.value);
              }}
              className="appearance-none bg-transparent pr-6 outline-none"
            >
              <option value="24h">24h</option>
              <option value="7d">7d</option>
              <option value="30d">30d</option>
              <option value="90d">90d</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>

          <button
            onClick={onBulkUpload}
            className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </button>

          <button
            onClick={onCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Shipment
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          title="Pending Shipments"
          value="8"
          icon={Clock}
          iconColor="bg-amber-500"
          type="progress"
          progress={40}
          badgeLabel="+5%"
        />

        <KPICard
          title="In Transit"
          value="16"
          icon={Truck}
          iconColor="bg-blue-500"
          type="progress"
          progress={65}
          badgeLabel="+12%"
        />

        <KPICard
          title="Delivered"
          value="42"
          icon={PackageCheck}
          iconColor="bg-green-500"
          type="progress"
          progress={90}
          badgeLabel="+4%"
        />

        <KPICard
          title="Delayed"
          value="3"
          icon={AlertTriangle}
          iconColor="bg-red-500"
          type="progress"
          progress={20}
          badgeLabel="-2%"
        />
      </div>
    </div>
  );
};

export default ShipmentsHeader;