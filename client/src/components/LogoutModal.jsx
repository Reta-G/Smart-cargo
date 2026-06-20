import React from "react";
import { LogOut } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-colors duration-300 dark:bg-slate-800 dark:shadow-black/30">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <LogOut className="h-7 w-7 text-red-600 dark:text-red-300" />
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sign out?
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-300">
            Are you sure you want to sign out of your account?
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;