import { apiRequest } from "./http.js";

export const usersApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ).toString();

    return apiRequest(`/admin/users${qs ? `?${qs}` : ""}`);
  },

  // we will use these in the next step
  create: (payload) => apiRequest("/admin/users", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/admin/users/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => apiRequest(`/admin/users/${id}`, { method: "DELETE" }),
};