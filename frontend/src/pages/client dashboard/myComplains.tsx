// src/pages/client dashboard/myComplains.tsx
import { useSelector } from "react-redux";
import { getAuthToken } from "@/store/authSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { type userLayoutContextType } from "@/layout/client dashboard/types";
import { 
  Search, 
  Download, 
  Eye, 
  X,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  FileText
} from "lucide-react";

interface Complaint {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
}

interface ComplaintStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
}

export default function MyComplaints() {
  const token = useSelector(getAuthToken);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [stats, setStats] = useState<ComplaintStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0
  });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const { setBreadcrumb } = useOutletContext<userLayoutContextType>();

  useEffect(() => {
    setBreadcrumb(["Dashboard", "My Complaints"]);
  }, [setBreadcrumb]);

  const fetchComplaints = async () => {
    if (!token) {
      setError("You must log in first");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/mycomp", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(res.data);
      setFilteredComplaints(res.data);
      calculateStats(res.data);
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (complaintsList: Complaint[]) => {
    const stats: ComplaintStats = {
      total: complaintsList.length,
      pending: complaintsList.filter(c => c.status === 'pending').length,
      inProgress: complaintsList.filter(c => c.status === 'in-progress').length,
      resolved: complaintsList.filter(c => c.status === 'resolved').length,
      rejected: complaintsList.filter(c => c.status === 'rejected').length
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchComplaints();
  }, [token]);

  useEffect(() => {
    let filtered = complaints;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.priority === priorityFilter);
    }

    setFilteredComplaints(filtered);
  }, [searchTerm, statusFilter, priorityFilter, complaints]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <RefreshCw className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-gr5 text-gr6 border-gr3';
      case 'in-progress': return 'bg-bl5 text-bl6 border-bl3';
      case 'pending': return 'bg-yl1 text-yl6 border-yl3';
      case 'rejected': return 'bg-rd1 text-rd6 border-rd3';
      default: return 'bg-bg3 text-fg2 border-bg0';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-rd1 text-rd6';
      case 'high': return 'bg-or1 text-or6';
      case 'medium': return 'bg-yl1 text-yl6';
      case 'low': return 'bg-gr1 text-gr6';
      default: return 'bg-bg3 text-fg2';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportComplaints = () => {
    const csvData = filteredComplaints.map(complaint => ({
      Title: complaint.title,
      Description: complaint.description,
      Status: complaint.status,
      Priority: complaint.priority,
      Category: complaint.category,
      'Created Date': formatDate(complaint.createdAt),
      'Last Updated': formatDate(complaint.updatedAt)
    }));

    const csvHeaders = Object.keys(csvData[0] || {}).join(',');
    const csvRows = csvData.map(row => Object.values(row).join(','));
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-complaints-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-bg1 rounded-xl shadow-lg p-8 text-center border border-bg0">
          <AlertCircle className="h-16 w-16 text-yl6 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-fg2 mb-2">Authentication Required</h2>
          <p className="text-fg2 mb-6">Please log in to view your complaints</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 text-fg2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-fg2">My Complaints</h1>
          <p className="text-fg2 mt-2">Manage and track all your submitted complaints</p>
        </div>
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={exportComplaints}
            disabled={filteredComplaints.length === 0}
            className="flex items-center space-x-2 bg-gr5 text-fg0 px-4 py-2 rounded-lg hover:bg-gr6 disabled:bg-bg3 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchComplaints}
            disabled={loading}
            className="flex items-center space-x-2 bg-bl6 text-fg0 px-4 py-2 rounded-lg hover:bg-bl7 disabled:bg-bg3 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fg2">Total</p>
              <p className="text-2xl font-bold text-fg2">{stats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-bl5">
              <FileText className="h-6 w-6 text-fg9" />
            </div>
          </div>
        </div>
        <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fg2">Pending</p>
              <p className="text-2xl font-bold text-yl6">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-full bg-yl1">
              <Clock className="h-6 w-6 text-fg9" />
            </div>
          </div>
        </div>
        <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fg2">In Progress</p>
              <p className="text-2xl font-bold text-bl6">{stats.inProgress}</p>
            </div>
            <div className="p-3 rounded-full bg-bl5">
              <RefreshCw className="h-6 w-6 text-fg9" />
            </div>
          </div>
        </div>
        <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fg2">Resolved</p>
              <p className="text-2xl font-bold text-gr6">{stats.resolved}</p>
            </div>
            <div className="p-3 rounded-full bg-gr5">
              <CheckCircle className="h-6 w-6 text-fg9" />
            </div>
          </div>
        </div>
        <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fg2">Rejected</p>
              <p className="text-2xl font-bold text-rd6">{stats.rejected}</p>
            </div>
            <div className="p-3 rounded-full bg-rd1">
              <AlertCircle className="h-6 w-6 text-fg9" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-bg1 rounded-xl shadow-lg p-6 border border-bg0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fg2 h-4 w-4" />
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg2 border border-bg0 rounded-lg focus:ring-2 focus:ring-bl6 focus:border-bl6 text-fg2 placeholder-fg2"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-bg2 border border-bg0 rounded-lg focus:ring-2 focus:ring-bl6 focus:border-bl6 text-fg2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-2 bg-bg2 border border-bg0 rounded-lg focus:ring-2 focus:ring-bl6 focus:border-bl6 text-fg2"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-bg1 rounded-xl shadow-lg border border-bg0 overflow-hidden">
        {error && (
          <div className="bg-rd1 border border-rd3 p-4 m-6 rounded-lg">
            <p className="text-rd6 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </p>
          </div>
        )}

        {loading && complaints.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bl6 mx-auto"></div>
            <p className="text-fg2 mt-2">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-16 w-16 text-fg2 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-fg2 mb-2">No complaints found</h3>
            <p className="text-fg2 mb-4">
              {complaints.length === 0 ? "You haven't submitted any complaints yet." : "No complaints match your filters."}
            </p>
            {complaints.length === 0 && (
              <button
                onClick={() => window.location.href = '/dashboard/newcomplains'}
                className="bg-bl6 text-fg0 px-6 py-2 rounded-lg hover:bg-bl7 transition-colors"
              >
                Submit Your First Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg2 border-b border-bg0">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-fg2 uppercase tracking-wider">
                    Complaint
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-fg2 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-fg2 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-fg2 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-fg2 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-fg2 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-bg1 divide-y divide-bg0">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-bg4 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-medium text-fg2 line-clamp-1">{complaint.title}</h3>
                        <p className="text-sm text-fg2 line-clamp-2 mt-1">{complaint.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bl5 text-fg9">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        <span className="capitalize">{complaint.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-fg2">
                      {formatDate(complaint.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="text-bl6 hover:text-bl7 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-fg2 hover:text-fg1 transition-colors"
                          title="More Options"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredComplaints.length > 0 && (
          <div className="px-6 py-4 border-t border-bg0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-fg2">
                Showing <span className="font-medium">{filteredComplaints.length}</span> of{' '}
                <span className="font-medium">{complaints.length}</span> complaints
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-bg1 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-bg0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-fg2">Complaint Details</h2>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-fg2 hover:text-fg1 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-fg2">Title</label>
                  <p className="text-lg font-semibold text-fg2 mt-1">{selectedComplaint.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-fg2">Description</label>
                  <p className="text-fg2 mt-1 whitespace-pre-wrap">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-fg2">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedComplaint.status)}`}>
                        {getStatusIcon(selectedComplaint.status)}
                        <span className="capitalize">{selectedComplaint.status}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-fg2">Priority</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                        <span className="capitalize">{selectedComplaint.priority}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-fg2">Category</label>
                    <p className="text-fg2 mt-1">{selectedComplaint.category}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-fg2">Assigned To</label>
                    <p className="text-fg2 mt-1">
                      {selectedComplaint.assignedTo ? selectedComplaint.assignedTo.name : 'Not assigned'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-fg2">Created</label>
                    <p className="text-fg2 mt-1">{formatDate(selectedComplaint.createdAt)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-fg2">Last Updated</label>
                    <p className="text-fg2 mt-1">{formatDate(selectedComplaint.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-bg0">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 text-fg2 border border-bg0 rounded-lg hover:bg-bg4 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}