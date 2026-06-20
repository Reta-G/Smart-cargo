import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  USER_ROLES,
  USER_ROLE_LABELS,
  USER_STATUS,
  USER_STATUS_LABELS,
} from "./constants";

const UserModal = ({ isOpen, onClose, user = null, onSave }) => {
  const isEdit = !!user?.id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Only required for CREATE
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("CUSTOMER");
  const [status, setStatus] = useState(USER_STATUS.ACTIVE);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "CUSTOMER");
      setStatus(user.status || USER_STATUS.ACTIVE);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setRole("CUSTOMER");
      setStatus(USER_STATUS.ACTIVE);
      setPassword("");
    }
  }, [user]);

  if (!isOpen) return null;

  const roleOptions = USER_ROLES.filter((r) => r !== "All");

  const handleSave = () => {
    const payload = {
      id: user?.id, // undefined when creating
      name: name.trim(),
      email: email.trim(),
      role,
      status,
      password: isEdit ? undefined : password, // only for create
    };

    if (!payload.name || !payload.email) {
      alert("Name and Email are required.");
      return;
    }

    if (!isEdit && !payload.password) {
      alert("Password is required for new users.");
      return;
    }

    onSave && onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEdit ? "Edit User" : "Add User"}
          </h3>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4 text-slate-400 dark:text-slate-300" />
          </button>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEdit} // backend PATCH doesn't update email in our API (simple + safe)
              className="mt-1 w-full rounded border p-2 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            {isEdit && (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-300">
                Email editing is disabled for now.
              </p>
            )}
          </div>

          {!isEdit && (
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-1 w-full rounded border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                placeholder="Set a password for this user"
              />
            </div>
          )}

          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {USER_ROLE_LABELS[r] || r}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-40">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <option value={USER_STATUS.ACTIVE}>
                  {USER_STATUS_LABELS[USER_STATUS.ACTIVE]}
                </option>
                <option value={USER_STATUS.INACTIVE}>
                  {USER_STATUS_LABELS[USER_STATUS.INACTIVE]}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t bg-slate-50 p-4 text-right dark:border-slate-700 dark:bg-slate-700/40">
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;