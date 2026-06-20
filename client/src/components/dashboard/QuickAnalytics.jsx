import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Package, Clock, Fuel, TrendingUp, TrendingDown } from "lucide-react";

const useIsDark = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

const AnalyticsCard = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </h4>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
            {subtitle}
          </p>
        )}
      </div>
      <div className="h-72 w-full flex-1">{children}</div>
    </div>
  );
};

const StatMini = ({ label, value, delta, icon: Icon, trend }) => {
  const trendUp = trend === "up";
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-start justify-between">
        <div
          className={`rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 ${
            trendUp
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
              : "bg-slate-50 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          }`}
        >
          <Icon size={22} strokeWidth={2} />
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            trendUp
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
              : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
          }`}
        >
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {delta}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-300">
          {label}
        </p>
      </div>
    </div>
  );
};

const QuickAnalytics = ({ data }) => {
  const isDark = useIsDark();

  const gridStroke = isDark ? "#334155" : "#e2e8f0";
  const tickFill = isDark ? "#cbd5e1" : "#94a3b8";
  const cursorFill = isDark ? "#0f172a" : "#f8fafc";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-white shadow-xl">
          <p className="mb-2 font-bold opacity-70">{label || "Data Point"}</p>
          {payload.map((entry, index) => (
            <div key={index} className="mb-1 flex items-center gap-2 last:mb-0">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-medium">{entry.name}:</span>
              <span className="font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const kpis = data?.kpis;
  const daily = data?.dailyDeliveries || [];
  const revenueCost = data?.revenueVsCost || [];
  const fuel = data?.fuelConsumption || [];

  return (
    <div className="space-y-6">
      {/* KPI minis */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatMini
          label="Today Deliveries"
          value={kpis?.todayDeliveries?.value ?? "—"}
          delta={kpis?.todayDeliveries?.delta ?? "—"}
          icon={Package}
          trend={kpis?.todayDeliveries?.trend ?? "up"}
        />
        <StatMini
          label="Avg. ETA"
          value={kpis?.avgEta?.value ?? "—"}
          delta={kpis?.avgEta?.delta ?? "—"}
          icon={Clock}
          trend={kpis?.avgEta?.trend ?? "up"}
        />
        <StatMini
          label="Fuel Avg (L)"
          value={kpis?.fuelAvg?.value ?? "—"}
          delta={kpis?.fuelAvg?.delta ?? "—"}
          icon={Fuel}
          trend={kpis?.fuelAvg?.trend ?? "down"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AnalyticsCard title="Daily Deliveries" subtitle="Deliveries per day">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickFill }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickFill }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill }} />
              <Bar dataKey="value" name="Deliveries" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Revenue vs Cost" subtitle="Compare daily revenue and cost">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueCost} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickFill }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickFill }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="cost" name="Cost" stroke="#f97316" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Fuel Consumption (L)" subtitle="Daily fuel usage">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fuel} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickFill }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: tickFill }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill }} />
              <Bar dataKey="value" name="Fuel" fill="#60a5fa" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>
    </div>
  );
};

export default QuickAnalytics;