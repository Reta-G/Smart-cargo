import React from "react";
import { Clock, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { SHIPMENT_STATUS, STATUS_LABELS_EN } from "../../../utils/shipmentStatus.js";

const icons = {
  [SHIPMENT_STATUS.PENDING]: Clock,
  [SHIPMENT_STATUS.IN_TRANSIT]: Truck,
  [SHIPMENT_STATUS.DELIVERED]: CheckCircle,
  [SHIPMENT_STATUS.DELAYED]: AlertCircle,
};

export const StatCard = ({
  label = "Status",
  value = "0",
  type = SHIPMENT_STATUS.PENDING, // ✅ now expects status code (or "TOTAL")
  color = "#6366f1",
  shipments = [],
}) => {
  const Icon = icons[type] || Truck;

  const total = Array.isArray(shipments) ? shipments.length : 0;

  let numericValue = 0;
  if (Array.isArray(shipments) && shipments.length > 0) {
    if (type === "TOTAL") {
      numericValue = total;
    } else {
      numericValue = shipments.filter((s) => s.status === type).length;
    }
  } else {
    numericValue = parseFloat(String(value).replace(/,/g, "")) || 0;
  }

  const safeTotal = total || Math.max(numericValue, 1);
  const percentage = Math.round((numericValue / safeTotal) * 100);

  const subtitle =
    type === "TOTAL" ? "Total" : (STATUS_LABELS_EN[type] || label);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800"
      style={{ borderLeft: `4px solid ${color}33` }}
    >
      <div
        className="absolute -right-6 -top-6 h-32 w-32 rounded-full opacity-[0.08] transition-transform duration-500 group-hover:scale-125"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 mb-6 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
            {label}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">
            {numericValue.toLocaleString()}
          </h3>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-300">
            {subtitle}
          </p>
        </div>

        <div
          className="rounded-xl p-3 shadow-md transition-transform duration-300 group-hover:rotate-6"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative z-10">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-400 dark:text-slate-300">
            Activity
          </span>
          <span className="font-bold" style={{ color }}>
            {percentage}%
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full border border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-700">
          <div
            className="relative h-full overflow-hidden rounded-full transition-all duration-1000 ease-out"
            style={{
              backgroundColor: color,
              width: `${percentage}%`,
              boxShadow: `0 6px 18px ${color}22`,
            }}
          >
            <div className="absolute inset-0 h-full w-full bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
};