// src/layout/adminDashboard/components/AdminSidebar.tsx
import { 
  LayoutDashboard, 
  MessageCircle, 
  Users, 
  Bell, 
  Settings,
  LogOut,
  BarChart3,
  Shield
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  isOpen: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen, 
  activeSection, 
  setActiveSection 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      path: "/admin_dashboard" 
    },
    { 
      id: "all-complaints", 
      label: "All Complaints", 
      icon: MessageCircle, 
      path: "/admin_dashboard/complaints" 
    },
    { 
      id: "manage-users", 
      label: "Manage Users", 
      icon: Users, 
      path: "/admin_dashboard/users" 
    },
    { 
      id: "notifications", 
      label: "Send Notifications", 
      icon: Bell, 
      path: "/admin_dashboard/notifications" 
    },
    { 
      id: "reports", 
      label: "Reports", 
      icon: BarChart3, 
      path: "/admin_dashboard/reports" 
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings, 
      path: "/admin_dashboard/settings" 
    },
  ];

  const handleNavigation = (path: string, id: string) => {
    setActiveSection(id);
    navigate(path);
  };

  return (
    <div className={`h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          {isOpen && (
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                Complaint Desk
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.path, item.id)}
                  className={`w-full flex items-center rounded-lg transition-all duration-200 group relative ${
                    isOpen ? 'px-3 py-2.5 space-x-3' : 'p-2.5 justify-center'
                  } ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className={`flex-shrink-0 ${
                    isOpen ? 'w-5 h-5' : 'w-4 h-4'
                  }`} />
                  
                  {isOpen && (
                    <span className="font-medium text-sm truncate transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                      {item.label}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <button 
          className={`w-full flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white group relative ${
            isOpen ? 'px-3 py-2.5 space-x-3' : 'p-2.5 justify-center'
          }`}
          title={!isOpen ? "Logout" : undefined}
        >
          <LogOut className={`flex-shrink-0 ${
            isOpen ? 'w-5 h-5' : 'w-4 h-4'
          }`} />
          
          {isOpen && (
            <span className="font-medium text-sm truncate transition-opacity duration-200">
              Logout
            </span>
          )}
          
          {/* Tooltip for collapsed state */}
          {!isOpen && (
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
              Logout
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;