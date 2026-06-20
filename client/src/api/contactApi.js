import { apiRequest } from "./http.js";

export const contactApi = {
  send: (payload) =>
    apiRequest("/contact", {
      method: "POST",
      body: payload,
    }),
};