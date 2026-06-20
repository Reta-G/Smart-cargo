import { apiRequest } from "./http.js";

/**
 * POST /api/quote
 * Returns an AI-powered instant landed-cost estimate.
 *
 * @param {{ origin: string, destination: string, cargoType?: string,
 *           weightKg?: number, volumeM3?: number, urgent?: boolean }} payload
 */
export const quoteApi = {
  calculate: (payload) =>
    apiRequest("/quote", { method: "POST", body: payload }),
};
