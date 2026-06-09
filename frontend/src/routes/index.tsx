// src/Router.tsx
import { useRoutes } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import ClientDashboard from "@/layout/client dashboard/index";
import AdDashboard from "@/layout/admin dashboard";
import { lazy } from "react";
import { AdminProtectedRoute } from "@/routes/ProtectedRoutes";

// Pages
const HomePage = lazy(() => import("@/pages/home"));
const ContactPage = lazy(() => import("@/pages/contact"));
const AboutPage = lazy(() => import("@/pages/about"));
const Complain = lazy(() => import("@/pages/complain"));

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard/AdminDashboard"));
const AdminComplaints = lazy(() => import("@/pages/AdminDashboard/AdminComplaints"));
const AdminUsers = lazy(() => import("@/pages/AdminDashboard/AdminUsers"));
const AdminNotifications = lazy(() => import("@/pages/AdminDashboard/AdminNotifications"));
const AdminReports = lazy(() => import("@/pages/AdminDashboard/AdminReports"));
const AdminSettings = lazy(() => import("@/pages/AdminDashboard/AdminSettings"));

// User dashboard pages
const Dashboard = lazy(() => import("@/pages/client dashboard/dashboard"));
const MyComplains = lazy(() => import("@/pages/client dashboard/myComplains"));
const NewComplain = lazy(() => import("@/pages/client dashboard/newComplain"));
const Notifications = lazy(() => import("@/pages/client dashboard/notifications"));
const Settings = lazy(() => import("@/pages/client dashboard/settings"));
const Profile = lazy(() => import("@/pages/client dashboard/Profile"));

const Router = () => {
  const routes = [
    // Public Routes
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "complains", element: <Complain /> },
        { path: "about", element: <AboutPage /> },
        { path: "contact", element: <ContactPage /> },
      ],
    },

    // ✅ Admin Protected Routes
    {
      path: "/admin_dashboard",
      element: (
        <AdminProtectedRoute>
          <AdDashboard />
        </AdminProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "complaints", element: <AdminComplaints /> },
        { path: "users", element: <AdminUsers /> },
        { path: "notifications", element: <AdminNotifications /> },
        { path: "reports", element: <AdminReports /> },
        { path: "settings", element: <AdminSettings /> },
      ],
    },

    // ✅ User Protected Routes
    {
      path: "/dashboard",
      element: (
        
          <ClientDashboard />
        
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "newcomplains", element: <NewComplain /> },
        { path: "mycomplains", element: <MyComplains /> },
        { path: "profile", element: <Profile /> },
        { path: "notifications", element: <Notifications /> },
        { path: "settings", element: <Settings /> },
      ],
    },
  ];

  return useRoutes(routes);
};

export default Router;
