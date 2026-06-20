import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { messagesApi } from "../../api/messagesApi.js";
import MessageDetailsModal from "../../components/dashboard/MessageDetailsModal.jsx";

const PAGE_SIZE = 8;

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [deleting, setDeleting] = useState(false);

  const loadMessages = async () => {
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

  useEffect(() => {
    loadMessages();
  }, []);

  const openMessage = async (m) => {
    setSelectedMessage(m);

    // mark read if unread
    const isRead = m.read === true;
    if (!isRead) {
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
      setSelectedMessage((prev) => (prev ? { ...prev, read: true } : prev));

      try {
        await messagesApi.markRead(m.id);
      } catch {
        setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: false } : x)));
        setSelectedMessage((prev) => (prev ? { ...prev, read: false } : prev));
      }
    }
  };

  // D) Reply: open mail client (no nodemailer yet)
  const handleReply = () => {
    if (!selectedMessage) return;
    const email = selectedMessage.email;
    const subject = `Re: ${selectedMessage.subject || "Your message to SmartCargo"}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  // C) Delete: call backend DELETE
  const handleDelete = async () => {
    if (!selectedMessage) return;

    const ok = window.confirm("Delete this message? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    try {
      await messagesApi.remove(selectedMessage.id);

      setMessages((prev) => prev.filter((x) => x.id !== selectedMessage.id));
      setSelectedMessage(null);
    } catch (e) {
      alert(e.message || "Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;

    return messages.filter((m) => {
      return (
        String(m.name || "").toLowerCase().includes(q) ||
        String(m.email || "").toLowerCase().includes(q) ||
        String(m.subject || "").toLowerCase().includes(q) ||
        String(m.message || "").toLowerCase().includes(q)
      );
    });
  }, [messages, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paged = filtered.slice(start, end);

  useEffect(() => setPage(1), [query]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-300 dark:bg-slate-900">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Messages</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
            Contact requests sent from the website.
          </p>
        </div>

        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, subject..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          />
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
          Loading messages...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">All Messages</h2>
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  Unread messages show “NEW”. Click a row to view details.
                </p>
              </div>

              <button
                onClick={loadMessages}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-slate-500 dark:text-slate-300">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  paged.map((m) => {
                    const unread = m.read !== true;
                    return (
                      <tr
                        key={m.id}
                        onClick={() => openMessage(m)}
                        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${unread ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"}`}>
                              {m.name}
                            </span>
                            {unread && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                                New
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{m.email}</td>
                        <td className={`px-6 py-4 ${unread ? "font-semibold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200"}`}>
                          {m.subject}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {new Date(m.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <span>
              Showing {filtered.length === 0 ? 0 : start + 1} - {Math.min(end, filtered.length)} of {filtered.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
              >
                Prev
              </button>

              <span className="text-sm">
                Page <b>{safePage}</b> / {totalPages}
              </span>

              <button
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <MessageDetailsModal
        open={!!selectedMessage}
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onReply={handleReply}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </div>
  );
};

export default Messages;