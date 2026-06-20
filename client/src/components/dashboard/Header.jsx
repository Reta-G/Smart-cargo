import React, { useEffect, useMemo, useState } from "react";
import { Menu, Bell, ChevronDown, Search } from "lucide-react";
import { useAuth } from "../../AuthContext";
import { messagesApi } from "../../api/messagesApi.js";

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  const displayName = user?.name || "—";
  const displayRole = user?.role || "—";

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const res = await messagesApi.list();
        const list = res.data || [];
        const unread = list.filter((m) => m.read !== true).length;
        setUnreadCount(unread);
      } catch {
        // ignore errors; don't break header
      }
    };

    loadUnread();
    // refresh every 15 seconds (simple polling)
    const id = setInterval(loadUnread, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-slate-700 lg:hidden"
        >
          <Menu className="h-6 w-6 text-gray-700 dark:text-slate-200" />
        </button>

        <div className="relative hidden w-80 md:flex">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
          <input
            type="text"
            placeholder="ጭነቶችን፣ ተሽከርካሪዎችን ይፈልጉ..."
            className="w-full rounded-xl border border-transparent bg-gray-100 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-slate-700"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-slate-700">
          <Bell className="h-6 w-6 text-gray-600 dark:text-slate-200" />

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* User */}
        <div className="flex cursor-pointer items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-300">
              {displayRole}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-sm font-bold text-gray-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
            {(displayName?.[0] || "U").toUpperCase()}
          </div>

          <ChevronDown className="hidden h-4 w-4 text-gray-400 dark:text-slate-400 sm:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;