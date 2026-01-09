'use client';

import { motion } from 'framer-motion';

interface LeaderboardItemProps {
  row: (string | number | null)[];
  index: number;
}

export function LeaderboardItem({ row, index }: LeaderboardItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={`flex justify-between items-center px-2 py-4 rounded-lg border border-white/40 backdrop-blur-xl bg-white/5 transition-colors duration-200 hover:bg-white/10 hover:border-white/50`}
    >
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold w-12 text-center text-[#163361]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex flex-col">
          <p className="text-md md:text-xl font-semibold font-inter text-[#23467e]">
            {row[0] == null ? '—' : String(row[0])}
          </p>
          <p className="text-base text-[#25549e]">
            {row[3] == null ? '0' : String(row[3])} <span className="text-[#255299]">Karma</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 text-right">
        <p className="text-base text-[#26539b]">
          {row[1] == null ? '—' : String(row[1])}
        </p>
        <p className="text-sm text-[#23529c]">
          {row[2] == null ? '—' : String(row[2])}
        </p>
      </div>
    </motion.div>
  );
}