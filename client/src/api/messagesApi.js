import { apiRequest } from "./http.js";

export const messagesApi = {
  list: () => apiRequest("/admin/messages"),
  markRead: (id) => apiRequest(`/admin/messages/${id}/read`, { method: "PATCH" }),
  remove: (id) => apiRequest(`/admin/messages/${id}`, { method: "DELETE" }),
};