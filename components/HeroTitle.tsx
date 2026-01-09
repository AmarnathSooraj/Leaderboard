'use client';

import { motion } from 'framer-motion';

export function HeroTitle() {
  return (
    <div className="flex flex-col text-4xl md:text-7xl font-semibold items-center leading-tight justify-center">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Lead your way{' '}
        <motion.span
          className="text-[#3b82f6]"
          animate={{ color: ['#3b82f6', '#6c67c4', '#3b82f6'] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          to the top
        </motion.span>
      </motion.p>
    </div>
  );
}