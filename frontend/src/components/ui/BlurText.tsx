import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export const BlurText: React.FC<BlurTextProps> = ({ text, className = '', delay = 0, once = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    },
  };

  const child: Variants = {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={child} className="mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
