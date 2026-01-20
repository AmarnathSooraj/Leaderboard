'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeaderboardItem } from './LeaderboardItem';

interface Student {
  fullname: string | null;
  level: string | null;
  muid: string | null;
  karma: number | null;
  joint_date: string | null;
}

interface LeaderboardListProps {
  students: Student[];
}

export function LeaderboardList({ students }: LeaderboardListProps) {
  const [filter, setFilter] = useState<'all' | 'new'>('all');

  const filteredStudents = useMemo(() => {
    if (filter === 'all') return students;
    
    // Filter students who joined from 15/1/2026
    const cutoffDate = new Date('2026-01-15T00:00:00Z');
    return students.filter(student => {
      if (!student.joint_date) return false;
      return new Date(student.joint_date) >= cutoffDate;
    });
  }, [students, filter]);

  return (
    <>
      {/* Filter Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center mb-10"
      >
        <div className="mt-3 relative flex p-1.5 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl overflow-hidden">
          <motion.div
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            animate={{
              x: filter === 'all' ? 0 : '100%'
            }}
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-linear-to-b from-[#6c67c4] to-[#3b82f6] rounded-[14px] shadow-sm z-0"
          />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setFilter('all')}
            className={`relative z-10 w-40 md:w-52 py-2.5 text-sm md:text-base font-bold transition-colors duration-300 ${
              filter === 'all' ? 'text-white' : 'text-slate-600 hover:text-[#163361]'
            }`}
          >
            Overall Leaderboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setFilter('new')}
            className={`relative z-10 w-40 md:w-52 py-2.5 text-sm md:text-base font-bold transition-colors duration-300 ${
              filter === 'new' ? 'text-white' : 'text-slate-600 hover:text-[#163361]'
            }`}
          >
            Karma Sprint
          </motion.button>
        </div>
      </motion.div>

      {/* Table Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-between items-center px-4 md:px-5 py-3 mb-2 text-[10px] md:text-sm font-bold text-[#163361]/50 uppercase tracking-widest"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <span className="w-10 md:w-12 text-center">Rank</span>
          <span>Participant</span>
        </div>
        <span className="pr-4 md:pr-0">Level</span>
      </motion.div>

      {/* Leaderboard List */}
      <motion.div 
        key={filter}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-2 p-2 md:p-4 border border-white rounded-xl bg-white/40 shadow-sm overflow-hidden antialiased"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredStudents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-10 text-center rounded-lg bg-white/20 border border-white/40 shadow-sm"
            >
              <p className="text-lg font-medium text-[#163361]/70">No data found for this filter.</p>
            </motion.div>
          ) : (
            filteredStudents.map((student, i) => (
              <LeaderboardItem 
                key={student.muid || i} 
                row={[
                  student.fullname,   // row[0]
                  student.muid,       // row[1]
                  student.muid,       // row[2] (using muid as secondary identifier on mobile)
                  student.karma,      // row[3]
                  student.level       // row[4]
                ]} 
                index={i} 
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
