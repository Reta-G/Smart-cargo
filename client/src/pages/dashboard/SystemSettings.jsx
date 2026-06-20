import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../ThemeContext";

const SystemSettings = () => {
  const { i18n, t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [lang, setLang] = useState(() => {
    try {
      return (
        localStorage.getItem("i18nextLng") ||
        (i18n.language
          ? i18n.language.startsWith("am")
            ? "am"
            : "en"
          : "en")
      );
    } catch {
      return "en";
    }
  });

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("i18nextLng", lng);
    } catch {}
    setLang(lng);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-slate-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">{t("systemSettings.title")}</h1>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <p className="text-gray-600 dark:text-gray-300">
          {t("systemSettings.description")}
        </p>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            {t("systemSettings.languageLabel")}
          </label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="language"
                value="en"
                checked={lang === "en"}
                onChange={() => changeLanguage("en")}
                className="mr-2"
              />
              {t("systemSettings.language_en")}
            </label>
            <label className="inline-flex items-center text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="language"
                value="am"
                checked={lang === "am"}
                onChange={() => changeLanguage("am")}
                className="mr-2"
              />
              {t("systemSettings.language_am")}
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Theme
          </label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
                className="mr-2"
              />
              Light
            </label>
            <label className="inline-flex items-center text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
                className="mr-2"
              />
              Dark
            </label>
            <label className="inline-flex items-center text-gray-700 dark:text-gray-200">
              <input
                type="radio"
                name="theme"
                value="system"
                checked={theme === "system"}
                onChange={() => setTheme("system")}
                className="mr-2"
              />
              System
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;