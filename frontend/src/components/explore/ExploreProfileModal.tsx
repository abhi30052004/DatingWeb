import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, MapPin, BadgeCheck, AlertCircle, Ban } from 'lucide-react';

interface ExploreProfileModalProps {
  profile: any;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onSuperLike: (id: string) => void;
}

export function ExploreProfileModal({ profile, isOpen, onClose, onLike, onPass, onSuperLike }: ExploreProfileModalProps) {
  if (!profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-x-auto md:w-[600px] md:left-1/2 md:-translate-x-1/2 md:top-12 md:bottom-12 bg-surface border border-slate-800 rounded-3xl z-[70] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar relative">
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition"
              >
                <X size={20} />
              </button>

              {/* Main Photo */}
              <div className="w-full h-[60vh] md:h-[500px] relative">
                <img 
                  src={profile.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-4xl font-black text-white flex items-center gap-2 capitalize">
                    {profile.name}, {profile.age} <BadgeCheck className="text-blue-400" size={28} />
                  </h1>
                  {profile.profession && (
                    <p className="text-lg text-white font-medium mt-1">{profile.profession}</p>
                  )}
                  <p className="flex items-center text-gray-300 gap-1 text-sm mt-2">
                    <MapPin size={16} /> {profile.location || 'Nearby'} • 3 km away
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Bio */}
                <section>
                  <h3 className="text-lg font-bold text-white mb-2">About me</h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {profile.bio || 'This user hasn\'t added a bio yet.'}
                  </p>
                </section>

                {/* Shared Interests Highlight */}
                {profile.interests && profile.interests.length > 0 && (
                  <section className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
                    <h3 className="text-sm font-bold text-primary mb-2">You both like {profile.interests[0]} ✨</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest: string, i: number) => (
                        <span key={i} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Basics */}
                <section>
                  <h3 className="text-lg font-bold text-white mb-4">Basics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {profile.relationship_goal && (
                      <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                        <span className="block text-xs text-gray-500 mb-1">Looking for</span>
                        <span className="text-sm text-white font-medium">{profile.relationship_goal}</span>
                      </div>
                    )}
                    {profile.gender && (
                      <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
                        <span className="block text-xs text-gray-500 mb-1">Gender</span>
                        <span className="text-sm text-white font-medium capitalize">{profile.gender}</span>
                      </div>
                    )}
                  </div>
                </section>

                {/* Report / Block */}
                <div className="pt-8 border-t border-slate-800 flex flex-col gap-3">
                  <button className="flex items-center justify-center gap-2 text-gray-500 hover:text-white transition py-2 text-sm font-medium">
                    <AlertCircle size={16} /> Report {profile.name}
                  </button>
                  <button className="flex items-center justify-center gap-2 text-gray-500 hover:text-red-400 transition py-2 text-sm font-medium">
                    <Ban size={16} /> Block {profile.name}
                  </button>
                </div>
                
                {/* Spacer for floating buttons */}
                <div className="h-24" />
              </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-surface via-surface to-transparent flex justify-center gap-6">
              <button 
                onClick={() => { onPass(profile._id); onClose(); }}
                className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:scale-110 transition shadow-lg text-red-400"
              >
                <X size={28} />
              </button>
              <button 
                onClick={() => { onSuperLike(profile._id); onClose(); }}
                className="w-14 h-14 mt-1 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-slate-800 hover:scale-110 transition shadow-lg text-blue-400"
              >
                <Star size={24} fill="currentColor" />
              </button>
              <button 
                onClick={() => { onLike(profile._id); onClose(); }}
                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:bg-pink-600 hover:scale-110 transition shadow-[0_0_25px_rgba(236,72,153,0.5)] text-white"
              >
                <Heart size={28} fill="currentColor" />
              </button>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
