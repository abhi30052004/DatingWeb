import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';

export interface SwipeCardProps {
  children: React.ReactNode;
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const SwipeCard = ({ children, onSwipe, className = '', disabled = false, style = {} }: SwipeCardProps) => {
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Like (Right) overlay opacity
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  // Pass (Left) overlay opacity
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);
  // Super Like (Up) overlay opacity
  const superLikeOpacity = useTransform(y, [-20, -100], [0, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return;
    
    if (info.offset.x > 100) {
      setExitX(1000);
      onSwipe?.('right');
    } else if (info.offset.x < -100) {
      setExitX(-1000);
      onSwipe?.('left');
    } else if (info.offset.y < -100) {
      setExitY(-1000);
      onSwipe?.('up');
    }
  };

  return (
    <motion.div
      drag={!disabled}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, opacity, ...style }}
      animate={{ x: exitX, y: exitY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
      className={`absolute w-full h-full cursor-grab overflow-hidden rounded-3xl will-change-transform shadow-2xl ${className}`}
    >
      {/* Overlays */}
      <motion.div 
        style={{ opacity: likeOpacity }} 
        className="absolute top-10 left-10 z-50 border-4 border-green-500 text-green-500 rounded-lg px-4 py-2 font-black text-4xl transform -rotate-12 pointer-events-none"
      >
        LIKE
      </motion.div>
      <motion.div 
        style={{ opacity: passOpacity }} 
        className="absolute top-10 right-10 z-50 border-4 border-red-500 text-red-500 rounded-lg px-4 py-2 font-black text-4xl transform rotate-12 pointer-events-none"
      >
        PASS
      </motion.div>
      <motion.div 
        style={{ opacity: superLikeOpacity }} 
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50 border-4 border-blue-400 text-blue-400 rounded-lg px-4 py-2 font-black text-4xl pointer-events-none"
      >
        SUPER LIKE
      </motion.div>

      {children}
    </motion.div>
  );
};
