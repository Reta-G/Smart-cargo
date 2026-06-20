import React, { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "./api/authApi";
import { clearAuth, loadAuth, saveAuth } from "./authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const initial = loadAuth();

  const [user, setUser] = useState(initial.user);
  const [accessToken, setAccessToken] = useState(initial.accessToken);

  const register = async ({ name, email, password }) => {
    const data = await authApi.register({ name, email, password });
    saveAuth(data);
    setUser(data.user);
    setAccessToken(data.accessToken);
    return data.user;
  };

  const login = async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    saveAuth(data);
    setUser(data.user);
    setAccessToken(data.accessToken);
    return data.user;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setAccessToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      register,
      login,
      logout,
    }),
    [user, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};