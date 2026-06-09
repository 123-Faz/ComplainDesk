import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserSidebar from "./userSideBar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectDarkMode, toggleDarkMode } from "@/store/darkModeSlice";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import type { userLayoutContextType } from "./types";
import ShowToast from "@/components/ShowToast";
import { logout } from "@/store/authSlice";
import { domAnimation, LazyMotion } from "framer-motion";
import React from "react";

const UserLayout = () => {
  const darkmode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["Dashboard"]);
  const context: userLayoutContextType = { setBreadcrumb };

  const logoutAction = () => {
    try {
      localStorage.setItem("loggingOut", "true");
      localStorage.setItem("showLoginAfterLogout", "true");
      dispatch(logout());
      navigate("/");

      // ❌ wrong: direct ShowToast call during render cycle
      // ShowToast({ ... })

      // ✅ fix: defer it so React isn’t in the middle of render
      setTimeout(() => {
        ShowToast({
          message: "Logged Out Successfully",
          type: "success",
          status: 200,
          toastId: "logout-toast",
        });
      }, 0);
    } catch (error: any) {
      setTimeout(() => {
        ShowToast({
          message: "Something Went Wrong",
          type: "error",
          status: error.response?.status,
          toastId: "logout-toast",
        });
      }, 0);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <SidebarProvider>
        <UserSidebar logoutHandle={logoutAction} />
        <SidebarInset className="bg-bg2 themeShift">
          {/* Header */}
          <header className="flex h-16 bg-bg1 shrink-0 pr-8 items-center justify-between gap-2 border-b themeShift">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 themeShift" />
              <Separator orientation="vertical" className="mr-2 h-4" />

              {/* Breadcrumb */}
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {index === breadcrumb.length - 1 ? (
                          <BreadcrumbPage className="text-[16px] themeShift">
                            {item}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to="/dashboard" className="themeShift">
                              {item}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumb.length - 1 && (
                        <BreadcrumbSeparator>
                          <span className="mx-2 text-gray-400">/</span>
                        </BreadcrumbSeparator>
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Dark mode toggle */}
            <Button
              variant="outline"
              onClick={() => dispatch(toggleDarkMode())}
              className="headerBtns cpBtnStyle p-[7px]"
            >
              {darkmode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </Button>
          </header>

          {/* Content */}
          <Outlet context={context} />
        </SidebarInset>
      </SidebarProvider>
    </LazyMotion>
  );
};

export default UserLayout;
