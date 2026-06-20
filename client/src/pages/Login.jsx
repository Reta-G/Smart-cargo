import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "../AuthContext";

const ADMIN_ROLE = "ADMIN";
const DRIVER_ROLE = "DRIVER";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const from = location.state?.from; // example: "/dashboard/user-management"
  const isDriverLogin = location.pathname === "/driver-login";

  const [isSignup, setIsSignup] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // If user opens /driver-login, force login-only mode
  useEffect(() => {
    if (isDriverLogin) setIsSignup(false);
  }, [isDriverLogin]);

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const redirectByRole = (u) => {
    if (u?.role === ADMIN_ROLE) {
      if (from && from.startsWith("/dashboard")) {
        navigate(from, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      return;
    }

    if (u?.role === DRIVER_ROLE) {
      navigate("/driver-dashboard", { replace: true });
      return;
    }

    navigate("/user-dashboard", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      let user;

      // Driver login page must never register
      if (isDriverLogin && isSignup) setIsSignup(false);

      if (isSignup && !isDriverLogin) {
        // REGISTER (customers)
        user = await register({ name, email, password });
        setSuccess("Account created successfully. Redirecting...");
        setTimeout(() => redirectByRole(user), 400);
        return;
      }

      // LOGIN
      user = await login({ email, password });
      redirectByRole(user);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 transition-colors duration-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl transition-colors duration-300 dark:bg-slate-800 dark:shadow-black/20">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img src={logo} alt="logo" className="h-24" />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-2xl font-bold text-slate-900 dark:text-white">
          {isDriverLogin ? "Driver Login" : isSignup ? t("login.signup") : t("login.login")}
        </h2>

        {isDriverLogin && (
          <p className="mb-5 text-center text-sm text-slate-500 dark:text-slate-300">
            Drivers: Your account is created by Admin. Please login with your email and password.
          </p>
        )}

        {/* Error / Success */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-200">
            {success}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Input (Sign Up only) */}
          {isSignup && !isDriverLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
              <input
                type="text"
                placeholder={t("login.namePlaceholder")}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
            <input
              type="email"
              placeholder={t("login.emailPlaceholder")}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400 dark:text-slate-400" />
            <input
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
          >
            {loading
              ? isSignup && !isDriverLogin
                ? "Creating..."
                : "Logging in..."
              : isSignup && !isDriverLogin
              ? t("login.register")
              : t("login.login")}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-base text-slate-600 dark:text-slate-300">
          {!isDriverLogin && !isSignup && (
            <p className="mb-2">
              {t("login.noAccount")}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(true);
                  resetMessages();
                }}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {t("login.register")}
              </button>
            </p>
          )}

          {!isDriverLogin && isSignup && (
            <p className="mb-2">
              {t("login.haveAccount")}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(false);
                  resetMessages();
                }}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {t("login.login")}
              </button>
            </p>
          )}

          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {t("login.forgot")}
          </Link>

          {isDriverLogin && (
            <div className="mt-4 text-sm">
              <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
                Customer login / register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;