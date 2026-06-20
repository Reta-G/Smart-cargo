import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sun,
  Moon,
  Monitor,
  X,
  Menu,
  LayoutDashboard,
  Info,
  Phone,
  LogOut,
  Globe,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const role = user?.role; // "ADMIN" | "CUSTOMER" | "DRIVER"
  const hideNavbar = location.pathname.startsWith("/dashboard");

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  // ✅ One function: takes user to the correct dashboard
  const handleGoDashboard = () => {
    closeMenu();

    if (role === "ADMIN") {
      navigate("/dashboard");
      return;
    }
    if (role === "DRIVER") {
      navigate("/driver-dashboard");
      return;
    }
    // CUSTOMER default
    navigate("/user-dashboard");
  };

  if (hideNavbar) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-transparent bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <img src={logo} alt="Logo" className="h-12 w-12" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              Smart<span className="text-blue-600">Cargo</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
              to="/about"
            >
              {t("navbar.about")}
            </Link>

            <Link
              className="text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
              to="/contact"
            >
              {t("navbar.contact")}
            </Link>

            {/* Theme Toggle */}
            <div className="flex items-center gap-1 rounded-2xl border border-gray-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <button
                onClick={() => setTheme("light")}
                className={`rounded-xl p-2 transition ${
                  theme === "light"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
                aria-label="Light theme"
              >
                <Sun size={18} />
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`rounded-xl p-2 transition ${
                  theme === "dark"
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
                aria-label="Dark theme"
              >
                <Moon size={18} />
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`rounded-xl p-2 transition ${
                  theme === "system"
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
                aria-label="System theme"
              >
                <Monitor size={18} />
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <Globe size={16} className="text-slate-600 dark:text-slate-300" />
              <LanguageSwitcher className="gap-0" />
            </div>

            {/* Auth Area */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Welcome, {user?.name || "User"}
                </span>

                {/* ✅ Dashboard button for ALL logged-in users */}
                <button
                  type="button"
                  onClick={handleGoDashboard}
                  className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
              >
                {t("navbar.login")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800 md:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/40"
            onClick={closeMenu}
            aria-label="Close menu"
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <div className="leading-tight">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    SmartCargo
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-300">
                    Menu
                  </div>
                </div>
              </div>

              <button
                onClick={closeMenu}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close menu button"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100%-64px)] flex-col">
              {/* Links */}
              <div className="p-4">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Pages
                </div>

                <div className="space-y-2">
                  <Link
                    to="/about"
                    onClick={closeMenu}
                    className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <Info size={18} className="mr-3 text-slate-500 dark:text-slate-300" />
                    {t("navbar.about")}
                  </Link>

                  <Link
                    to="/contact"
                    onClick={closeMenu}
                    className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    <Phone size={18} className="mr-3 text-slate-500 dark:text-slate-300" />
                    {t("navbar.contact")}
                  </Link>
                </div>

                {/* Theme */}
                <div className="mt-6">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Theme
                  </div>

                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition ${
                        theme === "light"
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Sun size={16} /> Light
                    </button>

                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition ${
                        theme === "dark"
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Moon size={16} /> Dark
                    </button>

                    <button
                      onClick={() => setTheme("system")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition ${
                        theme === "system"
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Monitor size={16} /> Auto
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div className="mt-6">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Language
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                    <Globe size={18} className="text-slate-600 dark:text-slate-300" />
                    <LanguageSwitcher className="gap-2" />
                  </div>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    {/* ✅ Dashboard button for ALL logged-in users */}
                    <button
                      type="button"
                      onClick={handleGoDashboard}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      <LogOut size={18} />
                      Log out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    {t("navbar.login")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;