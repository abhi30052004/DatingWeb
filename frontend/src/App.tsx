import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Discover from './pages/Discover';
import Explore from './pages/Explore';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Likes from './pages/Likes';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

import { NotificationProvider } from './context/NotificationContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <Heart size={48} className="text-primary fill-current" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mt-6 tracking-widest uppercase shadow-sm">Pairly</h2>
        <p className="text-sm text-gray-500 mt-2">Finding your perfect match...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (wrapped in Layout and NotificationProvider) */}
        <Route element={<NotificationProvider><Layout /></NotificationProvider>}>
          <Route path="/discover" element={<Discover />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:matchId" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
