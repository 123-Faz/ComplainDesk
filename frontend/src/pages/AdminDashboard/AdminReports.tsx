// src/pages/AdminDashboard/AdminReports.tsx
import { useSelector } from "react-redux";
import { getAuthAdminToken } from "@/store/authAdminSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Download,
  RefreshCw,
  FileText,
  Users,
  AlertCircle,
  BarChart3,
  Calendar,
  X,
  CheckCircle
} from "lucide-react";
interface ReportData {
  type: string;
  period: {
    startDate: string;
    endDate: string;
  };
  summary: any;
  users?: any[];
  complaints?: any[];
  generatedAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalComplaints: number;
  resolvedComplaints: number;
  recentUsers: number;
  recentComplaints: number;
  resolutionRate: string;
}

export default function AdminReports() {
  const token = useSelector(getAuthAdminToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [reportType, setReportType] = useState<"users" | "complaints">("users");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, [token]);

  const fetchDashboardStats = async () => {
    if (!token) {
      setError("You must log in first");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/admin/reports/dashboard-stats",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setDashboardStats(res.data.stats);
      } else {
        throw new Error(res.data.message || "Failed to fetch dashboard stats");
      }
    } catch (err: any) {
      console.error(
        "Fetch dashboard stats error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || "Failed to fetch dashboard statistics"
      );
    }
  };

  const generateReport = async () => {
    if (!token) {
      setError("You must log in first");
      return;
    }

    if (!reportType) {
      setError("Please select a report type");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const requestData: any = { reportType };
      if (startDate) requestData.startDate = startDate;
      if (endDate) requestData.endDate = endDate;

      const res = await axios.post(
        "http://localhost:8000/api/v1/admin/reports/generate",
        requestData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setReportData(res.data.report);
      } else {
        throw new Error(res.data.message || "Failed to generate report");
      }
    } catch (err: any) {
      console.error(
        "Generate report error:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!reportData) return;

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${reportData.type}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!reportData) return;

    let csvContent = "";
    const headers: string[] = [];
    const rows: string[][] = [];

    if (reportData.type === "users" && reportData.users) {
      headers.push(
        "Name",
        "Email",
        "Username",
        "Role",
        "Status",
        "Created Date"
      );

      reportData.users.forEach((user) => {
        rows.push([
          user.name || "",
          user.email || "",
          user.username || "",
          user.role || "",
          user.status ? "Active" : "Inactive",
          new Date(user.createdAt).toLocaleDateString(),
        ]);
      });
    } else if (reportData.type === "complaints" && reportData.complaints) {
      headers.push(
        "Title",
        "User",
        "Status",
        "Priority",
        "Created Date",
        "Description"
      );

      reportData.complaints.forEach((complaint) => {
        rows.push([
          complaint.title || "",
          complaint.user?.name || "Unknown",
          complaint.status || "",
          complaint.priority || "",
          new Date(complaint.createdAt).toLocaleDateString(),
          complaint.description ? complaint.description.substring(0, 100) : "",
        ]);
      });
    }

    if (headers.length === 0) {
      alert("No data to export");
      return;
    }

    csvContent = headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.map((field) => `"${field}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${reportData.type}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearReport = () => {
    setReportData(null);
    setError("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "resolved":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "in-progress":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "inactive":
      case "rejected":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "high":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "low":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      case "support":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    description 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    color: string; 
    description?: string;
  }) => (
    <div className="bg-bg2 rounded-xl shadow-lg p-4 sm:p-6 border border-bg4 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-fg1-1 mb-1 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-fg2-5 mb-2">{value}</p>
          {description && (
            <p className="text-xs text-fg1-1 truncate">{description}</p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color} flex-shrink-0 ml-3`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg1 px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-fg2-5">
              Reports & Analytics
            </h1>
            <p className="text-fg1-1 mt-1 sm:mt-2">
              Generate detailed reports and view system analytics
            </p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button
              onClick={fetchDashboardStats}
              className="flex items-center space-x-2 bodyBtnStyle px-4 py-2 rounded-lg font-medium shadow hover:bg-fg2-6 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh Stats</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded-lg">
            <p className="text-red-800 dark:text-red-200 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {error}
            </p>
          </div>
        )}

        {/* Dashboard Stats */}
        {dashboardStats && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Users"
              value={dashboardStats.totalUsers}
              description={`${dashboardStats.recentUsers} new this week`}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              title="Total Complaints"
              value={dashboardStats.totalComplaints}
              description={`${dashboardStats.recentComplaints} new this week`}
              icon={AlertCircle}
              color="bg-orange-500"
            />
            <StatCard
              title="Resolved"
              value={dashboardStats.resolvedComplaints}
              description="Complaints resolved"
              icon={CheckCircle}
              color="bg-green-500"
            />
            <StatCard
              title="Resolution Rate"
              value={`${dashboardStats.resolutionRate}%`}
              description="Overall success rate"
              icon={BarChart3}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Report Generator */}
        <div className="bg-bg2 rounded-xl shadow-lg p-4 sm:p-6 border border-bg4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-fg2-5">Generate Report</h2>
            <div className="flex items-center space-x-2 text-fg1-1">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Custom Reports</span>
            </div>
          </div>

          {/* Report Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Report Type */}
            <div className="lg:col-span-1">
              <label className="text-sm font-medium text-fg1-2 mb-2 block">
                Report Type
              </label>
              <div className="flex space-x-3 sm:space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="users"
                    checked={reportType === "users"}
                    onChange={(e) => setReportType(e.target.value as "users")}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-fg1-2">User Report</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="complaints"
                    checked={reportType === "complaints"}
                    onChange={(e) =>
                      setReportType(e.target.value as "complaints")
                    }
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-fg1-2">Complaint Report</span>
                </label>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium text-fg1-2 mb-2 block">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-fg1-2 mb-2 block">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2"
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full bodyBtnStyle px-4 sm:px-6 py-2 rounded-lg font-medium shadow hover:bg-fg2-6 disabled:bg-gray-400 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm sm:text-base">Generating...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span className="text-sm sm:text-base">Generate Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Report Results */}
        {reportData && (
          <div className="bg-bg2 rounded-xl shadow-lg overflow-hidden border border-bg4">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">
                    {reportData.type === "users"
                      ? "User Report"
                      : "Complaint Report"}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Period: {reportData.period.startDate} to{" "}
                    {reportData.period.endDate}
                  </p>
                  <p className="text-blue-100 text-xs sm:text-sm">
                    Generated: {new Date(reportData.generatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2 sm:space-x-3 mt-4 lg:mt-0">
                  <button
                    onClick={downloadCSV}
                    className="flex items-center space-x-1 sm:space-x-2 bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Download CSV</span>
                  </button>
                  <button
                    onClick={downloadJSON}
                    className="flex items-center space-x-1 sm:space-x-2 bg-white text-blue-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Download JSON</span>
                  </button>
                  <button
                    onClick={clearReport}
                    className="flex items-center space-x-1 sm:space-x-2 bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="p-4 sm:p-6 border-b border-bg4">
              <h3 className="text-lg font-semibold text-fg2-5 mb-4">
                Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(reportData.summary).map(([key, value]) => (
                  <div key={key} className="bg-bg3 p-3 sm:p-4 rounded-lg border border-bg4">
                    <div className="text-xs sm:text-sm text-fg1-1 capitalize font-medium truncate">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="font-semibold text-base sm:text-lg text-fg2-5 mt-1">
                      {typeof value === "number"
                        ? value.toLocaleString()
                        : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-fg2-5 mb-4">
                {reportData.type === "users" ? "Users" : "Complaints"} (
                {reportData.users?.length || reportData.complaints?.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg3 border-b border-bg4">
                    <tr>
                      {reportData.type === "users" ? (
                        <>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden sm:table-cell">
                            Contact
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden md:table-cell">
                            Status
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden lg:table-cell">
                            Created
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden sm:table-cell">
                            User
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden md:table-cell">
                            Priority
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden lg:table-cell">
                            Created
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-bg2 divide-y divide-bg4">
                    {reportData.type === "users"
                      ? reportData.users?.map((user: any) => (
                          <tr
                            key={user._id}
                            className="hover:bg-bg3 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full flex-shrink-0">
                                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-medium text-fg2-5 text-sm truncate">
                                    {user.name}
                                  </h3>
                                  <p className="text-sm text-fg1-1 truncate">
                                    @{user.username}
                                  </p>
                                  <p className="text-xs text-fg1-1 sm:hidden truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                              <p className="text-sm text-fg2-5 truncate">
                                {user.email}
                              </p>
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(
                                  user.role
                                )}`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                                  user.status
                                )}`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-fg1-1 hidden lg:table-cell">
                              {formatDate(user.createdAt)}
                            </td>
                          </tr>
                        ))
                      : reportData.complaints?.map((complaint: any) => (
                          <tr
                            key={complaint._id}
                            className="hover:bg-bg3 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-4">
                              <div className="max-w-xs">
                                <h3 className="font-medium text-fg2-5 text-sm truncate">
                                  {complaint.title}
                                </h3>
                                <p className="text-sm text-fg1-1 truncate">
                                  {complaint.description?.substring(0, 60)}...
                                </p>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                              <p className="text-sm text-fg2-5">
                                {complaint.user?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-fg1-1">
                                {complaint.user?.email || ""}
                              </p>
                            </td>
                            <td className="px-4 sm:px-6 py-4">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                                  complaint.status
                                )}`}
                              >
                                {complaint.status}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
                                  complaint.priority
                                )}`}
                              >
                                {complaint.priority}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-fg1-1 hidden lg:table-cell">
                              {formatDate(complaint.createdAt)}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}