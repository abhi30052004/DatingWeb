import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  rotationIntensity?: number;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = '',
  rotationIntensity = 15,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(y, [-0.5, 0.5], [rotationIntensity, -rotationIntensity]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-rotationIntensity, rotationIntensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      <div
        style={{ transform: 'translateZ(50px)' }}
        className="w-full h-full"
      >
        {children}
      </div>
    </motion.div>
  );
};
