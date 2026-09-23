import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { AuroraBackground } from '../components/ui/AuroraBackground';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.adminLogin({ username, password });
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card/80 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
            <ShieldAlert size={32} className="text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Portal</h2>
        <p className="text-gray-400 text-center mb-8">Restricted access only.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Admin Username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl py-3 font-semibold shadow-lg transition-all active:scale-95 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </motion.div>
    </AuroraBackground>
  );
};

export default AdminLogin;
