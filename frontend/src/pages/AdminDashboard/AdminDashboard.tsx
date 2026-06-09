// src/pages/AdminDashboard/AdminDashboard.tsx
import { useSelector } from "react-redux";
import { getAuthAdminToken } from "@/store/authAdminSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  RefreshCw,
  Shield,
  UserCheck,
  BarChart3,
  ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  rejectedComplaints: number;
  adminsCount: number;
}

interface RecentComplaint {
  _id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'support';
  createdAt: string;
  complaintCount: number;
}

export default function AdminDashboard() {
  const token = useSelector(getAuthAdminToken);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    rejectedComplaints: 0,
    adminsCount: 0
  });
  const [recentComplaints, setRecentComplaints] = useState<RecentComplaint[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    if (!token) {
      setError("You must log in first");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const usersRes = await axios.get("http://localhost:8000/api/v1/admin/users/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const complaintsRes = await axios.get("http://localhost:8000/api/v1/admin/complaints/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const complaints = complaintsRes.data;
      const users = await fetchRecentUsers();

      const complaintStats = {
        total: complaints.length,
        pending: complaints.filter((c: any) => c.status === 'pending').length,
        inProgress: complaints.filter((c: any) => c.status === 'in-progress').length,
        resolved: complaints.filter((c: any) => c.status === 'resolved').length,
        rejected: complaints.filter((c: any) => c.status === 'rejected').length
      };

      const recentComplaintsData = complaints
        .slice(0, 5)
        .map((complaint: any) => ({
          _id: complaint._id,
          title: complaint.title,
          status: complaint.status,
          priority: complaint.priority,
          createdAt: complaint.createdAt,
          user: complaint.user
        }));

      setStats({
        totalUsers: usersRes.data.total,
        activeUsers: usersRes.data.active,
        inactiveUsers: usersRes.data.inactive,
        totalComplaints: complaintStats.total,
        pendingComplaints: complaintStats.pending,
        inProgressComplaints: complaintStats.inProgress,
        resolvedComplaints: complaintStats.resolved,
        rejectedComplaints: complaintStats.rejected,
        adminsCount: usersRes.data.admins
      });

      setRecentComplaints(recentComplaintsData);
      setRecentUsers(users.slice(0, 5));

    } catch (err: any) {
      console.error("Dashboard data error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUsers = async (): Promise<RecentUser[]> => {
    if (!token) return [];
    try {
      const res = await axios.get("http://localhost:8000/api/v1/admin/users/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.slice(0, 10);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      return [];
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend, 
    description 
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    color: string; 
    trend?: string; 
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
          {trend && (
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color} flex-shrink-0 ml-3`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'rejected': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'high': return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'low': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'support': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg1 px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <p className="text-fg1-1">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg1 px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-fg2-5">Admin Dashboard</h1>
            <p className="text-fg1-1 mt-1 sm:mt-2">Welcome to your administration panel</p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="flex items-center space-x-2 bodyBtnStyle px-4 py-2 rounded-lg font-medium shadow hover:bg-fg2-6 disabled:bg-gray-400 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="bg-blue-500"
            description="Registered users"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={UserCheck}
            color="bg-green-500"
            description="Currently active"
          />
          <StatCard
            title="Total Complaints"
            value={stats.totalComplaints}
            icon={FileText}
            color="bg-orange-500"
            description="All time complaints"
          />
          <StatCard
            title="Admin Users"
            value={stats.adminsCount}
            icon={Shield}
            color="bg-purple-500"
            description="Administrative accounts"
          />
        </div>

        {/* Complaint Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Pending"
            value={stats.pendingComplaints}
            icon={Clock}
            color="bg-yellow-500"
            description="Awaiting action"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgressComplaints}
            icon={BarChart3}
            color="bg-blue-500"
            description="Being processed"
          />
          <StatCard
            title="Resolved"
            value={stats.resolvedComplaints}
            icon={CheckCircle}
            color="bg-green-500"
            description="Successfully closed"
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedComplaints}
            icon={AlertCircle}
            color="bg-red-500"
            description="Not accepted"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Complaints */}
          <div className="bg-bg2 rounded-xl shadow-lg p-4 sm:p-6 border border-bg4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-fg2-5">Recent Complaints</h2>
              <Link 
                to="/admin/complaints" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center"
              >
                <span className="hidden sm:inline">View All</span>
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {recentComplaints.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                  <p className="text-fg1-1 text-sm">No complaints yet</p>
                </div>
              ) : (
                recentComplaints.map((complaint) => (
                  <div key={complaint._id} className="flex items-center justify-between p-3 sm:p-4 border border-bg4 rounded-lg hover:bg-bg3 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-1 sm:mb-2">
                        <h3 className="font-medium text-fg2-5 text-sm line-clamp-1 truncate">
                          {complaint.title}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(complaint.priority)} mt-1 sm:mt-0 flex-shrink-0`}>
                          {complaint.priority}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-fg1-1 space-y-1 sm:space-y-0">
                        <span className="truncate">{complaint.user.name}</span>
                        <span className="flex-shrink-0">{formatDate(complaint.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ml-2 sm:ml-3 flex-shrink-0 ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-bg2 rounded-xl shadow-lg p-4 sm:p-6 border border-bg4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-fg2-5">Recent Users</h2>
              <Link 
                to="/admin/users" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center"
              >
                <span className="hidden sm:inline">View All</span>
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {recentUsers.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                  <p className="text-fg1-1 text-sm">No users yet</p>
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 sm:p-4 border border-bg4 rounded-lg hover:bg-bg3 transition-colors">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <div className="bg-blue-100 dark:bg-blue-900 p-1 sm:p-2 rounded-full flex-shrink-0">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-fg2-5 text-sm truncate">{user.name}</h3>
                        <p className="text-xs text-fg1-1 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(user.role)} hidden xs:inline-block`}>
                        {user.role}
                      </span>
                      <span className="text-xs text-fg1-1 whitespace-nowrap">
                        {user.complaintCount} complaints
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-bg2 rounded-xl shadow-lg p-4 sm:p-6 border border-bg4">
          <h2 className="text-lg sm:text-xl font-bold text-fg2-5 mb-4 sm:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link
              to="/admin/complaints"
              className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-bg4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-200 dark:hover:border-blue-700 transition-colors group"
            >
              <div className="bg-blue-100 dark:bg-blue-800 p-2 sm:p-3 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-700 transition-colors flex-shrink-0">
                <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-fg2-5 text-sm sm:text-base">Manage Complaints</h3>
                <p className="text-xs sm:text-sm text-fg1-1 line-clamp-2">View and process all complaints</p>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-bg4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 hover:border-green-200 dark:hover:border-green-700 transition-colors group"
            >
              <div className="bg-green-100 dark:bg-green-800 p-2 sm:p-3 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-700 transition-colors flex-shrink-0">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-fg2-5 text-sm sm:text-base">Manage Users</h3>
                <p className="text-xs sm:text-sm text-fg1-1 line-clamp-2">View and manage user accounts</p>
              </div>
            </Link>

            <Link
              to="/admin/complaints"
              className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-bg4 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900 hover:border-orange-200 dark:hover:border-orange-700 transition-colors group"
            >
              <div className="bg-orange-100 dark:bg-orange-800 p-2 sm:p-3 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-700 transition-colors flex-shrink-0">
                <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-fg2-5 text-sm sm:text-base">View Reports</h3>
                <p className="text-xs sm:text-sm text-fg1-1 line-clamp-2">Analytics and insights</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}