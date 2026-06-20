import { apiRequest } from "./http.js";

export const shipmentsApi = {
  list: (params = "") => apiRequest(`/admin/shipments${params}`),
  listRecent: () => apiRequest("/admin/shipments?limit=6"),
  create: (body) => apiRequest("/admin/shipments", { method: "POST", body }),
  update: (id, body) => apiRequest(`/admin/shipments/${id}`, { method: "PATCH", body }),
  remove: (id) => apiRequest(`/admin/shipments/${id}`, { method: "DELETE" }),
  proofOfDelivery: (id, body) => apiRequest(`/admin/shipments/${id}/proof-of-delivery`, { method: "POST", body }),
};
