import { useState, useEffect } from 'react';
import { Search as SearchIcon, SlidersHorizontal, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

import { ExploreProfileCard } from '../components/explore/ExploreProfileCard';
import { FilterDrawer } from '../components/explore/FilterDrawer';
import { ExploreProfileModal } from '../components/explore/ExploreProfileModal';
import MatchModal from '../components/MatchModal';
import { useAuth } from '../context/AuthContext';

export default function Explore() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<{name: string, photo: string, matchId: string} | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProfiles = async (query = '') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let url = `${API_URL}/profiles/explore`;
      if (query) {
        url += `?q=${encodeURIComponent(query)}`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfiles(data);
      }
    } catch (err) {
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProfiles();
  }, [navigate]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProfiles(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, navigate]);

  const handleAction = async (id: string, actionType: 'LIKE' | 'PASS' | 'SUPER_LIKE') => {
    const targetProfile = profiles.find(p => p._id === id);
    if (!targetProfile) return;

    // Optimistic UI removal
    setProfiles(prev => prev.filter(p => p._id !== id));
    
    // Close modal if open
    if (selectedProfileId === id) {
      setSelectedProfileId(null);
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (actionType === 'LIKE') toast.success(`Liked ${targetProfile.name} ❤️`);
      else if (actionType === 'SUPER_LIKE') toast.success(`Super Liked ${targetProfile.name}! 🌟`);

      const response = await fetch(`${API_URL}/swipes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ target_user_id: targetProfile.user_id, action: actionType })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.match) {
          setMatchData({
            name: targetProfile.name,
            photo: targetProfile.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
            matchId: data.match_id || "temp"
          });
        }
      }
    } catch (err) {
      console.error("Swipe failed", err);
    }
  };

  // Derived sections for curated view
  const recommended = profiles.slice(0, 4);
  const nearYou = profiles.slice(4, 8);
  const newOnPairly = profiles.slice(8, 12);
  const sharedInterests = profiles.filter(p => p.interests?.length > 0).slice(0, 4);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-full bg-background pb-24 md:pb-8 relative">
      
      {/* Header & Sticky Search */}
      <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-slate-800 p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          <div className="hidden md:block">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Explore</h1>
            <p className="text-sm text-gray-400">Discover people who match your interests.</p>
          </div>
          <div className="md:hidden shrink-0">
            <h1 className="text-2xl font-bold">Explore</h1>
          </div>

          <div className="flex items-center gap-2 flex-1 md:flex-initial justify-end">
            <div className="relative w-full md:w-64 max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-full pl-10 pr-10 py-2.5 text-sm text-white focus:border-primary transition shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="bg-slate-900 border border-slate-700 hover:bg-slate-800 p-2.5 rounded-full flex items-center justify-center transition text-gray-300 hover:text-white shrink-0 shadow-sm"
              title="Filters"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-12">

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon size={32} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No people found</h3>
              <p className="text-gray-400 mb-6">Try a different search or adjust your filters.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full font-medium transition"
              >
                Clear Search
              </button>
            </div>
          ) : isSearching ? (
            /* SEARCH GRID VIEW */
            <div>
              <p className="text-sm font-medium text-gray-400 mb-6">{profiles.length} people found</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {profiles.map(profile => (
                  <ExploreProfileCard 
                    key={profile._id} 
                    profile={profile} 
                    onLike={id => handleAction(id, 'LIKE')}
                    onView={id => setSelectedProfileId(id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* CURATED SECTIONS VIEW */
            <>
              {recommended.length > 0 && (
                <ExploreSection 
                  title="Recommended For You" 
                  subtitle="Based on your preferences and interests."
                  profiles={recommended}
                  onLike={id => handleAction(id, 'LIKE')}
                  onView={id => setSelectedProfileId(id)}
                />
              )}
              
              {nearYou.length > 0 && (
                <ExploreSection 
                  title="People Near You" 
                  subtitle="Discover people within your preferred distance."
                  profiles={nearYou}
                  onLike={id => handleAction(id, 'LIKE')}
                  onView={id => setSelectedProfileId(id)}
                />
              )}

              {sharedInterests.length > 0 && (
                <ExploreSection 
                  title="Shared Interests" 
                  subtitle="Because you both like similar things ✨"
                  profiles={sharedInterests}
                  onLike={id => handleAction(id, 'LIKE')}
                  onView={id => setSelectedProfileId(id)}
                />
              )}

              {newOnPairly.length > 0 && (
                <ExploreSection 
                  title="New on Pairly" 
                  subtitle="Say hi to the newest members."
                  profiles={newOnPairly}
                  onLike={id => handleAction(id, 'LIKE')}
                  onView={id => setSelectedProfileId(id)}
                />
              )}
            </>
          )}

        </div>
      </div>

      {/* Overlays */}
      <FilterDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
      
      <ExploreProfileModal 
        isOpen={!!selectedProfileId}
        profile={profiles.find(p => p._id === selectedProfileId)}
        onClose={() => setSelectedProfileId(null)}
        onLike={id => handleAction(id, 'LIKE')}
        onPass={id => handleAction(id, 'PASS')}
        onSuperLike={id => handleAction(id, 'SUPER_LIKE')}
      />

      <MatchModal 
        isOpen={!!matchData}
        onClose={() => setMatchData(null)}
        matchData={matchData}
        currentUserPhoto={user?.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'}
      />
    </div>
  );
}

/* Helper Component for Curated Sections */
function ExploreSection({ title, subtitle, profiles, onLike, onView }: { title: string, subtitle: string, profiles: any[], onLike: (id: string)=>void, onView: (id: string)=>void }) {
  return (
    <section>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
        <button className="text-sm font-semibold text-primary hover:text-pink-400 transition hidden md:block">
          See All →
        </button>
      </div>
      
      <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x hide-scrollbar">
        {profiles.map(profile => (
          <div key={profile._id} className="snap-start shrink-0 w-[240px] md:w-[280px]">
            <ExploreProfileCard 
              profile={profile} 
              onLike={onLike}
              onView={onView}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
