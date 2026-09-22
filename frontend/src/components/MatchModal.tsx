import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchData: {
    name: string;
    photo: string;
    matchId: string;
  } | null;
  currentUserPhoto: string;
}

export default function MatchModal({ isOpen, onClose, matchData, currentUserPhoto }: MatchModalProps) {
  const navigate = useNavigate();

  if (!isOpen || !matchData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center w-full max-w-md text-center">
          
          <motion.div 
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="flex items-center justify-center mb-8 relative"
          >
            {/* Left Photo (You) */}
            <motion.div
              initial={{ x: -100, rotate: -15 }}
              animate={{ x: 20, rotate: -5 }}
              transition={{ type: "spring", damping: 15, delay: 0.4 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-2xl overflow-hidden relative z-10"
            >
              <img src={currentUserPhoto} alt="You" className="w-full h-full object-cover" />
            </motion.div>

            {/* Right Photo (Them) */}
            <motion.div
              initial={{ x: 100, rotate: 15 }}
              animate={{ x: -20, rotate: 5 }}
              transition={{ type: "spring", damping: 15, delay: 0.4 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-2xl overflow-hidden relative"
            >
              <img src={matchData.photo} alt={matchData.name} className="w-full h-full object-cover" />
            </motion.div>

            {/* Floating Heart */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute z-20 bg-primary w-16 h-16 rounded-full flex items-center justify-center shadow-xl shadow-primary/30"
            >
              <Heart size={32} className="text-white" fill="white" />
            </motion.div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2"
          >
            It's a Match!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-400 mb-8"
          >
            You and <span className="text-primary font-semibold">{matchData.name}</span> liked each other.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="w-full space-y-4"
          >
            <button 
              onClick={() => {
                onClose();
                navigate(`/messages/${matchData.matchId}`);
              }}
              className="w-full py-4 rounded-full bg-primary hover:bg-pink-600 text-white font-bold text-lg flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            >
              <MessageCircle size={20} /> Send a Message
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg transition"
            >
              Keep Discovering
            </button>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
