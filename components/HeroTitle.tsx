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
        className="text-4xl sm:text-5xl md:text-7xl mb-2 font-bold tracking-tight text-[#163361]"
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
        className="mt-3 text-sm sm:text-base md:text-xl text-[#163361]/70 max-w-2xl px-4"
      >
        Track your progress and rise through the ranks at <span className="font-bold text-[#163361]/90">MuLearn CEV</span>.
      </motion.p>

    </div>
  );
}
