import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Loader2,
  MessageSquareText,
} from "lucide-react";
import { contactApi } from "../api/contactApi.js";

const InputField = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  type = "text",
  multiline = false,
  disabled = false,
}) => (
  <div className="mb-6 flex-1">
    <label className="mb-1 block text-xs font-semibold text-gray-400 dark:text-slate-300">
      {label}
    </label>

    {multiline ? (
      <textarea
        className="h-24 w-full resize-none border-b border-gray-300 bg-transparent py-2 text-sm text-gray-700 outline-none transition-colors focus:border-blue-600 dark:border-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400 disabled:opacity-60"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    ) : (
      <input
        type={type}
        className="w-full border-b border-gray-300 bg-transparent py-2 text-sm text-gray-700 outline-none transition-colors focus:border-blue-600 dark:border-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400 disabled:opacity-60"
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    )}
  </div>
);

const ContactPage = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Smart analysis UI (still fake / frontend only for now)
  const [smartAnalysis, setSmartAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // NEW: submit states
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubmitError("");
    setSubmitSuccess("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const analyzeMessage = () => {
    if (!formData.message || formData.message.length < 5) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setSmartAnalysis(t("contact.smartAnalysis"));
      setIsAnalyzing(false);
    }, 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    try {
      await contactApi.send(formData);

      setSubmitSuccess("Message sent successfully. We will contact you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSmartAnalysis(null);
    } catch (err) {
      setSubmitError(err.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pb-12 pt-16 transition-colors duration-300 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {/* Header */}
      <div className="mb-12 max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800 dark:text-white">
          {t("contact.title")}
        </h1>
        <p className="px-4 text-sm leading-relaxed text-gray-500 dark:text-slate-300">
          {t("contact.subtitle")}
        </p>
      </div>

      {/* Main Card */}
      <div className="flex min-h-[550px] w-full max-w-5xl flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl transition-colors duration-300 dark:bg-slate-800 dark:shadow-black/20 md:flex-row">
        {/* Left Panel */}
        <div className="relative m-3 flex flex-col justify-between rounded-[32px] bg-blue-200 p-10 text-blue-700 shadow-lg transition-colors duration-300 dark:bg-slate-700/80 dark:text-blue-100 md:w-1/3">
          <div>
            <h2 className="mb-4 text-2xl font-bold">{t("contact.contact")}</h2>
            <p className="mb-10 text-xs font-medium leading-relaxed text-blue-700/80 dark:text-slate-300">
              {t("contact.description")}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-600/10 p-2.5 shadow-md dark:bg-slate-600">
                  <Phone size={18} />
                </div>
                <div className="text-sm font-medium">
                  <p>{t("contact.phone1")}</p>
                  <p>{t("contact.phone2")}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-600/10 p-2.5 shadow-md dark:bg-slate-600">
                  <Mail size={18} />
                </div>
                <p className="text-sm font-medium">{t("contact.emailAddress")}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-600/10 p-2.5 shadow-md dark:bg-slate-600">
                  <MapPin size={18} />
                </div>
                <p className="text-sm font-medium">{t("contact.address")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="relative rounded-xl p-10 transition-colors duration-300 md:w-2/3 md:p-14">
          {/* Success / Error */}
          {submitError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-200">
              {submitSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
              <InputField
                label={t("contact.name")}
                placeholder={t("contact.namePlaceholder")}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <InputField
                label={t("contact.email")}
                placeholder={t("contact.emailPlaceholder")}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <InputField
              label={t("contact.subject")}
              placeholder={t("contact.subjectPlaceholder")}
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />

            <div className="group relative">
              <InputField
                label={t("contact.message")}
                placeholder={t("contact.messagePlaceholder")}
                name="message"
                multiline
                value={formData.message}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />

              <button
                type="button"
                onClick={analyzeMessage}
                disabled={isAnalyzing || !formData.message || isSubmitting}
                className="absolute right-0 top-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-300 dark:hover:text-blue-200"
              >
                {isAnalyzing ? (
                  <Loader2 className="animate-spin" size={12} />
                ) : (
                  <MessageSquareText size={12} />
                )}
                {t("contact.smartAnalysisButton")}
              </button>
            </div>

            {smartAnalysis && (
              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-3 transition-colors duration-300 dark:border-slate-600 dark:bg-slate-700/70">
                <p className="mb-1 text-[10px] font-bold uppercase text-blue-600 dark:text-blue-300">
                  {t("contact.aiAnalysis")}
                </p>
                <p className="text-xs italic font-medium text-blue-800 dark:text-slate-100">
                  "{smartAnalysis}"
                </p>
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                {isSubmitting ? t("contact.sending") : t("contact.sendMessage")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 flex items-center gap-4 text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-slate-400">
        <span>{t("contact.footerText")}</span>
        <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-slate-500"></span>
        <span>{t("contact.privacyPolicy")}</span>
        <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-slate-500"></span>
        <span>{t("contact.termsOfService")}</span>
      </div>
    </div>
  );
};

export default ContactPage;