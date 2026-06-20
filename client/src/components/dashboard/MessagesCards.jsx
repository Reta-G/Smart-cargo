import React, { useEffect, useMemo, useState } from "react";
import { Mail, CalendarDays, Clock, User } from "lucide-react";
import { messagesApi } from "../../api/messagesApi.js";

const Card = ({ title, value, icon: Icon, subtitle }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
          {title}
        </p>
        <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
          {value}
        </p>
        {subtitle && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
            {subtitle}
          </p>
        )}
      </div>
      <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const isSameDay = (a, b) => {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

const MessagesCards = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await messagesApi.list();
        setMessages(res.data || []);
      } catch (e) {
        setError(e.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const total = messages.length;

    const todayCount = messages.filter((m) =>
      isSameDay(m.createdAt, new Date())
    ).length;

    const last7DaysCount = messages.filter((m) => {
      const d = new Date(m.createdAt).getTime();
      const now = Date.now();
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).length;

    const latest = messages[0];
    const latestSender = latest?.name ? latest.name : "—";

    return { total, todayCount, last7DaysCount, latestSender };
  }, [messages]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
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

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Total Messages"
        value={stats.total}
        icon={Mail}
        subtitle="All contact requests"
      />
      <Card
        title="Messages Today"
        value={stats.todayCount}
        icon={CalendarDays}
        subtitle="New messages received today"
      />
      <Card
        title="Last 7 Days"
        value={stats.last7DaysCount}
        icon={Clock}
        subtitle="Messages received this week"
      />
      <Card
        title="Latest Sender"
        value={stats.latestSender}
        icon={User}
        subtitle="Most recent contact"
      />
    </div>
  );
};

export default MessagesCards;