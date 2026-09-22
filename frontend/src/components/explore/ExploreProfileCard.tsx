import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, BadgeCheck, Eye } from 'lucide-react';

interface ExploreProfileCardProps {
  profile: any;
  onLike: (id: string) => void;
  onView: (id: string) => void;
}

export function ExploreProfileCard({ profile, onLike, onView }: ExploreProfileCardProps) {
  // Generate a mock compatibility percentage for now
  const compMatch = Math.floor(Math.random() * 20) + 75; // 75-95%

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative rounded-3xl overflow-hidden bg-surface border border-slate-800 shadow-lg cursor-pointer h-80"
      onClick={() => onView(profile._id)}
    >
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${profile.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'})` }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top Left: Match Badge */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md border border-slate-700/50 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
        <span className="text-primary">♥</span> {compMatch}%
      </div>

      {/* Content Area */}
      <div className="absolute bottom-0 w-full p-4 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-1 capitalize leading-tight">
          {profile.name}, {profile.age} <BadgeCheck size={16} className="text-blue-400 shrink-0" />
        </h3>
        
        <p className="flex items-center text-gray-300 gap-1 text-xs mb-2 truncate">
          <MapPin size={12} className="shrink-0" /> {profile.location || 'Nearby'}
          <span className="mx-1">•</span>
          <span className="font-semibold text-white">~3 km</span>
        </p>

        <p className="text-gray-200 text-xs line-clamp-2 mb-3 leading-snug">
          "{profile.bio || 'New to Pairly!'}"
        </p>

        {/* Interests (limit to 2 for space) */}
        <div className="flex flex-wrap gap-1 mb-2">
          {profile.interests?.slice(0, 2).map((interest: string, i: number) => (
            <span key={i} className="bg-slate-800/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-white border border-slate-700 truncate max-w-[80px]">
              {interest}
            </span>
          ))}
        </div>

        {/* Hover Actions */}
        <div className="flex items-center justify-between mt-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); onLike(profile._id); }}
            className="flex-1 flex items-center justify-center gap-1 bg-primary hover:bg-pink-600 text-white py-2 rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(236,72,153,0.3)]"
          >
            <Heart size={14} fill="currentColor" /> Like
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onView(profile._id); }}
            className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white ml-2 p-2 rounded-xl backdrop-blur-md transition"
            title="View Profile"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
