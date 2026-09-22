import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: "I stopped endlessly scrolling and actually started having meaningful conversations.",
    author: "Sarah",
    age: 24,
    location: "Kolkata",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    text: "The compatibility matching is scary accurate. Found someone who shares my exact weird hobbies.",
    author: "David",
    age: 28,
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 3,
    text: "Finally a dating app that feels premium and doesn't treat you like just another card in a deck.",
    author: "Priya",
    age: 26,
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 4,
    text: "The swipe experience is so smooth, and the prompts actually lead to great icebreakers.",
    author: "Rohan",
    age: 27,
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 relative z-20 bg-background overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Don't just take <span className="text-gradient">our word for it.</span>
        </h2>
        <p className="text-white/60 text-lg">Real connections. Real stories.</p>
      </div>

      <div className="relative w-full flex overflow-hidden">
        {/* Carousel Animation Container */}
        <motion.div
          animate={{ x: [0, -1600] }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
          className="flex gap-6 px-6"
        >
          {/* Double the items to create a seamless infinite scroll loop */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <div 
              key={`${t.id}-${i}`}
              className="w-[350px] md:w-[400px] flex-shrink-0 glass-card p-8 rounded-3xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <Quote className="text-primary/40 w-10 h-10 mb-6" />
                <p className="text-lg text-white/90 font-medium leading-relaxed mb-8">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src={t.image} 
                  alt={t.author} 
                  className="w-14 h-14 rounded-full object-cover border border-white/20"
                />
                <div>
                  <h4 className="font-bold text-white">{t.author}, {t.age}</h4>
                  <p className="text-xs text-white/50">{t.location}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-secondary fill-secondary" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Left/Right Fade Overlays */}
        <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};
