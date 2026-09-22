
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { AuroraBackground } from '../ui/AuroraBackground';

export const FinalCTA = () => {
  return (
    <section className="py-32 relative overflow-hidden flex items-center justify-center min-h-[600px] border-t border-white/5">
      <AuroraBackground className="absolute inset-0 z-0 h-full" />
      
      {/* Floating Profile Photos */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-10 md:left-32 top-20 w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl z-10 hidden sm:block"
      >
        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-10 md:right-32 bottom-20 w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl z-10 hidden sm:block"
      >
        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute left-20 md:left-48 bottom-10 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl z-10 hidden md:block opacity-50"
      >
        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
      </motion.div>

      <div className="relative z-20 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Your next match<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">could be right here.</span>
        </h2>
        <p className="text-xl text-white/80 mb-12 max-w-xl mx-auto font-light">
          Join Pairly and start discovering people who match your vibe.
        </p>
        
        <MagneticButton className="px-10 py-5 bg-white text-black hover:bg-white/90 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all flex items-center gap-3 group">
          Start Matching
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </MagneticButton>
        {/* Floating particles/hearts could be added here */}
      </div>
    </section>
  );
};
