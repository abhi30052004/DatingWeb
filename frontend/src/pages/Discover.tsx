import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Discover() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please log in to discover profiles.");
          return;
        }

        const response = await fetch('http://localhost:8000/api/profiles/discover', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }

        const data = await response.json();
        setProfiles(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleAction = (id: string, type: 'like' | 'pass') => {
    // In a real app, send this to the API
    console.log(`${type} on profile ${id}`);
    setTimeout(() => {
      setProfiles(prev => prev.filter(p => p._id !== id));
    }, 200);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Discover</h1>
        <div className="bg-surface border border-slate-700 rounded-full px-4 py-2 flex gap-4 text-sm font-medium">
          <button className="text-white hover:text-primary transition">Cards</button>
          <button className="text-gray-500 hover:text-primary transition">Grid</button>
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center max-w-md mx-auto w-full">
        <AnimatePresence>
          {profiles.length > 0 ? (
            <motion.div
              key={profiles[0]._id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full h-[60vh] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-surface border border-slate-800"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${profiles[0].profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'})` }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute bottom-0 w-full p-6 text-left">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-1 capitalize">
                      {profiles[0].name}, {profiles[0].age}
                    </h2>
                    <p className="flex items-center text-gray-300 gap-1 text-sm mb-2">
                      <MapPin size={16} /> {profiles[0].location || 'Nearby'}
                    </p>
                  </div>
                  <div className="bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary px-3 py-1 rounded-full font-semibold text-sm">
                    {Math.floor(80 + Math.random() * 15)}% Match
                  </div>
                </div>
                
                <p className="text-gray-200 text-sm line-clamp-2 mb-6">
                  {profiles[0].bio || 'New to Pairly!'}
                </p>

                <div className="flex justify-center gap-6">
                  <button 
                    onClick={() => handleAction(profiles[0]._id, 'pass')}
                    className="w-16 h-16 rounded-full bg-slate-800/80 backdrop-blur-md flex items-center justify-center border border-slate-700 hover:bg-slate-700 transition hover:scale-110"
                  >
                    <X size={32} className="text-red-400" />
                  </button>
                  <button 
                    onClick={() => handleAction(profiles[0]._id, 'like')}
                    className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:bg-primary transition hover:scale-110"
                  >
                    <Heart size={32} className="text-white" fill="white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="bg-slate-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={40} className="text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No more profiles</h3>
              <p>Check back later for new people.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
