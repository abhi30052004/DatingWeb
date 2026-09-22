import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { X, Heart, MapPin, Search, Star, Bell, Settings, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';
import MatchModal from '../components/MatchModal';

export default function Discover() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Match Modal State
  const [matchData, setMatchData] = useState<{name: string, photo: string, matchId: string} | null>(null);

  // User's own profile photo for the match modal
  const [myPhoto, setMyPhoto] = useState<string>('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch my profile to get my photo
        fetch(`${API_URL}/profiles/me`, { headers: { 'Authorization': `Bearer ${token}` }})
          .then(res => res.json())
          .then(data => { if (data.profile_photo) setMyPhoto(data.profile_photo); })
          .catch(() => {});

        // Fetch discovery
        const response = await fetch(`${API_URL}/profiles/discover`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setProfiles(data);
        }
      } catch (err: any) {
        toast.error("Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [navigate]);

  const [exitDirection, setExitDirection] = useState<{ x: number, y: number }>({ x: 0, y: -20 });

  const handleAction = async (id: string, actionType: 'LIKE' | 'PASS' | 'SUPER_LIKE') => {
    const targetProfile = profiles.find(p => p._id === id);
    if (!targetProfile) return;

    // Set the exit animation direction before removing
    if (actionType === 'LIKE') setExitDirection({ x: 500, y: 0 });
    else if (actionType === 'PASS') setExitDirection({ x: -500, y: 0 });
    else if (actionType === 'SUPER_LIKE') setExitDirection({ x: 0, y: -500 });

    // Optimistic UI update
    setProfiles(prev => prev.filter(p => p._id !== id));

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Toast feedback based on action
      if (actionType === 'LIKE') toast.success(`Liked ${targetProfile.name} ❤️`);
      else if (actionType === 'PASS') toast("Profile passed", { icon: "✕" });
      else if (actionType === 'SUPER_LIKE') toast.success(`Super Liked ${targetProfile.name}! 🌟`);

      const response = await fetch(`${API_URL}/swipes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ target_user_id: targetProfile.user_id, action: actionType })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.match) {
          // Trigger Match Modal
          setMatchData({
            name: targetProfile.name,
            photo: targetProfile.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
            matchId: data.match_id || "temp" // MVP fallback if backend doesn't return match_id yet
          });
        }
      }
    } catch (err) {
      console.error("Failed to record swipe:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto overflow-x-hidden">
      <MatchModal 
        isOpen={!!matchData} 
        onClose={() => setMatchData(null)} 
        matchData={matchData} 
        currentUserPhoto={myPhoto} 
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold capitalize">Good evening, {user?.name?.split(' ')[0]}</h1>
          <p className="text-sm text-gray-400 mt-1">Find someone who matches your vibe.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-gray-400 hover:text-white transition">
            <Bell size={20} />
          </button>
          <button onClick={() => navigate('/settings')} className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-gray-400 hover:text-white transition">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center">
        
        {/* The Swipe Card Area */}
        <div className="relative w-full max-w-sm h-[65vh] max-h-[600px] mb-8 shrink-0">
          <AnimatePresence>
            {profiles.length > 0 ? (
              <SwipeCard 
                key={profiles[0]._id} 
                profile={profiles[0]} 
                onAction={(type) => handleAction(profiles[0]._id, type)} 
                exitDirection={exitDirection}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-400 bg-surface border border-slate-800 rounded-3xl p-6">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <Search size={32} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No new people right now</h3>
                <p className="text-sm">Try increasing your distance or adjusting your preferences.</p>
                <button className="mt-6 px-6 py-2 rounded-full bg-slate-800 text-white font-medium hover:bg-slate-700 transition">
                  Adjust Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sections below the card (Only show if there is a profile visible) */}
        {profiles.length > 0 && (
          <div className="w-full max-w-md mx-auto space-y-10 pb-20">
            
            {/* Why you match */}
            <section>
              <h3 className="font-bold text-lg mb-4">Why you match</h3>
              <div className="bg-surface border border-slate-800 rounded-2xl p-5 space-y-3">
                <p className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span> 3 shared interests
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span> Similar relationship goals
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span> Lives nearby
                </p>
                <button className="text-primary text-sm font-medium hover:underline mt-2">
                  See compatibility details
                </button>
              </div>
            </section>

            {/* Recommended for you */}
            <section>
              <h3 className="font-bold text-lg mb-4">Recommended for you</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {[1, 2].map((i) => (
                  <div key={i} className="snap-start shrink-0 w-32 h-40 rounded-2xl bg-surface border border-slate-800 overflow-hidden relative group cursor-pointer">
                    <img src={`https://i.pravatar.cc/300?img=${i+10}`} alt="Recommended" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                      <p className="font-semibold text-sm text-white">Maya, 25</p>
                      <p className="text-[10px] text-primary">94% Match</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
          </div>
        )}
      </div>
    </div>
  );
}

// Separate SwipeCard component for isolated Framer Motion state
function SwipeCard({ profile, onAction, exitDirection }: { profile: any, onAction: (type: 'LIKE' | 'PASS' | 'SUPER_LIKE') => void, exitDirection: {x: number, y: number} }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values based on drag
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [0, -100], [0, 1]);
  const superLikeOpacity = useTransform(y, [0, -100], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;

    if (offsetY < -threshold && Math.abs(offsetY) > Math.abs(offsetX)) {
      onAction('SUPER_LIKE');
    } else if (offsetX > threshold) {
      onAction('LIKE');
    } else if (offsetX < -threshold) {
      onAction('PASS');
    }
  };

  return (
    <motion.div
      style={{ x, y, rotate }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0, x: exitDirection.x, y: exitDirection.y, transition: { duration: 0.3 } }}
      transition={{ type: "spring", damping: 20 }}
      className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-surface border border-slate-800 cursor-grab active:cursor-grabbing z-10 touch-none"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${profile.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
      
      {/* Visual Feedback Stamps */}
      <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-green-500 text-green-500 text-4xl font-black px-4 py-2 rounded-xl uppercase rotate-[-15deg] pointer-events-none">LIKE</motion.div>
      <motion.div style={{ opacity: passOpacity }} className="absolute top-8 right-8 border-4 border-red-500 text-red-500 text-4xl font-black px-4 py-2 rounded-xl uppercase rotate-[15deg] pointer-events-none">PASS</motion.div>
      <motion.div style={{ opacity: superLikeOpacity }} className="absolute top-32 left-1/2 -translate-x-1/2 border-4 border-blue-500 text-blue-500 text-4xl font-black px-4 py-2 rounded-xl uppercase pointer-events-none">SUPER LIKE</motion.div>

      {/* Profile Info */}
      <div className="absolute bottom-24 w-full p-6 text-left pointer-events-none">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2 capitalize">
              {profile.name}, {profile.age} <BadgeCheck size={20} className="text-blue-400" />
            </h2>
            <p className="flex items-center text-gray-300 gap-1 text-sm mb-1">
              {profile.profession && <span className="font-semibold text-white mr-2">{profile.profession}</span>}
            </p>
            <p className="flex items-center text-gray-300 gap-1 text-sm">
              <MapPin size={14} /> {profile.location || 'Nearby'}
              <span className="mx-2">•</span>
              <span className="font-semibold text-white">3 km away</span>
            </p>
          </div>
        </div>
        
        <p className="text-gray-200 text-sm line-clamp-2 mt-4 mb-3">
          "{profile.bio || 'New to Pairly!'}"
        </p>

        {/* Interests */}
        <div className="flex flex-wrap gap-2">
          {profile.interests?.slice(0, 3).map((interest: string, i: number) => (
            <span key={i} className="bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-slate-700">
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Buttons (Fixed at the bottom of the card) */}
      <div className="absolute bottom-6 w-full flex justify-center gap-4 px-6 z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); onAction('PASS'); }}
          className="w-14 h-14 rounded-full bg-slate-900/90 backdrop-blur-md flex items-center justify-center border border-slate-700 hover:scale-110 hover:bg-slate-800 transition"
          title="Pass"
        >
          <X size={24} className="text-red-400" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onAction('SUPER_LIKE'); }}
          className="w-12 h-12 rounded-full bg-slate-900/90 backdrop-blur-md flex items-center justify-center border border-slate-700 hover:scale-110 hover:bg-slate-800 transition mt-2"
          title="Super Like"
        >
          <Star size={20} className="text-blue-400" fill="currentColor" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onAction('LIKE'); }}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:scale-110 transition"
          title="Like"
        >
          <Heart size={24} className="text-white" fill="white" />
        </button>
      </div>
    </motion.div>
  );
}
