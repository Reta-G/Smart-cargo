import React from "react";
import { X, Trash2, Reply } from "lucide-react";

const MessageDetailsModal = ({
  open,
  onClose,
  message,
  onReply,
  onDelete,
  deleting = false,
}) => {
  if (!open || !message) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-700 dark:bg-slate-700/30">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">
            Message Details
          </h3>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase text-slate-400">Name</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {message.name}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase text-slate-400">Email</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {message.email}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase text-slate-400">Subject</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {message.subject}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase text-slate-400">Message</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {message.message}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-bold uppercase text-slate-400">Date</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {new Date(message.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-700/30 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={onReply}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
          >
            <Reply size={16} />
            Reply
          </button>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Close
            </button>

            <button
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
            >
              <Trash2 size={16} />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailsModal;