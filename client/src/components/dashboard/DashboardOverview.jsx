import React from "react";
import KPICard from "./KpiCard";
import {
  Truck,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react";

const DashboardOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {/* አጠቃላይ ጭነቶች */}
      <KPICard
        title="አጠቃላይ ጭነቶች"
        value="1,245"
        icon={Package}
        iconColor="bg-blue-500"
        badgeLabel="↑ 7.5% በዚህ ሳምንት"
        type="badge"
      />

      {/* በመንገድ ላይ */}
      <KPICard
        title="በመንገድ ላይ"
        value="312"
        icon={Truck}
        iconColor="bg-indigo-500"
        type="sparkline"
        chartData={[
          { y: 10 },
          { y: 20 },
          { y: 15 },
          { y: 30 },
          { y: 25 },
        ]}
      />

      {/* ተጠባባቂ ጥያቄዎች */}
      <KPICard
        title="ተጠባባቂ ጥያቄዎች"
        value="18"
        icon={Clock}
        iconColor="bg-amber-500"
        type="progress"
        progress={64}
      />

      {/* ዛሬ ተደርሷል */}
      <KPICard
        title="ዛሬ ተደርሷል"
        value="98"
        icon={CheckCircle}
        iconColor="bg-green-500"
        type="donut"
        progress={85}
      />
    </div>
  );
};

export default DashboardOverview;