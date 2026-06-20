import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QuickAnalyticsContainer from "../../components/dashboard/QuickAnalyticsContainer";
import LiveMap from "../../components/dashboard/LiveMap";
import ShipmentsTable from "../../components/dashboard/ShipmentsTable";
import MessagesCards from "../../components/dashboard/MessagesCards";
import { shipmentsApi } from "../../api/shipmentsApi.js";
import { analyticsApi } from "../../api/analyticsApi.js";
import { Package, Truck, Clock, CheckCircle } from "lucide-react";

const KpiCard = ({ label, value, icon: Icon, color }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">{label}</p>
        <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{value ?? "—"}</p>
      </div>
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [recentShipments, setRecentShipments] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  useEffect(() => {
    // Load recent shipments for the table
    shipmentsApi.listRecent()
      .then((res) => {
        const rows = (res.data || []).map((s) => ({
          id: s.shipmentNo || s.id,
          client: s.client,
          origin: s.origin,
          destination: s.destination,
          status: s.status,
          createdAt: s.createdAt,
        }));
        setRecentShipments(rows);
      })
      .catch(() => setRecentShipments([]));

    // Load overview KPIs
    analyticsApi.overview()
      .then((res) => setOverview(res.data))
      .catch(() => setOverview(null))
      .finally(() => setLoadingOverview(false));
  }, []);

  const handleExport = () => {
    // Build CSV from recent shipments
    const headers = ["Shipment No", "Client", "Origin", "Destination", "Status", "Created"];
    const rows = recentShipments.map((s) => [
      s.id, s.client, s.origin, s.destination, s.status,
      s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shipments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-300 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {t("dashboard.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            {t("dashboard.export")}
          </button>
          <button
            onClick={() => navigate("/dashboard/shipments-orders")}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white shadow hover:shadow-lg hover:bg-blue-700"
          >
            {t("dashboard.newShipment")}
          </button>
        </div>
      </div>

      {/* Real KPI Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Shipments"   value={loadingOverview ? "…" : overview?.total}           icon={Package}     color="bg-blue-500" />
        <KpiCard label="In Transit"        value={loadingOverview ? "…" : overview?.inTransit}        icon={Truck}       color="bg-indigo-500" />
        <KpiCard label="Pending Requests"  value={loadingOverview ? "…" : overview?.pendingRequests}  icon={Clock}       color="bg-amber-500" />
        <KpiCard label="Delivered Today"   value={loadingOverview ? "…" : overview?.todayDeliveries}  icon={CheckCircle} color="bg-emerald-500" />
      </div>

      {/* Messages summary */}
      <div className="mt-6">
        <MessagesCards />
      </div>

      {/* Live Map */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-50 to-white p-4 shadow-xl dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {t("dashboard.liveMap")}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {t("dashboard.liveMapDesc")}
          </p>
        </div>
        <div className="h-[420px] w-full overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700">
          <LiveMap />
        </div>
      </div>

      {/* Quick Analytics */}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick Analytics</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">Key metrics at a glance</p>
        </div>
        <QuickAnalyticsContainer />
      </div>

      {/* Recent Shipments — real data */}
      <div className="mt-6">
        <ShipmentsTable
          shipments={recentShipments}
          onViewAll={() => navigate("/dashboard/shipments-orders")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
