import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  Shield,
  LogOut,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import UserSidebarNav from "./userSidebarNav";
import profileImage from "@/assets/pirate.jpg";
import { useAppSelector } from "@/store/hooks";
import { Link } from "react-router-dom";
import { getAdmin } from "@/store/authAdminSlice"; // 👈 import admin selector

type AdminSidebarProps = {
  logoutHandle: () => void;
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ logoutHandle }) => {
  const { isMobile } = useSidebar();
  const admin = useAppSelector(getAdmin); // 👈 get admin details from Redux

  return (
    <Sidebar collapsible="icon" className="min-w-[50px]">
      {/* Header */}
      <SidebarHeader className="bg-bg2 themeShift h-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              to="/"
              className="flex items-center space-x-1 sm:space-x-2 flex-1 md:flex-none justify-center md:justify-start min-w-0 h-16"
            >
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent truncate">
                ComplainDesk
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-bg1 themeShift">
        <UserSidebarNav />
      </SidebarContent>

      {/* Footer / Profile */}
      <SidebarFooter className="bg-bg2 themeShift">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={profileImage} alt="profile" />
                    <AvatarFallback className="rounded-lg">A</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{admin?.username}</span>
                    <span className="truncate text-xs">{admin?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={profileImage} alt="profile" />
                      <AvatarFallback className="rounded-lg">A</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{admin?.username}</span>
                      <span className="truncate text-xs">{admin?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to="/admin/profile">
                    <DropdownMenuItem>
                      <User />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/admin/settings">
                    <DropdownMenuItem>
                      <CreditCard />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/admin/notifications">
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandle}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;
