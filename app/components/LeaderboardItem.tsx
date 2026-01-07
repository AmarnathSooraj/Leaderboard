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
      className={`flex justify-between items-center px-5 py-4 rounded-lg border transition-colors duration-200 ${
        index === 0
          ? 'bg-slate-800 border-slate-500 shadow-lg'
          : index === 1
          ? 'bg-slate-800/90 border-slate-600'
          : index === 2
          ? 'bg-slate-800/80 border-slate-600'
          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800/80 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`text-xl font-bold w-12 text-center ${
            index === 0
              ? 'text-slate-100'
              : index === 1
              ? 'text-slate-200'
              : index === 2
              ? 'text-slate-300'
              : 'text-slate-500'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex flex-col">
          <p className={`text-lg font-semibold ${
            index < 3 ? 'text-slate-100' : 'text-slate-200'
          }`}>
            {row[0] == null ? '—' : String(row[0])}
          </p>
          <p className="text-slate-400 text-base">
            {row[3] == null ? '0' : String(row[3])} <span className="text-slate-500">Karma</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 text-right">
        <p className="text-base text-slate-300">
          {row[1] == null ? '—' : String(row[1])}
        </p>
        <p className="text-sm text-slate-500">
          {row[2] == null ? '—' : String(row[2])}
        </p>
      </div>
    </motion.div>
  );
}