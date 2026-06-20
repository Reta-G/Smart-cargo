import React from "react";
import { kpiMetrics } from "../../assets/data/kpiMetrics";
import KPICard from "./KpiCard";

const OverviewPanel = () => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <h2 className="text-xl font-semibold text-gray-800">Overview</h2>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {kpiMetrics.map((metric) => (
          <KPICard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            iconColor={metric.color} // ✅ FIX
            type={metric.type}
            progress={metric.progress}
            badgeLabel={metric.subText}
            chartData={metric.chartData}
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewPanel;
