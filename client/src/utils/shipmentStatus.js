// status codes (recommended backend format)
export const SHIPMENT_STATUS = {
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  PENDING: "PENDING",
  DELAYED: "DELAYED",
};

export const STATUS_LABELS_AM = {
  IN_TRANSIT: "በመጓጓዣ ላይ",
  DELIVERED: "ተልኳል",
  PENDING: "በመጠባበቅ",
  DELAYED: "ዘግይቷል",
};

export const STATUS_LABELS_EN = {
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  PENDING: "Pending",
  DELAYED: "Delayed",
};

export const STATUS_STYLES = {
  IN_TRANSIT:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  DELIVERED:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  DELAYED:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

export function isNewShipment(createdAt) {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return now - created <= 24 * 60 * 60 * 1000; // last 24 hours
}

export function formatShortDate(createdAt) {
  if (!createdAt) return "—";
  return new Date(createdAt).toLocaleDateString();
}