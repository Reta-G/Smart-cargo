import { VEHICLE_STATUS } from "../../../utils/vehicleStatus.js";

const INITIAL_VEHICLES = [
  { id: "TRK-1021", type: "Box Truck", status: VEHICLE_STATUS.AVAILABLE, driver: "Mike D.", lastSeen: "5 mins ago" },
  { id: "TRK-1008", type: "Semi-Trailer", status: VEHICLE_STATUS.IN_TRANSIT, driver: "Sarah K.", lastSeen: "15 mins ago" },
  { id: "TRK-1007", type: "Box Truck", status: VEHICLE_STATUS.AVAILABLE, driver: "Unassigned", lastSeen: "25 mins ago" },
  { id: "TRK-1003", type: "Reefer Truck", status: VEHICLE_STATUS.MAINTENANCE, driver: "Unassigned", lastSeen: "20 mins ago", maintenanceNote: "Awaiting Parts" },
  { id: "TRK-1015", type: "Semi-Trailer", status: VEHICLE_STATUS.IN_TRANSIT, driver: "Unassigned", lastSeen: "40 mins ago" },
  { id: "TRK-1012", type: "Box Truck", status: VEHICLE_STATUS.MAINTENANCE, driver: "Unassigned", lastSeen: "50 mins ago" },
];

export default INITIAL_VEHICLES;