import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MessageCircle } from 'lucide-react';

export default function Matches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:8000/api/swipes/matches', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch matches');

        const data = await response.json();
        setMatches(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Your Matches</h1>
        <p className="text-gray-400">People who liked you back.</p>
      </div>

      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
          <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <MessageCircle size={40} className="text-slate-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No matches yet</h2>
          <p>Keep swiping to find your perfect match!</p>
          <button onClick={() => navigate('/discover')} className="mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-pink-600 transition">
            Start Swiping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {matches.map(match => (
            <div 
              key={match.match_id} 
              onClick={() => navigate(`/messages/${match.match_id}`)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-surface border border-slate-800 hover:border-primary/50 transition relative aspect-[3/4]"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-500"
                style={{ backgroundImage: `url(${match.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 w-full p-4">
                <h3 className="font-bold text-lg text-white capitalize">{match.name}</h3>
                <p className="text-xs text-primary font-medium flex items-center gap-1 mt-1">
                  <MessageCircle size={12} /> Send a message
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
