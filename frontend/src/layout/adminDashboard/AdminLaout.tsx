// src/layout/adminDashboard/AdminLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/layout/adminDashboard/AdminSideBarNav";
import AdminHeader from "@/layout/adminDashboard/AdminHeader";
import AdminFooter from "@/layout/adminDashboard/AdminFoooter";

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar - Now handles its own width internally */}
      <AdminSidebar 
        isOpen={isSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;