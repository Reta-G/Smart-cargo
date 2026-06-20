import React, { useEffect, useMemo, useState } from "react";
import StatsCards from "../../components/dashboard/fleet-managmet/StatsCards";
import VehicleTable from "../../components/dashboard/fleet-managmet/VehicleTable";
import MaintenanceModal from "../../components/dashboard/fleet-managmet/MaintenanceModal";
import { getMaintenanceMock } from "../../mocks/maintenance.mock.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ?? "http://localhost:5000";

const Fleetmanagment = () => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [vehicleError, setVehicleError] = useState("");

  const authToken = () => localStorage.getItem("auth_token");

  const loadVehicles = async () => {
    setLoadingVehicles(true);
    setVehicleError("");

    try {
      const token = authToken();
      const res = await fetch(`${API_BASE}/api/admin/vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.message || "Failed to load vehicles");
      }

      setVehicles(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setVehicleError(err?.message || "Unable to load vehicles");
      setVehicles([]);
    } finally {
      setLoadingVehicles(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleCreateVehicle = async (vehicle) => {
    const token = authToken();
    if (!token) {
      throw new Error("Missing auth token. Please login again.");
    }

    const payload = {
      vehicleNo: vehicle.id,
      type: vehicle.type,
      status: vehicle.status,
      driverName: vehicle.driver === "Unassigned" ? null : vehicle.driver,
      lastSeen: vehicle.lastSeen,
    };

    const res = await fetch(`${API_BASE}/api/admin/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || !json.ok) {
      throw new Error(json.message || "Failed to create vehicle");
    }

    setVehicles((prev) => [json.data, ...(prev || [])]);
  };

  const maintenance = useMemo(() => {
    return getMaintenanceMock(selectedVehicle);
  }, [selectedVehicle]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors duration-300 dark:bg-slate-900">
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">
        Fleet Management
      </h1>

      <StatsCards vehicles={vehicles} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VehicleTable
            vehicles={vehicles}
            onCreateVehicle={handleCreateVehicle}
            onMaintenanceClick={(id) => setSelectedVehicle(id)}
          />
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <MaintenanceModal
              vehicleId={selectedVehicle}
              onClose={() => setSelectedVehicle(null)}
              inline
              logs={maintenance.logs}
              activities={maintenance.activities}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Fleetmanagment;