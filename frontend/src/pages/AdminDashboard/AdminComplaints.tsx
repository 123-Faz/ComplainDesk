import { useSelector } from "react-redux";
import { getAuthAdminToken } from "@/store/authAdminSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  Download, 
  Eye, 
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  X
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
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface ComplaintStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
}

export default function AdminComplaints() {
  const token = useSelector(getAuthAdminToken);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState<ComplaintStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0
  });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAllComplaints();
  }, [token]);

  const fetchAllComplaints = async () => {
    if (!token) {
      setError("You must log in first");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8000/api/v1/admin/complaints/get-all", {
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
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    setFilteredComplaints(filtered);
  }, [searchTerm, statusFilter, complaints]);

  const updateComplaintStatus = async (complaintId: string, newStatus: string) => {
    if (!token) return;

    setActionLoading(complaintId);
    try {
      await axios.put(
        `http://localhost:8000/api/v1/admin/complaints/update-status/${complaintId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update the complaint in state
      setComplaints(prev => prev.map(complaint =>
        complaint._id === complaintId 
          ? { ...complaint, status: newStatus as any }
          : complaint
      ));
      
      // Update stats
      calculateStats(complaints.map(complaint =>
        complaint._id === complaintId 
          ? { ...complaint, status: newStatus as any }
          : complaint
      ));

      // Update selected complaint if it's open
      if (selectedComplaint?._id === complaintId) {
        setSelectedComplaint(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
      
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteComplaint = async (complaintId: string) => {
    if (!token || !confirm("Are you sure you want to delete this complaint? This action cannot be undone.")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/v1/admin/complaints/delete/${complaintId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setComplaints(prev => prev.filter(complaint => complaint._id !== complaintId));
      setSelectedComplaint(null);
      calculateStats(complaints.filter(complaint => complaint._id !== complaintId));
      alert("Complaint deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete complaint:", err);
      alert(err.response?.data?.message || "Failed to delete complaint");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      case 'in-progress': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700';
      case 'rejected': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
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
      'User Name': complaint.user.name,
      'User Email': complaint.user.email,
      'Created Date': formatDate(complaint.createdAt),
    }));

    const csvHeaders = Object.keys(csvData[0] || {}).join(',');
    const csvRows = csvData.map(row => Object.values(row).join(','));
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-complaints-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    description 
  }: { 
    title: string; 
    value: number; 
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
            <h1 className="text-2xl sm:text-3xl font-bold text-fg2-5">All Complaints</h1>
            <p className="text-fg1-1 mt-1 sm:mt-2">Manage and track all user complaints</p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button
              onClick={exportComplaints}
              disabled={filteredComplaints.length === 0}
              className="flex items-center space-x-2 bodyBtnStyle px-4 py-2 rounded-lg font-medium shadow hover:bg-fg2-6 disabled:bg-gray-400 transition-all"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={fetchAllComplaints}
              disabled={loading}
              className="flex items-center space-x-2 bodyBtnStyle px-4 py-2 rounded-lg font-medium shadow hover:bg-fg2-6 disabled:bg-gray-400 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? "Refreshing..." : "Refresh"}</span>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          <StatCard 
            title="Total Complaints" 
            value={stats.total} 
            icon={FileText} 
            color="bg-blue-500"
            description="All time complaints"
          />
          <StatCard 
            title="Pending" 
            value={stats.pending} 
            icon={Clock} 
            color="bg-yellow-500"
            description="Awaiting action"
          />
          <StatCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={Clock} 
            color="bg-blue-500"
            description="Being processed"
          />
          <StatCard 
            title="Resolved" 
            value={stats.resolved} 
            icon={CheckCircle} 
            color="bg-green-500"
            description="Successfully closed"
          />
          <StatCard 
            title="Rejected" 
            value={stats.rejected} 
            icon={AlertCircle} 
            color="bg-red-500"
            description="Not accepted"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-bg2 rounded-xl shadow-lg p-4 sm:p-6 border border-bg4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-bg2 rounded-xl shadow-lg overflow-hidden border border-bg4">
          {loading && complaints.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-fg1-1 mt-2">Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-fg2-5 mb-2">No complaints found</h3>
              <p className="text-fg1-1">
                {complaints.length === 0 ? "No complaints have been submitted yet." : "No complaints match your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg3 border-b border-bg4">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">
                      Complaint
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden sm:table-cell">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden lg:table-cell">
                      Created
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-bg2 divide-y divide-bg4">
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-bg3 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="min-w-0">
                          <h3 className="font-medium text-fg2-5 text-sm line-clamp-1">{complaint.title}</h3>
                          <p className="text-sm text-fg1-1 line-clamp-2 mt-1">{complaint.description}</p>
                          <p className="text-xs text-fg1-1 mt-1">{complaint.category}</p>
                          <p className="text-xs text-fg1-1 sm:hidden mt-1">{complaint.user.name}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <div className="min-w-0">
                          <p className="font-medium text-fg2-5 text-sm truncate">{complaint.user.name}</p>
                          <p className="text-sm text-fg1-1 truncate">{complaint.user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <select
                          value={complaint.status}
                          onChange={(e) => updateComplaintStatus(complaint._id, e.target.value)}
                          disabled={actionLoading === complaint._id}
                          className={`text-xs font-medium border rounded-full px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-24 ${
                            getStatusColor(complaint.status)
                          } ${actionLoading === complaint._id ? 'opacity-50' : ''} bg-bg1`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-fg1-1 hidden lg:table-cell">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedComplaint(complaint)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 transition-colors p-1"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteComplaint(complaint._id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors p-1"
                            title="Delete Complaint"
                          >
                            <Trash2 className="h-4 w-4" />
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
            <div className="px-4 sm:px-6 py-4 border-t border-bg4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-fg1-1">
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
            <div className="bg-bg2 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-bg4">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-fg2-5">Complaint Details</h2>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="text-fg1-1 hover:text-fg2-5 transition-colors"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="text-sm font-medium text-fg1-2">Title</label>
                    <p className="text-lg font-semibold text-fg2-5 mt-1">{selectedComplaint.title}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-fg1-2">Description</label>
                    <p className="text-fg1-2 mt-1 whitespace-pre-wrap">{selectedComplaint.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm font-medium text-fg1-2">Status</label>
                      <select
                        value={selectedComplaint.status}
                        onChange={(e) => updateComplaintStatus(selectedComplaint._id, e.target.value)}
                        className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(selectedComplaint.status)} bg-bg1`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-fg1-2">Priority</label>
                      <p className={`mt-1 px-3 py-2 rounded-lg text-sm font-medium ${getPriorityColor(selectedComplaint.priority)}`}>
                        {selectedComplaint.priority}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm font-medium text-fg1-2">Category</label>
                      <p className="text-fg2-5 mt-1">{selectedComplaint.category}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-fg1-2">Created Date</label>
                      <p className="text-fg2-5 mt-1">{formatDate(selectedComplaint.createdAt)}</p>
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="bg-bg3 rounded-lg p-3 sm:p-4">
                    <h3 className="font-medium text-fg2-5 mb-3">User Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-fg1-1">Name:</span>
                        <span className="font-medium text-fg2-5">{selectedComplaint.user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-fg1-1">Email:</span>
                        <span className="font-medium text-fg2-5">{selectedComplaint.user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-fg1-1">Phone:</span>
                        <span className="font-medium text-fg2-5">{selectedComplaint.user.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4 sm:mt-6 pt-4 border-t border-bg4">
                  <button
                    onClick={() => deleteComplaint(selectedComplaint._id)}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                  >
                    Delete Complaint
                  </button>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 text-fg1-2 border border-bg4 rounded-lg hover:bg-bg3 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}