import { Shield, Truck, Users } from "lucide-react";

// Backend-ready role codes
export const USER_ROLE = {
  ADMIN: "ADMIN",
  DRIVER: "DRIVER",
  CUSTOMER: "CUSTOMER",
};

export const USER_ROLE_LABELS = {
  [USER_ROLE.ADMIN]: "Admin",
  [USER_ROLE.DRIVER]: "Driver",
  [USER_ROLE.CUSTOMER]: "Customer",
};

export const USER_ROLES = ["All", USER_ROLE.ADMIN, USER_ROLE.DRIVER, USER_ROLE.CUSTOMER];

// Backend-ready status codes
export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: "Active",
  [USER_STATUS.INACTIVE]: "Inactive",
};

// ✅ IMPORTANT: No JSX here. We store Icon COMPONENTS, not <Icon />
export const ROLE_CONFIG = {
  [USER_ROLE.ADMIN]: {
    Icon: Shield,
    iconBg: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300",
    badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  },
  [USER_ROLE.DRIVER]: {
    Icon: Truck,
    iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  },
  [USER_ROLE.CUSTOMER]: {
    Icon: Users,
    iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
  },
};