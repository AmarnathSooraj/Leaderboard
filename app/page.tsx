export const dynamic = 'force-dynamic';
import { HeroTitle } from '@/components/HeroTitle';
import { LeaderboardItem } from '@/components/LeaderboardItem';
import { motion } from 'framer-motion';
import { use } from 'react';

type SheetResult = {
  cols: string[];
  rows: (string | number | null)[][];
};

async function fetchSheet(): Promise<SheetResult> {
  const SHEET_ID = process.env.GSHEET_ID!;
  const GID = process.env.GSHEET_GID ?? '0';

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${GID}&tqx=out:json`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet (${res.status})`);
  }

  const text = await res.text();

  const json = JSON.parse(
    text.substring(
      text.indexOf('{'),
      text.lastIndexOf('}') + 1
    )
  );

  const nCols = (json.table?.cols ?? []).length;
  const cols: string[] = Array.from({ length: nCols }, (_, i) => `Col ${i + 1}`);

  const rows: (string | number | null)[][] =
    (json.table?.rows ?? []).map((r: any) =>
      (r.c ?? []).map((c: any) => c?.f ?? c?.v ?? null)
    );

  return { cols, rows };
}

function projectData(
  cols: string[],
  rows: (string | number | null)[][],
  spec: string | undefined
): SheetResult {
  if (!spec) return { cols, rows };

  const tokens = spec
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  if (tokens.length === 0) return { cols, rows };

  const nameToIndex = new Map<string, number>();
  cols.forEach((c, i) => nameToIndex.set(c.trim().toLowerCase(), i));

  const indices = Array.from(new Set(tokens.map(t => {
    if (/^\d+$/.test(t)) {
      const idx = parseInt(t, 10) - 1;
      return idx;
    }
    const byName = nameToIndex.get(t.toLowerCase());
    return byName ?? -1;
  }))).filter(i => i >= 0 && i < cols.length);

  if (indices.length === 0) return { cols, rows };

  const projectedCols = indices.map(i => cols[i] || `Col ${i + 1}`);
  const projectedRows = rows.map(r => indices.map(i => r[i] ?? null));

  return { cols: projectedCols, rows: projectedRows };
}

export default async function Home({
  searchParams,
}: {
  searchParams?: { cols?: string };
}) {
  let cols: string[] = [];
  let rows: (string | number | null)[][] = [];
  let fetchError: string | null = null;

  try {
    const sheet = await fetchSheet();
    cols = sheet.cols;
    rows = sheet.rows;
  } catch (error) {
    fetchError = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to load sheet', error);
  }

  const projectionSpec = searchParams?.cols ?? process.env.PROJECTION_COLS;
  const projected = projectData(cols, rows, projectionSpec);

  const sortedRows = [...projected.rows].sort((a, b) => {
    const karmaA = Number(a[3]) || 0;
    const karmaB = Number(b[3]) || 0;
    return karmaB - karmaA;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f9fdff] via-[#e9f0ff] to-[#c4d9ff] text-black pb-10 font-comfortaa">
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

        {/* Table Header */}
        <div className="flex justify-between items-center px-5 py-3 mb-2 text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-12 text-center">Rank</span>
            <span>Participant</span>
          </div>
          <span>Details</span>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2 p-4 border border-white rounded-xl">
          {sortedRows.length === 0 ? (
            <div className="p-10 text-center rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-lg text-slate-300">No data found.</p>
              {fetchError ? (
                <p className="mt-2 text-sm text-slate-500">
                  Unable to fetch leaderboard data: {fetchError}
                </p>
              ) : projectionSpec ? (
                <p className="mt-2 text-sm text-slate-500">
                  Try adjusting the ?cols=... parameter or check your sheet.
                </p>
              ) : null}
            </div>
          ) : (
            sortedRows.map((r, i) => (
              <LeaderboardItem key={i} row={r} index={i} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
