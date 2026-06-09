// src/pages/AdminDashboard/AdminUsers.tsx
import { useSelector } from "react-redux";
import { getAuthAdminToken } from "@/store/authAdminSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import { X, Search, Download, Edit, Trash2, User, Mail, Shield, CheckCircle, XCircle, RefreshCw, Save, AlertCircle } from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'support';
  status: 'active' | 'inactive';
  createdAt: string;
  complaintCount: number;
  image?: string;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
}

export default function AdminUsers() {
  const token = useSelector(getAuthAdminToken);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, inactive: 0, admins: 0 });
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    fetchAllUsers();
    fetchUserStats();
  }, [token]);

  const fetchAllUsers = async () => {
    if (!token) {
      setError("You must log in first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:8000/api/v1/admin/users/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err: any) {
      console.error("Fetch users error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:8000/api/v1/admin/users/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err: any) {
      console.error("Fetch stats error:", err);
    }
  };

  useEffect(() => {
    let filtered = users.filter(user => 
      (!searchTerm || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "all" || user.role === roleFilter) &&
      (statusFilter === "all" || user.status === statusFilter)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const updateUser = async () => {
    if (!token || !editingUser) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/admin/users/update`,
        { 
          id: editingUser._id, 
          name: editingUser.name, 
          email: editingUser.email, 
          username: editingUser.username,
          role: editingUser.role,
          status: editingUser.status
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.user) {
        setUsers(prev => prev.map(user => user._id === editingUser._id ? editingUser : user));
        setEditingUser(null);
        fetchUserStats();
        alert("User updated successfully!");
      } else {
        throw new Error(res.data.message);
      }
    } catch (err: any) {
      console.error("Update user error:", err);
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!token || !confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/admin/users/delete/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.message) {
        setUsers(prev => prev.filter(user => user._id !== userId));
        fetchUserStats();
        alert("User deleted successfully!");
      } else {
        throw new Error(res.data.message);
      }
    } catch (err: any) {
      console.error("Delete user error:", err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'support': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'inactive': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const exportUsers = () => {
    const csvData = filteredUsers.map(user => ({
      Name: user.name, 
      Username: user.username,
      Email: user.email, 
      Role: user.role, 
      Status: user.status,
      'Complaint Count': user.complaintCount, 
      'Created Date': formatDate(user.createdAt)
    }));
    
    if (csvData.length === 0) {
      alert("No data to export");
      return;
    }

    const csvHeaders = Object.keys(csvData[0]).join(',');
    const csvRows = csvData.map(row => Object.values(row).join(','));
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-users-${new Date().toISOString().split('T')[0]}.csv`;
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
            <h1 className="text-2xl sm:text-3xl font-bold text-fg2-5">User Management</h1>
            <p className="text-fg1-1 mt-1 sm:mt-2">Manage all users and their permissions</p>
          </div>
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <button 
              onClick={exportUsers} 
              disabled={filteredUsers.length === 0} 
              className="flex items-center space-x-2 bodyBtnStyle px-4 py-2 rounded-lg font-medium shadow hover:bg-fg2-6 disabled:bg-gray-400 transition-all"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button 
              onClick={fetchAllUsers} 
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title="Total Users" 
            value={stats.total} 
            icon={User} 
            color="bg-blue-500" 
            description="Registered users"
          />
          <StatCard 
            title="Active Users" 
            value={stats.active} 
            icon={CheckCircle} 
            color="bg-green-500" 
            description="Currently active"
          />
          <StatCard 
            title="Inactive Users" 
            value={stats.inactive} 
            icon={XCircle} 
            color="bg-red-500" 
            description="Not active"
          />
          <StatCard 
            title="Admin Users" 
            value={stats.admins} 
            icon={Shield} 
            color="bg-purple-500" 
            description="Administrative accounts"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-bg2 rounded-xl shadow-lg p-4 sm:p-6 border border-bg4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2" 
              />
            </div>
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)} 
              className="w-full px-4 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="support">Support</option>
              <option value="admin">Admin</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="w-full px-4 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-bg2 rounded-xl shadow-lg overflow-hidden border border-bg4">
          {loading && users.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-fg1-1 mt-2">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-fg2-5 mb-2">No users found</h3>
              <p className="text-fg1-1">
                {users.length === 0 ? "No users registered yet." : "No users match your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg3 border-b border-bg4">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">User</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">Role</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden md:table-cell">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden lg:table-cell">Complaints</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider hidden xl:table-cell">Created</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-fg1-1 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-bg2 divide-y divide-bg4">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-bg3 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full flex-shrink-0">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-fg2-5 text-sm truncate">{user.name}</h3>
                            <p className="text-sm text-fg1-1 truncate">@{user.username}</p>
                            <p className="text-xs text-fg1-1 sm:hidden truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <div>
                          <p className="text-sm text-fg2-5 flex items-center">
                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          {user.complaintCount} complaints
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-fg1-1 hidden xl:table-cell">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 transition-colors p-1"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition-colors p-1"
                            title="Delete User"
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

          {filteredUsers.length > 0 && (
            <div className="px-4 sm:px-6 py-4 border-t border-bg4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-fg1-1">
                  Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium">{users.length}</span> users
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-bg2 rounded-xl shadow-2xl max-w-md w-full border border-bg4">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-fg2-5">Edit User</h2>
                  <button 
                    onClick={() => setEditingUser(null)} 
                    className="text-fg1-1 hover:text-fg2-5"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-sm font-medium text-fg1-2">Full Name</label>
                    <input 
                      type="text" 
                      value={editingUser.name} 
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, name: e.target.value } : null)} 
                      className="w-full mt-1 px-3 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-fg1-2">Username</label>
                    <input 
                      type="text" 
                      value={editingUser.username} 
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, username: e.target.value } : null)} 
                      className="w-full mt-1 px-3 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-fg1-2">Email</label>
                    <input 
                      type="email" 
                      value={editingUser.email} 
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)} 
                      className="w-full mt-1 px-3 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-fg1-2">Role</label>
                    <select 
                      value={editingUser.role} 
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, role: e.target.value as any } : null)} 
                      className="w-full mt-1 px-3 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2"
                    >
                      <option value="user">User</option>
                      <option value="support">Support</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-fg1-2">Status</label>
                    <select 
                      value={editingUser.status} 
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, status: e.target.value as any } : null)} 
                      className="w-full mt-1 px-3 py-2 border border-bg4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-bg1 text-fg1-2"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4 sm:mt-6 pt-4 border-t border-bg4">
                  <button 
                    onClick={() => setEditingUser(null)} 
                    className="px-4 py-2 text-fg1-2 border border-bg4 rounded-lg hover:bg-bg3 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={updateUser} 
                    disabled={loading} 
                    className="px-4 py-2 bodyBtnStyle rounded-lg font-medium shadow hover:bg-fg2-6 disabled:bg-gray-400 transition-all flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? "Saving..." : "Save Changes"}</span>
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