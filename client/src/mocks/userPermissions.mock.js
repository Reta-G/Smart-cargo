import { USER_ROLE } from "../components/dashboard/user-management/constants";

export const permissionsMock = [
  { role: USER_ROLE.ADMIN, permissions: { manageShipments: true, trackVehicles: true } },
  { role: USER_ROLE.DRIVER, permissions: { manageShipments: false, trackVehicles: true } },
  { role: USER_ROLE.CUSTOMER, permissions: { manageShipments: false, trackVehicles: false } },
];