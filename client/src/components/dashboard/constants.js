export const DAILY_DELIVERIES = [
  { name: "Mon", value: 24 },
  { name: "Tue", value: 30 },
  { name: "Wed", value: 28 },
  { name: "Thu", value: 35 },
  { name: "Fri", value: 40 },
  { name: "Sat", value: 22 },
  { name: "Sun", value: 18 },
];

export const REVENUE_VS_COST = [
  { name: "Jan", revenue: 4000, cost: 2400 },
  { name: "Feb", revenue: 3000, cost: 2200 },
  { name: "Mar", revenue: 5000, cost: 2800 },
  { name: "Apr", revenue: 4780, cost: 2600 },
  { name: "May", revenue: 5890, cost: 3000 },
];

export const FUEL_CONSUMPTION = [
  { name: "Truck 1", value: 120 },
  { name: "Truck 2", value: 98 },
  { name: "Truck 3", value: 110 },
  { name: "Truck 4", value: 90 },
];

import React from "react";
import { Users, Truck, User, Settings } from "lucide-react";

export const ROLE_CONFIG = {
  Dispatcher: {
    total: 8,
    icon: React.createElement(User, { className: "w-6 h-6 text-blue-500" }),
    iconBg: "bg-blue-50",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  Driver: {
    total: 16,
    icon: React.createElement(Truck, { className: "w-6 h-6 text-green-500" }),
    iconBg: "bg-green-50",
    badgeColor: "bg-green-100 text-green-700",
  },
  Customer: {
    total: 163,
    icon: React.createElement(Users, { className: "w-6 h-6 text-indigo-500" }),
    iconBg: "bg-indigo-50",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  Admin: {
    total: 2,
    icon: React.createElement(Settings, { className: "w-6 h-6 text-red-500" }),
    iconBg: "bg-red-50",
    badgeColor: "bg-red-100 text-red-700",
  },
};

export const USER_ROLES = ["All", ...Object.keys(ROLE_CONFIG)];
