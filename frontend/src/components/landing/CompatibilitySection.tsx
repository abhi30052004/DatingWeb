import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '../ui/SpotlightCard';

export const CompatibilitySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { label: 'Shared Interests', value: 95 },
    { label: 'Lifestyle', value: 88 },
    { label: 'Relationship Goals', value: 96 },
    { label: 'Location', value: 91 },
  ];

  const points = [
    "8 shared interests",
    "Similar relationship goals",
    "Live nearby",
    "Similar lifestyle"
  ];

  return (
    <section className="py-24 relative z-10 bg-surface/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Profile Preview */}
          <div className="flex-1 w-full max-w-md" ref={ref}>
            <SpotlightCard className="p-2 border border-white/10 rounded-[2rem] overflow-hidden">
              <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80" 
                  alt="Compatibility Match" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-3xl font-bold text-white mb-2">Sarah, 24</h3>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online</span>
                    <span>2 km away</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Right Side: Stats */}
          <div className="flex-1 w-full">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              It's more than <span className="text-gradient">a swipe.</span>
            </h2>
            <p className="text-xl text-white/60 mb-12">
              Discover people based on the things that actually matter.
            </p>

            <div className="flex items-center gap-6 mb-12">
              <div className="relative w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center">
                <motion.svg 
                  className="absolute inset-0 w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-primary"
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 0.92 } : { pathLength: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </motion.svg>
                <div className="text-2xl font-bold text-white">92%</div>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white">Compatibility</h4>
                <p className="text-white/60">Based on your preferences</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              {stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-white/80">{stat.label}</span>
                    <span className="text-white">{stat.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${stat.value}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((point, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                  className="flex items-center gap-3 text-white/80"
                >
                  <CheckCircle2 className="text-secondary w-5 h-5 flex-shrink-0" />
                  <span>{point}</span>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
