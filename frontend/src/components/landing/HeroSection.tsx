import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlurText } from '../ui/BlurText';
import { MagneticButton } from '../ui/MagneticButton';
import { ArrowRight, X, Heart, Star } from 'lucide-react';
import { AuroraBackground } from '../ui/AuroraBackground';
import { SwipeCard } from '../ui/SwipeCard';
import { AnimatePresence, motion } from 'framer-motion';

const MOCK_HERO_PROFILES = [
  {
    id: 1,
    name: "Sarah",
    age: 24,
    location: "Kolkata",
    bio: "Travel addict • Coffee lover • Photographer",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    match: 92,
    interests: ["Travel", "Coffee", "Photography"]
  },
  {
    id: 2,
    name: "Maya",
    age: 26,
    location: "Mumbai",
    bio: "Design enthusiast & weekend explorer.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    match: 88,
    interests: ["Design", "Art", "Music"]
  },
  {
    id: 3,
    name: "Alex",
    age: 25,
    location: "Delhi",
    bio: "Foodie. Always looking for the best street food.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    match: 95,
    interests: ["Food", "Movies", "Outdoors"]
  }
];

export const HeroSection = () => {
  const [cards, setCards] = useState(MOCK_HERO_PROFILES);
  const navigate = useNavigate();

  const handleSwipe = (direction: string, id: number) => {
    console.log(`Swiped ${direction} on ${id}`);
    setCards(prev => prev.filter(card => card.id !== id));
  };

  return (
    <AuroraBackground className="min-h-screen pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 relative z-10 py-10 lg:py-0">
        
        {/* Left Side: Text Content */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start z-20 pt-10 lg:pt-0">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            <BlurText text="Meet someone" delay={0.1} />
            <div className="mt-2 text-gradient">
              <BlurText text="worth swiping right for." delay={0.4} />
            </div>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed font-light">
            Discover people nearby, share interests, start conversations, and see where the connection takes you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <MagneticButton 
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-full font-semibold text-lg shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all flex items-center gap-2 group"
            >
              Start Matching
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <MagneticButton 
              onClick={() => navigate('/login')}
              className="px-8 py-4 glass rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Explore
            </MagneticButton>
          </div>
        </div>

        {/* Right Side: Swipeable Cards */}
        <div className="flex-1 w-full max-w-md h-[550px] relative mt-10 lg:mt-0 flex flex-col items-center">
          <div className="relative w-full h-[450px] md:h-[500px]">
            <AnimatePresence>
              {[...cards].reverse().map((profile, index) => {
                const reversedIndex = cards.length - 1 - index;
                const isTop = reversedIndex === 0;
                return (
                  <SwipeCard
                    key={profile.id}
                    onSwipe={(dir) => handleSwipe(dir, profile.id)}
                    disabled={!isTop}
                    className={`absolute inset-0 origin-bottom ${!isTop ? 'pointer-events-none' : ''}`}
                    style={{ zIndex: cards.length - reversedIndex }}
                  >
                    <motion.div 
                      initial={false}
                      animate={{
                        scale: isTop ? 1 : 1 - reversedIndex * 0.05,
                        y: isTop ? 0 : reversedIndex * 15,
                        opacity: isTop ? 1 : 1 - reversedIndex * 0.2,
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full rounded-3xl overflow-hidden relative bg-surface border border-white/10"
                    >
                      <img src={profile.image} alt={profile.name} className="absolute inset-0 w-full h-full object-cover" />
                      
                      {/* Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                      
                      {/* Card Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                        <div className="flex justify-between items-end mb-2">
                          <h2 className="text-3xl font-bold text-white drop-shadow-md">
                            {profile.name}, {profile.age}
                          </h2>
                          <div className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary font-bold text-sm rounded-full">
                            {profile.match}% Match
                          </div>
                        </div>
                        <p className="text-white/80 font-medium mb-3 flex items-center gap-2 drop-shadow-md">
                          {profile.location}
                        </p>
                        <p className="text-white/90 text-sm mb-4 italic drop-shadow-md">
                          "{profile.bio}"
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map(interest => (
                            <span key={interest} className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs border border-white/10 text-white">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </SwipeCard>
                );
              })}
            </AnimatePresence>

            {cards.length === 0 && (
              <div className="w-full h-full rounded-3xl glass-card flex flex-col items-center justify-center text-white/50 border border-white/10">
                <Heart className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-xl font-medium">No more profiles nearby.</p>
                <p className="text-sm">Come back later for more!</p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button 
              onClick={() => cards.length > 0 && handleSwipe('left', cards[0].id)}
              className="w-14 h-14 rounded-full glass flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:scale-110 transition-all border border-red-500/20"
            >
              <X strokeWidth={3} size={28} />
            </button>
            <button 
              onClick={() => cards.length > 0 && handleSwipe('up', cards[0].id)}
              className="w-12 h-12 rounded-full glass flex items-center justify-center text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 hover:scale-110 transition-all border border-blue-400/20"
            >
              <Star strokeWidth={3} size={24} fill="currentColor" />
            </button>
            <button 
              onClick={() => cards.length > 0 && handleSwipe('right', cards[0].id)}
              className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:scale-110 transition-all border border-primary/30 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            >
              <Heart strokeWidth={3} size={32} fill="currentColor" />
            </button>
          </div>
          
          <p className="text-white/40 text-xs mt-4 uppercase tracking-widest font-semibold">Swipe to discover</p>
        </div>
      </div>
      
      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-background pointer-events-none z-30" />
    </AuroraBackground>
  );
};
