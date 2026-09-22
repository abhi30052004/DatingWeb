import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, MapPin, Search } from 'lucide-react';

const DISCOVER_PROFILES = [
  { id: 1, name: 'Jessica', age: 23, location: '1 km away', bio: 'Foodie and traveler.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', match: 75, interests: ['Food', 'Travel'] },
  { id: 2, name: 'Michael', age: 27, location: '5 km away', bio: 'Tech enthusiast, aspiring chef.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', match: 89, interests: ['Tech', 'Cooking'] },
  { id: 3, name: 'Sophia', age: 25, location: '2 km away', bio: 'Yoga on weekends, movies on weekdays.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', match: 92, interests: ['Yoga', 'Movies'] },
  { id: 4, name: 'Daniel', age: 28, location: '10 km away', bio: 'Outdoors and dogs.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', match: 84, interests: ['Hiking', 'Dogs'] },
  { id: 5, name: 'Emma', age: 24, location: '3 km away', bio: 'Coffee dates and book shops.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', match: 95, interests: ['Books', 'Coffee'] }
];

export const DiscoverSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [100, -300]);

  return (
    <section ref={containerRef} id="discover" className="py-24 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Discover people you'll <span className="text-gradient">actually want to meet.</span>
        </h2>
      </div>

      <div className="w-full overflow-x-auto pb-12 pt-4 px-6 hide-scrollbar flex gap-6 snap-x snap-mandatory lg:overflow-visible">
        <motion.div 
          className="flex gap-6 min-w-max lg:ml-20"
          style={{ x }}
        >
          {DISCOVER_PROFILES.map((profile, i) => (
            <motion.div 
              key={profile.id}
              whileHover={{ y: -15, scale: 1.02 }}
              className="w-72 h-[400px] md:w-80 md:h-[450px] relative rounded-3xl overflow-hidden snap-center group cursor-pointer shadow-xl border border-white/5"
            >
              <img src={profile.image} alt={profile.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-2xl font-bold text-white">{profile.name}, {profile.age}</h3>
                  <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded-full border border-primary/30">
                    {profile.match}%
                  </span>
                </div>
                <p className="flex items-center gap-1 text-sm text-gray-300 mb-3">
                  <MapPin size={14} /> {profile.location}
                </p>
                <div className="flex gap-2 mb-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  {profile.interests.map(interest => (
                    <span key={interest} className="text-xs bg-white/10 backdrop-blur-md px-2 py-1 rounded-full text-white">
                      {interest}
                    </span>
                  ))}
                </div>
                
                {/* Action Buttons on Hover */}
                <div className="flex justify-between gap-4 opacity-0 transform translate-y-4 transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-0">
                  <button className="flex-1 py-2 rounded-full glass border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
                    View
                  </button>
                  <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
