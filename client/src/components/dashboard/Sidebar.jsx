import React, { useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Package,
  Users,
  Settings,
  Mail,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import LogoutModal from "../LogoutModal";
import { useAuth } from "../../AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Truck, label: "Fleet Management", path: "/dashboard/fleet-management" },
  { icon: Package, label: "Shipments & Orders", path: "/dashboard/shipments-orders" },
  { icon: Users, label: "User Management", path: "/dashboard/user-management" },
  { icon: Settings, label: "System Settings", path: "/dashboard/system-settings" },
  { icon: Mail, label: "Messages", path: "/dashboard/messages" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleConfirmLogout = () => {
    logout();                 // clears localStorage + auth state
    setIsLogoutOpen(false);   // close modal
    setMobileOpen(false);     // close sidebar on mobile
    navigate("/");            // go to home
  };

  const sidebarContent = (
    <div
      className={`min-h-screen flex flex-col bg-[#1e3a8a] text-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } lg:w-auto`}
    >
      {/* Logo / Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/50">
        <div className="flex items-center gap-2">
          <Truck className="w-8 h-8 text-blue-300" />
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight">
              <Link to="/">SmartCargo</Link>
            </span>
          )}
        </div>

        <button className="lg:hidden" onClick={() => setMobileOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Collapse toggle desktop */}
      <div className="hidden lg:flex justify-end px-4 py-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-blue-200 hover:text-white"
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-blue-100 hover:bg-blue-800/50 hover:text-white"
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            <item.icon className="w-5 h-5" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-blue-900/50">
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-3 text-blue-100 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden p-2">
        <button onClick={() => setMobileOpen(true)} className="text-blue-700">
          <Menu size={28} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{sidebarContent}</div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="bg-black/30 w-full"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;