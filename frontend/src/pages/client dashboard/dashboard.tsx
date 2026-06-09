// src/pages/client dashboard/dashboard.tsx
import { useSelector } from "react-redux";
import { getAuthToken, getUser } from "@/store/authSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { type userLayoutContextType } from "@/layout/client dashboard/types";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PlusCircle,
  User,
  Settings,
  RefreshCw,
  Eye,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Complaint {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  inProgressComplaints: number;
  rejectedComplaints: number;
}

export default function Dashboard() {
  const token = useSelector(getAuthToken);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    inProgressComplaints: 0,
    rejectedComplaints: 0
  });
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { setBreadcrumb } = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(["Dashboard"]);
  }, [setBreadcrumb]);

  const fetchDashboardData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      // Fetch all complaints to calculate stats and get recent ones
      const complaintsRes = await axios.get("http://localhost:8000/api/v1/user/mycomp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const complaints: Complaint[] = complaintsRes.data;
      
      // Calculate stats from the actual complaints data
      const calculatedStats: DashboardStats = {
        totalComplaints: complaints.length,
        pendingComplaints: complaints.filter(c => c.status === 'pending').length,
        resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
        inProgressComplaints: complaints.filter(c => c.status === 'in-progress').length,
        rejectedComplaints: complaints.filter(c => c.status === 'rejected').length
      };
      
      setStats(calculatedStats);
      
      // Get 5 most recent complaints
      const sortedComplaints = complaints.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentComplaints(sortedComplaints.slice(0, 5));
      
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const StatCard = ({ title, value, icon: Icon, color, textColor }: any) => (
    <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-fg1">{title}</p>
          <p className={`text-2xl font-bold mt-2 ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-fg9" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <RefreshCw className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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

  const handleViewComplaint = (complaintId: string) => {
    navigate('/dashboard/mycomplains', { state: { viewComplaint: complaintId } });
  };

  if (!token) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Complaint Desk</h2>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-fg2">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-bl6 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.username || 'User'}! 👋💕
            </h1>
            <p className="text-bl1 text-lg">
              Here's what's happening with your complaints today
            </p>
            <div className="flex items-center space-x-4 mt-4 text-bl1">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Complaint Desk Portal</span>
              </div>
              <div className="w-1 h-1 bg-bl3 rounded-full"></div>
              <span className="text-sm">
                {stats.totalComplaints} Total {stats.totalComplaints === 1 ? 'Complaint' : 'Complaints'}
              </span>
            </div>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-bg1/20 hover:bg-bg1/30 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <div className="bg-white/20 p-4 rounded-full">
              <User className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          icon={FileText}
          color="bg-blue-500"
          textColor="text-fg2"
        />
        <StatCard
          title="Pending"
          value={stats.pendingComplaints}
          icon={Clock}
          color="bg-yellow-500"
          textColor="text-yellow-600"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressComplaints}
          icon={RefreshCw}
          color="bg-blue-500"
          textColor="text-blue-600"
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedComplaints}
          icon={CheckCircle}
          color="bg-green-500"
          textColor="text-green-600"
        />
        <StatCard
          title="Rejected"
          value={stats.rejectedComplaints}
          icon={AlertCircle}
          color="bg-red-500"
          textColor="text-red-600"
        />
      </div>

      {/* Recent Complaints & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Complaints */}
        <div className="lg:col-span-2 bg-bg1 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold ">Recent Complaints</h2>
              <p className="text-sm mt-1">Your 5 most recently updated complaints</p>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span className="text-sm">{recentComplaints.length}</span>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex space-x-4 p-4 border border-bg1 rounded-lg">
                  <div className="rounded-full bg-bg2 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-bg2 rounded w-3/4"></div>
                    <div className="h-3 bg-bg2 rounded w-1/2"></div>
                    <div className="h-3 bg-bg2 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentComplaints.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints yet</h3>
              <p className="text-gray-500 mb-4">Get started by submitting your first complaint</p>
              <button
                onClick={() => navigate('/dashboard/newcomplains')}
                className="bg-bl6 text-white px-6 py-2 rounded-lg hover:bg-bl7 transition-colors"
              >
                Submit First Complaint
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div 
                  key={complaint._id} 
                  className="flex items-center justify-between p-4 border bg-bg2 border-bg0 rounded-lg hover:bg-bg4 transition-all duration-300 group cursor-pointer"
                  onClick={() => handleViewComplaint(complaint._id)}
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`p-3 rounded-full ${
                      complaint.status === 'resolved' ? 'bg-gr5 text-gr6' :
                      complaint.status === 'in-progress' ? 'bg-bl5 text-bl6' :
                      complaint.status === 'pending' ? 'bg-yl1 text-yl6' :
                      'bg-rd1 text-rd6'
                    }`}>
                      {getStatusIcon(complaint.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold truncate">{complaint.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2 mb-2">
                        {complaint.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="capitalize">{complaint.category}</span>
                        <span>•</span>
                        <span>{formatDate(complaint.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      <span className="capitalize">{complaint.status}</span>
                    </span>
                    <Eye className="h-4 w-4 text-fg2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              
              {recentComplaints.length > 0 && (
                <div className="pt-4 border-t border-fg2">
                  <button
                    onClick={() => navigate('/dashboard/mycomplains')}
                    className="w-full text-center text-bl6 hover:text-bl7 font-medium py-2 transition-colors"
                  >
                    View All Complaints →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions & Profile Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-bg1 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-fg2 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/dashboard/newcomplains')}
                className="w-full flex items-center justify-between p-4 border-2 border-dashed bg-bg2 rounded-lg hover:border-bl3 hover:bg-bl1 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-bg3 p-2 rounded-full group-hover:bg-bl2 transition-colors">
                    <PlusCircle className="h-5 w-5 text-bl6" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold  block">New Complaint</span>
                    <span className="text-sm ">Submit a new issue</span>
                  </div>
                </div>
                <div className="text-bl6 transform group-hover:translate-x-1 transition-transform">→</div>
              </button>

              <button 
                onClick={() => navigate('/dashboard/mycomplains')}
                className="w-full flex items-center justify-between p-4 border bg-bg2 border-bg0 rounded-lg hover:bg-gr1 hover:border-gr2 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gr1 p-2 rounded-full group-hover:bg-gr2 transition-colors">
                    <FileText className="h-5 w-5 text-gr6" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">My Complaints</span>
                    <span className="text-sm ">View all complaints</span>
                  </div>
                </div>
                <div className="text-gr6 transform group-hover:translate-x-1 transition-transform">→</div>
              </button>

              <button 
                onClick={() => navigate('/dashboard/settings')}
                className="w-full flex items-center justify-between p-4 border bg-bg2 border-bg0 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-bg2p-2 rounded-full group-hover:bg-purple-200 transition-colors">
                    <Settings className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">Settings</span>
                    <span className="text-sm ">Manage account</span>
                  </div>
                </div>
                <div className="text-purple-600 transform group-hover:translate-x-1 transition-transform">→</div>
              </button>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="bg-bg1 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-bl5 to-purple-500 p-2 rounded-full">
                <User className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Profile Summary</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-bg2 rounded-lg">
                <span className="text-sm">Member since</span>
                <span className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-bg2 rounded-lg">
                <span className="text-sm ">Total complaints</span>
                <span className="font-medium ">{stats.totalComplaints}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-bg2 rounded-lg">
                <span className="text-sm ">Resolved rate</span>
                <span className="font-medium ">
                  {stats.totalComplaints > 0 
                    ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) 
                    : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-bg2 rounded-lg">
                <span className="text-sm ">Active complaints</span>
                <span className="font-medium text-or6">
                  {stats.pendingComplaints + stats.inProgressComplaints}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            {stats.totalComplaints > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-fg2 mb-2">
                  <span>Resolution Progress</span>
                  <span>{stats.resolvedComplaints}/{stats.totalComplaints}</span>
                </div>
                <div className="w-full bg-bg2 rounded-full h-2">
                  <div 
                    className="bg-gr5 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats.totalComplaints > 0 ? (stats.resolvedComplaints / stats.totalComplaints) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Support Card */}
          <div className="bg-gradient-to-r from-bl5 to-bl6 rounded-xl shadow-lg p-6 text-fg0">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm mb-4">
              Our support team is here to assist you with any issues.
            </p>
            <button className="w-full bg-bg0 text-bl6 py-2 px-4 rounded-lg font-medium hover:bg-bl1 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}