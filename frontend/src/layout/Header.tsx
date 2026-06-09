import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Shield, BookOpen, Info, Menu, Sun, Moon, LogIn, Crown } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useSelector } from "react-redux";
import { toggleDarkMode, selectDarkMode } from "@/store/darkModeSlice";
import { getUser, logout } from "@/store/authSlice";
import { getAdmin, adminLogout } from "@/store/authAdminSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface HeaderProps {
  openLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ openLogin }) => {
  const isDarkMode = useSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ use selectors instead of state.auth.user / state.auth_admin.admin
  const user = useAppSelector(getUser);
  const admin = useAppSelector(getAdmin);

  // unified check
  const isLoggedIn = !!user || !!admin;
  const currentUser = user || admin;
  const isAdmin = !!admin;

  const [showDropdown, setShowDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLButtonElement | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { name: "Home", to: "/", icon: Home },
    { name: "Complains", to: "/complains", icon: Shield },
    { name: "About", to: "/about", icon: BookOpen },
    { name: "Contact", to: "/contact", icon: Info },
  ];

  const handleLogout = () => {
    if (user) dispatch(logout());
    if (admin) dispatch(adminLogout());
    setShowDropdown(false);
    navigate("/");
  };

  const goToDashboard = () => {
    setShowDropdown(false);
    if (isAdmin) {
      navigate("/admin_dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const renderAuthSection = () => {
    if (!isClient) {
      return <div className="w-20 h-9 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>;
    }

    if (isLoggedIn) {
      return (
        <div className="relative">
          <button
            ref={avatarRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition relative"
          >
            {currentUser?.username?.charAt(0).toUpperCase() || "U"}
            {isAdmin && (
              <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 fill-yellow-400" />
            )}
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={openLogin}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
      >
        <LogIn className="w-4 h-4" />
        <span>Login</span>
      </button>
    );
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 transition-all">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="p-[6px] rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-white dark:bg-gray-900">
                  <SheetHeader>
                    <VisuallyHidden>
                      <SheetTitle>Navigation</SheetTitle>
                      <SheetDescription>Site navigation</SheetDescription>
                    </VisuallyHidden>
                  </SheetHeader>
                  <div className="mt-4 pb-4 space-y-3 flex flex-col ml-4">
                    {navLinks.map(({ name, to, icon: Icon }) => (
                      <SheetClose asChild key={name}>
                        <Link
                          to={to}
                          className={`group flex items-center space-x-3 ${
                            to === location.pathname
                              ? "text-blue-600 font-semibold"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{name}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-1 sm:space-x-2 flex-1 md:flex-none justify-center md:justify-start min-w-0 h-16"
            >
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent truncate">
                ComplainDesk
              </span>
            </Link>
            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-4">
              {navLinks.map(({ name, to, icon: Icon }) => (
                <Link
                  key={name}
                  to={to}
                  className={`flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 ${
                    to === location.pathname
                      ? "text-blue-600 font-semibold"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{name}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {renderAuthSection()}
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dropdown */}
      {showDropdown && isLoggedIn && (
        <div
          ref={dropdownRef}
          className="absolute right-4 top-16 z-50 bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md w-64"
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium">{currentUser?.username || "User"}</p>
            {isAdmin && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full inline-flex items-center gap-1">
                <Crown className="w-3 h-3" /> Admin
              </span>
            )}
            <p className="text-xs text-gray-500">{currentUser?.email || ""}</p>
          </div>
          <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
            Profile
          </button>
          <button
            onClick={goToDashboard}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Dashboard
          </button>
          <hr />
          <button
            onClick={handleLogout}
            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
