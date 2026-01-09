'use client';

import { motion } from 'framer-motion';

export function HeroTitle() {
  return (
    <div className="flex flex-col items-center justify-center leading-tight text-center">
      
      {/* Main Title */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-4xl md:text-7xl mb-2 font-semibold"
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

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        className="mt-1 text-md sm:text-lg md:text-xl text-gray-800"
      >
        Track your progress and rise through the ranks at MuLearn College of Engineering, Vadakara.
      </motion.p>

    </div>
  );
}
