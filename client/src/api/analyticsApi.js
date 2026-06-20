import { apiRequest } from "./http.js";

export const analyticsApi = {
  quick: () => apiRequest("/admin/analytics/quick"),
  overview: () => apiRequest("/admin/analytics/overview"),
};
