import React, { useEffect, useState } from "react";
import { analyticsApi } from "../../api/analyticsApi.js";
import QuickAnalytics from "./QuickAnalytics";

const QuickAnalyticsContainer = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await analyticsApi.quick();
        setData(res.data);
      } catch (e) {
        setError(e.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[340px] rounded-2xl border border-slate-200 bg-white animate-pulse dark:border-slate-700 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
        {error}
      </div>
    );
  }

  return <QuickAnalytics data={data} />;
};

export default QuickAnalyticsContainer;