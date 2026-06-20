export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

export function saveAuth({ accessToken, user }) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // localStorage unavailable (private browsing, storage full, etc.)
  }
}

export function loadAuth() {
  try {
    const accessToken = localStorage.getItem(AUTH_TOKEN_KEY) || null;
    const userRaw = localStorage.getItem(AUTH_USER_KEY);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { accessToken, user };
  } catch {
    return { accessToken: null, user: null };
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // ignore
  }
}
