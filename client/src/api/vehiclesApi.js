import { apiRequest } from "./http.js";

export const vehiclesApi = {
  // For LiveMap — returns vehicles that have active GPS coordinates
  locations: () => apiRequest("/admin/vehicles/locations"),
  // Full vehicle list
  list: () => apiRequest("/admin/vehicles"),
};
