const BASE = {
  logs: [
    {
      id: "1",
      date: "2024-04-20",
      description: "Oil change and brake inspection",
      status: "Completed",
    },
    {
      id: "2",
      date: "2024-03-15",
      description: "Replaced windshield and air filters",
      status: "Awaiting Parts",
    },
    {
      id: "3",
      date: "2024-02-28",
      description: "Engine diagnostics due to check engine light",
      status: "In Progress",
    },
  ],
  activities: [
    { id: "a1", description: "Brakes replaced, tires rotated", date: "01/09/2024" },
    { id: "a2", description: "Routine inspection completed", date: "11/10/2023" },
    { id: "a3", description: "Fuel filter replaced", date: "09/10/2023" },
  ],
};

export const MAINTENANCE_BY_VEHICLE = {
  // You can add specific vehicle IDs here later if you want different logs per vehicle
  "TRK-1003": BASE,
  "TRK-1012": BASE,
};

export function getMaintenanceMock(vehicleId) {
  if (!vehicleId) return { logs: [], activities: [] };
  return MAINTENANCE_BY_VEHICLE[vehicleId] || { logs: [], activities: [] };
}