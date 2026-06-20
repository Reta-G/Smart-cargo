import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { quoteApi } from "../api/quoteApi.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const CARGO_TYPES = [
  "General", "Electronics", "Textiles", "Food",
  "Machinery", "Fragile", "Refrigerated", "Hazardous",
];

const fmt = (n) => Number(n).toLocaleString();

const Row = ({ label, value, bold }) => (
  <div className={`flex items-center justify-between py-2 ${bold ? "border-t border-slate-200 dark:border-slate-600 mt-1 pt-3" : ""}`}>
    <span className={`text-sm ${bold ? "font-bold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
      {label}
    </span>
    <span className={`text-sm ${bold ? "font-extrabold text-blue-600 dark:text-blue-400 text-base" : "font-semibold text-slate-800 dark:text-slate-100"}`}>
      {value}
    </span>
  </div>
);

const InstantQuoteModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    origin: "", destination: "", cargoType: "General",
    weightKg: "", volumeM3: "", urgent: false,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const payload = {
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        cargoType: form.cargoType,
        weightKg: form.weightKg === "" ? 0 : Number(form.weightKg),
        volumeM3: form.volumeM3 === "" ? 0 : Number(form.volumeM3),
        urgent: form.urgent,
      };
      const res = await quoteApi.calculate(payload);
      setResult(res.data);
    } catch (err) {
      setError(err.message || "Failed to calculate quote");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestShipment = () => {
    onClose();
    if (isAuthenticated) {
      navigate("/user-dashboard");
    } else {
      navigate("/login");
    }
  };

  const reset = () => { setResult(null); setError(""); };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2">
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">{t("quote.title")}</h2>
                <p className="text-xs text-blue-100">{t("quote.subtitle")}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto p-6">
            {/* Error */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Result */}
            {result ? (
              <div>
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/30 dark:bg-emerald-900/20">
                  <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {result.note}
                  </span>
                </div>

                {/* Route summary */}
                <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <span>{result.origin}</span>
                    <TrendingUp size={16} className="text-blue-500" />
                    <span>{result.destination}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>{result.cargoType} · {result.chargeableWeight} kg chargeable</span>
                    {result.urgent && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 font-bold dark:bg-amber-900/30 dark:text-amber-300">
                        URGENT
                      </span>
                    )}
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t("quote.breakdown")}
                  </p>
                  <Row label={t("quote.freight")}  value={`${fmt(result.breakdown.freightCost)} ${t("quote.currency")}`} />
                  <Row label={t("quote.fuel")}     value={`${fmt(result.breakdown.fuelSurcharge)} ${t("quote.currency")}`} />
                  <Row label={t("quote.handling")} value={`${fmt(result.breakdown.handlingFee)} ${t("quote.currency")}`} />
                  {result.breakdown.urgentFee > 0 && (
                    <Row label={t("quote.urgentFee")} value={`${fmt(result.breakdown.urgentFee)} ${t("quote.currency")}`} />
                  )}
                  <Row label={t("quote.total")} value={`${fmt(result.breakdown.total)} ${t("quote.currency")}`} bold />
                </div>

                {/* Transit + validity */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {t("quote.transit")}: {result.estimatedTransitDays} {t("quote.days")}
                  </span>
                  <span>{t("quote.valid")}</span>
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  >
                    {t("quote.tryAgain")}
                  </button>
                  <button
                    onClick={handleRequestShipment}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    {t("quote.requestShipment")}
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("quote.origin")} *
                    </label>
                    <input
                      value={form.origin}
                      onChange={(e) => set("origin", e.target.value)}
                      placeholder={t("quote.originPlaceholder")}
                      required
                      maxLength={200}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("quote.destination")} *
                    </label>
                    <input
                      value={form.destination}
                      onChange={(e) => set("destination", e.target.value)}
                      placeholder={t("quote.destinationPlaceholder")}
                      required
                      maxLength={200}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t("quote.cargoType")}
                  </label>
                  <select
                    value={form.cargoType}
                    onChange={(e) => set("cargoType", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  >
                    {CARGO_TYPES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("quote.weightKg")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50000"
                      step="0.1"
                      value={form.weightKg}
                      onChange={(e) => set("weightKg", e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t("quote.volumeM3")}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.volumeM3}
                      onChange={(e) => set("volumeM3", e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-600 dark:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={form.urgent}
                    onChange={(e) => set("urgent", e.target.checked)}
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-white">
                      {t("quote.urgent")}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">+35% premium, 1-day transit</p>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {t("quote.calculating")}
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      {t("quote.calculate")}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InstantQuoteModal;
