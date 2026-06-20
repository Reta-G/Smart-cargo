import React from "react";
import { X, History, User } from "lucide-react";

export const ActivityLogsModal = ({ isOpen, onClose, logs = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              All Activity Logs
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5 text-slate-400 dark:text-slate-300" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center space-x-4 rounded-lg border border-transparent p-3 transition-colors hover:border-slate-100 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-700/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200">
                <User className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {log.userName}
                  </span>{" "}
                  {log.action}
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-400">
                  {log.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 text-center dark:bg-slate-700/40">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 px-6 py-2 font-semibold text-slate-700 transition-all hover:bg-slate-300 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsModal;