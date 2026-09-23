import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { LogOut, Users, Heart, MessageSquare, Trash2, Activity, Ban, CheckCircle, Edit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, swipes: 0, matches: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', gender: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers()
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      toast.error('Failed to load admin data');
      if (error instanceof Error && error.message.includes('401')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user and all associated data?')) {
      return;
    }

    try {
      await api.deleteUser(userId);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u._id !== userId));
      const statsData = await api.getAdminStats();
      setStats(statsData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await api.toggleUserStatus(userId, newStatus);
      toast.success(`User is now ${newStatus}`);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user status');
    }
  };

  const openEditModal = async (user: any) => {
    try {
      // Fetch full profile if needed, but for now we just edit the user base details
      const response = await api.getUserProfile(user._id);
      setSelectedUser(response); // contains { user, profile }
      setEditForm({
        name: response.user.name,
        email: response.user.email,
        gender: response.user.gender
      });
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to load full user details");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      await api.updateUser(selectedUser.user._id, editForm);
      toast.success("User updated successfully");
      setIsModalOpen(false);
      // Update local state
      setUsers(users.map(u => u._id === selectedUser.user._id ? { ...u, ...editForm } : u));
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Activity className="animate-spin text-red-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12 text-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage Pairly application data</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-3xl font-bold">{stats.users}</h3>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-pink-500/20 text-pink-500 flex items-center justify-center">
              <Heart size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Swipes</p>
              <h3 className="text-3xl font-bold">{stats.swipes}</h3>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-white/10 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
              <MessageSquare size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Matches</p>
              <h3 className="text-3xl font-bold">{stats.matches}</h3>
            </div>
          </motion.div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-xl font-bold">Registered Users</h2>
            <span className="bg-white/10 text-xs px-2 py-1 rounded-full">{users.length} Total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'suspended' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {user.status === 'suspended' ? 'Suspended' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user._id, user.status || 'active')}
                            className={`p-2 rounded-lg transition-colors ${user.status === 'suspended' ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10' : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'}`}
                            title={user.status === 'suspended' ? 'Unsuspend User' : 'Suspend User'}
                          >
                            {user.status === 'suspended' ? <CheckCircle size={18} /> : <Ban size={18} />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6">Edit User Profile</h2>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-xl py-2 px-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-xl py-2 px-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                  <select
                    value={editForm.gender}
                    onChange={e => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-xl py-2 px-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Read Only Profile Info */}
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Detailed Profile (Read Only)</h3>
                  {selectedUser.profile ? (
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-500">Bio:</span> {selectedUser.profile.bio || 'N/A'}</p>
                      <p><span className="text-gray-500">City:</span> {selectedUser.profile.city || 'N/A'}</p>
                      <p><span className="text-gray-500">Profession:</span> {selectedUser.profile.profession || 'N/A'}</p>
                      <p><span className="text-gray-500">Goal:</span> {selectedUser.profile.relationship_goal || 'N/A'}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No extended profile data.</p>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-lg text-white font-medium shadow-lg transition-all active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
