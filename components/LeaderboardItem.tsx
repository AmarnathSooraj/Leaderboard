'use client';

import { motion } from 'framer-motion';

interface LeaderboardItemProps {
  row: (string | number | null)[];
  index: number;
}

export function LeaderboardItem({ row, index }: LeaderboardItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
      transition={{ 
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1], // Custom cubic-bezier for smoother feel
        layout: { type: "spring", stiffness: 350, damping: 35 }
      }}
      whileHover={{ 
        scale: 1.01,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.99 }}
      className="flex flex-row justify-between items-center gap-2 px-3 py-4 rounded-xl border border-white/40 backdrop-blur-md bg-white/10 transition-shadow duration-200 hover:shadow-md antialiased transform-gpu"
    >
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <span className="text-lg md:text-xl font-bold w-10 md:w-12 text-center text-[#163361] shrink-0">
          {index + 1}
        </span>
        <div className="flex flex-col min-w-0">
          <p className="text-sm md:text-lg font-bold font-inter text-[#23467e] truncate pr-2">
            {row[0] == null ? '—' : String(row[0])}
          </p>
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-xs md:text-base font-semibold text-[#25549e] whitespace-nowrap">
              {row[3] == null ? '0' : Number(row[3]).toLocaleString()} <span className="text-[#255299]/70 text-[10px] md:text-xs">Karma</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex flex-col items-end mr-4">
          <p className="text-xs font-bold text-[#163361]/60 uppercase tracking-widest">MUID</p>
          <p className="text-sm font-mono font-medium text-[#163361]">
            {row[1] == null ? '—' : String(row[1])}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#163361] text-white px-3 py-1 rounded-lg min-w-[56px] md:min-w-[64px] shadow-lg shadow-blue-900/10">
          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Level</span>
          <span className="text-lg md:text-xl font-black leading-none">{row[4]}</span>
        </div>
      </div>
    </motion.div>
  );
}