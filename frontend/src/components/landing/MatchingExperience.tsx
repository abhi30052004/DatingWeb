import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export const MatchingExperience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setMatched(true);
      }, 1500); // Trigger match animation after 1.5s in view
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section ref={ref} className="py-24 bg-background relative overflow-hidden flex flex-col items-center">
      <div className="text-center mb-16 z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Your next great conversation <br className="hidden md:block" />
          could be <span className="text-gradient">one match away.</span>
        </h2>
      </div>

      <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center">
        
        {/* Left Card (User) */}
        <motion.div
          initial={{ x: -200, opacity: 0, rotate: -15 }}
          animate={isInView ? { x: matched ? -20 : -100, opacity: 1, rotate: matched ? -5 : -10 } : {}}
          transition={{ duration: 1, type: "spring" }}
          className="absolute z-20 w-48 md:w-64"
        >
          <div className="glass-card rounded-2xl overflow-hidden aspect-[3/4] border-2 border-white/10 p-2">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80" 
              alt="You" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </motion.div>

        {/* Right Card (Match) */}
        <motion.div
          initial={{ x: 200, opacity: 0, rotate: 15 }}
          animate={isInView ? { x: matched ? 20 : 100, opacity: 1, rotate: matched ? 5 : 10 } : {}}
          transition={{ duration: 1, type: "spring" }}
          className="absolute z-10 w-48 md:w-64"
        >
          <div className="glass-card rounded-2xl overflow-hidden aspect-[3/4] border-2 border-white/10 p-2">
            <img 
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80" 
              alt="Sarah" 
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </motion.div>

        {/* Match Celebration Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
          <AnimatePresence>
            {matched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 15, delay: 0.8 }}
                className="text-center pointer-events-auto"
              >
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -10, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="w-20 h-20 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.5)]"
                  >
                    <Heart fill="white" className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
                
                <h3 className="text-5xl md:text-6xl font-black text-white mb-4 italic tracking-tight drop-shadow-lg">
                  It's a Match!
                </h3>
                <p className="text-xl text-white/90 mb-8 font-medium drop-shadow">
                  You both liked each other.
                </p>

                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                  <button className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity">
                    Send Message
                  </button>
                  <button className="w-full py-4 rounded-full glass border border-white/20 text-white font-medium hover:bg-white/10 transition-colors">
                    Keep Discovering
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Background glow when matched */}
        {matched && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full z-0 pointer-events-none" 
          />
        )}
      </div>
    </section>
  );
};
