import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, MessageCircle } from 'lucide-react';

const messages = [
  { id: 1, sender: 'Sarah', text: "Hey! I saw you love traveling.", delay: 1500 },
  { id: 2, sender: 'You', text: "Yeah! What's your favorite destination?", delay: 3500 },
  { id: 3, sender: 'Sarah', text: "Definitely Darjeeling ☕", delay: 5500 },
];

export const ChatSimulation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    if (isInView) {
      let timeouts: ReturnType<typeof setTimeout>[] = [];
      
      messages.forEach((msg) => {
        if (msg.sender === 'Sarah') {
          timeouts.push(setTimeout(() => setIsTyping(true), msg.delay - 800));
        }

        timeouts.push(setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, msg.id]);
        }, msg.delay));
      });

      // Show suggestion chip after all messages
      timeouts.push(setTimeout(() => {
        setShowSuggestion(true);
      }, 7000));

      return () => timeouts.forEach(clearTimeout);
    }
  }, [isInView]);

  return (
    <section className="py-24 relative z-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        
        <div className="flex-1 w-full max-w-sm" ref={ref}>
          <div className="glass-card rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-surface/80 backdrop-blur-xl">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/5">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80" 
                  alt="Sarah" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Sarah</h4>
                <p className="text-xs text-white/50">Online</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 h-[320px] flex flex-col gap-4 overflow-y-auto hide-scrollbar">
              <AnimatePresence>
                {visibleMessages.map(id => {
                  const msg = messages.find(m => m.id === id)!;
                  const isYou = msg.sender === 'You';
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        isYou 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white self-end rounded-br-sm' 
                          : 'bg-white/10 text-white/90 self-start rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </motion.div>
                  );
                })}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="self-start bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1"
                  >
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggestion Chip */}
              <AnimatePresence>
                {showSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-auto self-center"
                  >
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all text-sm font-medium">
                      <MessageCircle size={16} />
                      Ask about her favorite travel destination
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/5 bg-white/5">
            <div className="flex gap-2">
              <button className="p-3 rounded-full glass text-primary hover:bg-white/10 transition-colors" title="AI Suggestion">
                <Sparkles size={20} />
              </button>
              <div className="flex-1 glass rounded-full px-4 py-3 text-white/50 text-sm flex items-center border border-white/10">
                Type a message...
              </div>
              <button className="p-3 rounded-full bg-primary text-white hover:bg-pink-600 transition-colors">
                <Send size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
