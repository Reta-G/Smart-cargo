import { loadAuth, clearAuth } from "../authStorage.js";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers || {});

  // JSON by default if body is object
  if (options.body && typeof options.body === "object") {
    headers.set("Content-Type", "application/json");
  }

  // ✅ Attach token automatically
  const { accessToken } = loadAuth();
  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body:
      options.body && typeof options.body === "object"
        ? JSON.stringify(options.body)
        : options.body,
  });

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  // Standard error handling
  if (!res.ok) {
    // optional: auto logout on 401
    if (res.status === 401) clearAuth();

    const msg =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;

    throw new Error(msg);
  }

  return data;
}