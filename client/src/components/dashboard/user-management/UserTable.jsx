import React, { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Plus,
  Trash2,
  Power,
} from "lucide-react";
import {
  ROLE_CONFIG,
  USER_ROLES,
  USER_ROLE_LABELS,
  USER_STATUS,
  USER_STATUS_LABELS,
} from "./constants";

export const UserTable = (props) => {
  const {
    users = [],

    // optional controlled props
    currentPage: currentPageProp,
    pageSize = 10,
    onPageChange: onPageChangeProp,

    activeTab: activeTabProp,
    onTabChange: onTabChangeProp,

    searchTerm: searchTermProp,
    onSearchChange: onSearchChangeProp,

    onSortChange = () => {},

    onEditUser = () => {},
    onAddUser = () => {},

    // ✅ NEW backend-ready callbacks
    onChangeRole = () => {},
    onToggleStatus = () => {},
    onDeleteUser = () => {},
  } = props || {};

  // internal state (used if parent doesn't control)
  const [internalTab, setInternalTab] = useState("All");
  const [internalQuery, setInternalQuery] = useState("");
  const [internalPage, setInternalPage] = useState(1);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const activeTab = activeTabProp !== undefined ? activeTabProp : internalTab;
  const setActiveTab = (tab) => {
    if (onTabChangeProp) onTabChangeProp(tab);
    else setInternalTab(tab);
  };

  const query = searchTermProp !== undefined ? searchTermProp : internalQuery;
  const setQuery = (q) => {
    if (onSearchChangeProp) onSearchChangeProp(q);
    else setInternalQuery(q);
  };

  const page = currentPageProp !== undefined ? currentPageProp : internalPage;
  const setPage = (p) => {
    if (onPageChangeProp) onPageChangeProp(p);
    else setInternalPage(p);
  };

  const effectivePageSize = pageSize || 10;

  const handleSearch = (q) => {
    setQuery(q);
    setPage(1);
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else setSortDir("asc");

    setSortKey(key);
    onSortChange(key);
  };

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    let list = (users || []).slice();

    if (activeTab && activeTab !== "All") {
      list = list.filter((u) => u.role === activeTab);
    }

    if (q) {
      list = list.filter((u) => {
        const roleLabel = (USER_ROLE_LABELS[u.role] || u.role || "")
          .toString()
          .toLowerCase();
        const statusLabel = (USER_STATUS_LABELS[u.status] || u.status || "")
          .toString()
          .toLowerCase();

        return (
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          roleLabel.includes(q) ||
          statusLabel.includes(q)
        );
      });
    }

    if (sortKey) {
      list.sort((a, b) => {
        const va = (a[sortKey] || "").toString().toLowerCase();
        const vb = (b[sortKey] || "").toString().toLowerCase();
        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [users, query, sortKey, sortDir, activeTab]);

  const paged = useMemo(() => {
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / effectivePageSize));
    const current = Math.min(Math.max(1, page), pages);
    const start = (current - 1) * effectivePageSize;
    const end = start + effectivePageSize;

    return {
      total,
      pages,
      current,
      items: filtered.slice(start, end),
      startIndex: total > 0 ? start + 1 : 0,
      endIndex: Math.min(end, total),
    };
  }, [filtered, page, effectivePageSize]);

  const tabLabel = (tab) =>
    tab === "All" ? "All" : USER_ROLE_LABELS[tab] || tab;

  const roleOptions = USER_ROLES.filter((r) => r !== "All");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {/* Header */}
      <div className="space-y-4 border-b border-slate-100 p-4 dark:border-slate-700">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative max-w-md flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              className="block w-full rounded-lg border border-slate-200 py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="Search users..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onAddUser}
              className="inline-flex items-center rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Add User
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <ArrowUpDown className="h-4 w-4 text-slate-500" />
                <span>Sort By</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-100 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800">
                  {["name", "role", "status"].map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        handleSort(key);
                        setIsSortOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm capitalize text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="no-scrollbar flex items-center justify-between overflow-x-auto border-t border-slate-50 pt-4 dark:border-slate-700">
          <div className="flex space-x-8">
            {USER_ROLES.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`border-b-2 px-1 pb-3 text-sm font-medium ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {tabLabel(tab)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="min-h-100 flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {paged.total > 0 ? (
              paged.items.map((user) => {
                const roleCfg = ROLE_CONFIG[user.role] || {};
                const RoleIcon = roleCfg.Icon;

                const roleLabel = USER_ROLE_LABELS[user.role] || user.role;
                const isActive = user.status === USER_STATUS.ACTIVE;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
                  >
                    {/* Role */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`rounded-md p-1.5 ${roleCfg.iconBg || ""}`}>
                          {RoleIcon ? <RoleIcon className="h-4 w-4" /> : null}
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className={`w-fit rounded px-2.5 py-0.5 text-[11px] font-bold ${roleCfg.badgeColor || ""}`}>
                            {roleLabel}
                          </span>

                          {/* ✅ Backend-ready role change */}
                          <select
                            value={user.role}
                            onChange={(e) => onChangeRole(user.id, e.target.value)}
                            className="w-fit rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          >
                            {roleOptions.map((r) => (
                              <option key={r} value={r}>
                                {USER_ROLE_LABELS[r] || r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                          {RoleIcon ? <RoleIcon className="h-4 w-4" /> : null}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                        }`}
                      >
                        <span
                          className={`mr-2 h-1.5 w-1.5 rounded-full ${
                            isActive ? "bg-green-500" : "bg-orange-500"
                          }`}
                        />
                        {USER_STATUS_LABELS[user.status] || user.status}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 dark:text-slate-300">
                        {user.email}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onEditUser(user)}
                          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => onToggleStatus(user.id)}
                          className={`inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-semibold ${
                            isActive
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300"
                          }`}
                          title="Toggle status"
                        >
                          <Power className="h-3.5 w-3.5" />
                          {isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="inline-flex items-center gap-1 rounded bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                          title="Delete user"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400 dark:text-slate-300">
                  <Search className="mx-auto mb-2 h-10 w-10 opacity-20" />
                  <p>No users found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300 sm:flex-row">
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-700 dark:text-white">
            {paged.total > 0 ? paged.startIndex : 0}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-700 dark:text-white">
            {paged.endIndex}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700 dark:text-white">
            {paged.total}
          </span>{" "}
          results
        </p>

        <div className="flex items-center space-x-2">
          <button
            disabled={paged.current === 1}
            onClick={() => setPage(paged.current - 1)}
            className="rounded-lg border p-2 disabled:opacity-30 dark:border-slate-600 dark:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: paged.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg ${
                paged.current === p
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={paged.current === paged.pages || paged.pages === 0}
            onClick={() => setPage(paged.current + 1)}
            className="rounded-lg border p-2 disabled:opacity-30 dark:border-slate-600 dark:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};