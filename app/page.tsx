import { HeroTitle } from '@/components/HeroTitle';
import { LeaderboardList } from '@/components/LeaderboardList';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data: students, error } = await supabase
    .from('students')
    .select('fullname, level, muid, karma, joint_date')
    .order('karma', { ascending: false });

  if (error) {
    console.error('Error fetching students:', error);
  }

  const studentData = (students || []).map((s) => ({
    fullname: s.fullname,
    level: s.level,
    muid: s.muid,
    karma: s.karma,
    joint_date: s.joint_date
  }));

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f9fdff] via-[#e9f0ff] to-[#c4d9ff] text-black pb-10 font-comfortaa antialiased">
      <nav className='h-25 md:h-30 flex items-center justify-between mx-auto max-w-7xl py-6 px-4'>
          <p className="font-extrabold text-4xl sm:text-5xl bg-clip-text bg-linear-to-b from-[#6c67c4] to-[#3b82f6] text-transparent">
            μlearn
            <span className="block text-2xl md:text-3xl font-extrabold text-right -mt-3">
              cev
            </span>
          </p>
        <a
          href="https://app.mulearn.org/register"
         className='text-sm md:text-md bg-linear-to-b from-[#6c67c4] to-[#3b82f6] text-white py-3 px-4 font-bold rounded-full'>
          Join μlearn
        </a>
      </nav>
      <main className="max-w-5xl mx-auto pt-10 md:pt-14 px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-2">
          <HeroTitle />
        </div>

        {/* Leaderboard content */}
        <LeaderboardList students={studentData} />
      </main>
    </div>
  );
}
