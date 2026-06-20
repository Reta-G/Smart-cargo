import React, { useEffect, useState } from "react";
import KPICards from "../../components/dashboard/user-management/KpiCards";
import { UserTable } from "../../components/dashboard/user-management/UserTable";
import PermissionsSidebar from "../../components/dashboard/user-management/PermissionsSidebar";
import ActivityLogsModal from "../../components/dashboard/user-management/ActivityLogsModal";
import UserModal from "../../components/dashboard/user-management/UserModal";

import { permissionsMock } from "../../mocks/userPermissions.mock.js";
import { userLogsMock } from "../../mocks/userLogs.mock.js";

import { usersApi } from "../../api/usersApi.js";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  // keep as mock for now
  const [permissions, setPermissions] = useState(permissionsMock);
  const [logs, setLogs] = useState(userLogsMock);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [saving, setSaving] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showLogsModal, setShowLogsModal] = useState(false);

  const loadUsers = async () => {
    setLoadingUsers(true);
    setUsersError("");
    try {
      const res = await usersApi.list({ limit: 100 });
      setUsers(res?.data || []);
    } catch (e) {
      setUsersError(e.message || "Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = () => setShowAddModal(true);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  // ✅ Now saves to backend
  const handleSaveUser = async (payload) => {
    setSaving(true);
    try {
      // EDIT
      if (payload.id) {
        const res = await usersApi.update(payload.id, {
          name: payload.name,
          role: payload.role,
          status: payload.status,
        });

        const updated = res?.data;
        setUsers((prev) => prev.map((u) => (u.id === payload.id ? updated : u)));
      }
      // CREATE
      else {
        const res = await usersApi.create({
          name: payload.name,
          email: payload.email,
          password: payload.password,
          role: payload.role,
          status: payload.status,
        });

        const created = res?.data;
        setUsers((prev) => [created, ...(prev || [])]);
      }

      // Close modals
      setShowAddModal(false);
      setShowEditModal(false);
      setEditingUser(null);
    } catch (e) {
      alert(e.message || "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handlePermissionChange = (role, key) => {
    setPermissions((prev) =>
      (prev || []).map((p) => {
        if (p.role !== role) return p;
        return { ...p, permissions: { ...p.permissions, [key]: !p.permissions[key] } };
      })
    );
  };

  const handleViewAllLogs = () => setShowLogsModal(true);

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-300 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          User Management
        </h1>

        <button
          onClick={loadUsers}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
        >
          Refresh
        </button>
      </div>

      {usersError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
          {usersError}
        </div>
      )}

      <KPICards users={users} onAddUser={handleAddUser} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {loadingUsers ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Loading users...
            </div>
          ) : (
            <UserTable users={users} onAddUser={handleAddUser} onEditUser={handleEditUser} />
          )}
        </div>

        <div className="lg:col-span-1">
          <PermissionsSidebar
            permissions={permissions}
            logs={logs}
            onPermissionChange={handlePermissionChange}
            onViewAllLogs={handleViewAllLogs}
          />
        </div>
      </div>

      <UserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveUser}
      />

      <UserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={handleSaveUser}
      />

      <ActivityLogsModal
        isOpen={showLogsModal}
        onClose={() => setShowLogsModal(false)}
        logs={logs}
      />

      {saving && (
        <div className="fixed bottom-6 right-6 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          Saving...
        </div>
      )}
    </div>
  );
};

export default UserManagement;