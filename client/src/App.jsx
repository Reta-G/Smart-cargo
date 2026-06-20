import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import About from "./pages/About";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Fleetmanagment from "./pages/dashboard/Fleetmanagment";
import Shipments from "./pages/dashboard/Shipments";
import UserManagement from "./pages/dashboard/UserManagement";
import SystemSettings from "./pages/dashboard/SystemSettings";
import Messages from "./pages/dashboard/Messages";


import UserDashboard from "./pages/user/UserDashboard";
import MyShipments from "./pages/user/MyShipments";
import ShipmentDetails from "./pages/user/ShipmentDetails";
import DriverDashboard from "./pages/driver/DriverDashboard";

import RequireAdmin from "./guards/RequireAdmin";
import RequireDriver from "./guards/RequireDriver";
import RequireCustomer from "./guards/RequireCustomer";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/driver-login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* Customer Protected Routes */}
        <Route element={<RequireCustomer />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/my-shipments" element={<MyShipments />} />
          <Route path="/my-shipments/:id" element={<ShipmentDetails />} /> {/* ✅ NEW */}
        </Route>

        {/* Driver Protected Routes */}
        <Route element={<RequireDriver />}>
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<RequireAdmin />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="fleet-management" element={<Fleetmanagment />} />
            <Route path="shipments-orders" element={<Shipments />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="system-settings" element={<SystemSettings />} />
            <Route path="messages" element={<Messages />} />
            
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;