import {
  Home,
  Settings,
  MessageCircle,
  Users,
  Bell,
  BarChart3,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    url: "/admin_dashboard",
    icon: Home,
  },
  {
    title: "Complsints",
    url: "/admin_dashboard/complaints",
    icon: MessageCircle,
  },
  {
    title: "Users",
    url: "/admin_dashboard/users",
    icon: Users,
  },
  // {
  //   title: "Notification",
  //   url: "/admin_dashboard/notifications",
  //   icon: Bell,
  // },
  {
    title: "Reports",
    url: "/admin_dashboard/reports",
    icon: BarChart3,
  },
  // {
  //   title: "Settings",
  //   url: "/admin_dashboard/settings",
  //   icon: Settings,
  // },
];

const UserSidebarNav = () => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-2xl font-bold">Admin Dashboard</SidebarGroupLabel>
      <SidebarGroupContent >
        <SidebarMenu>
  {items.map((item) => {
    const isActive = location.pathname === item.url;
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <Link
            to={item.url}
            className={cn(
              "flex items-center gap-4 px-4 py-3 my-2 rounded-xl text-lg font-medium transition-all duration-300",
              "hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-300",
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300"
            )}
          >
            <item.icon
              className={cn(
                "h-6 w-6 transition-colors",
                isActive ? "text-white" : "text-gray-500"
              )}
            />
            <span className="truncate">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  })}
</SidebarMenu>

      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default UserSidebarNav;
