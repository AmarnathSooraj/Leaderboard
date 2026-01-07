export const dynamic = 'force-dynamic';

import { LeaderboardItem } from './components/LeaderboardItem';

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
  searchParams
}: {
  searchParams?: { cols?: string }
}) {
  const { cols, rows } = await fetchSheet();

  const projectionSpec = searchParams?.cols ?? process.env.PROJECTION_COLS;
  const projected = projectData(cols, rows, projectionSpec);

  const sortedRows = [...projected.rows].sort((a, b) => {
    const karmaA = Number(a[3]) || 0;
    const karmaB = Number(b[3]) || 0;
    return karmaB - karmaA;
  });

  return (
    <div className="min-h-screen bg-[#121d29]">
      <main className="max-w-4xl mx-auto pt-18 px-4">
        {/* Header */}
        <div className=" text-center">
          <div className="flex items-center gap-3 mb-2 justify-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              Mulearn CEV Leaderboard
            </h1>
          </div>
        </div>

        {/* Table Header */}
        <div className="flex justify-between items-center px-5 py-3 mb-2 text-sm font-medium text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-12 text-center">Rank</span>
            <span>Participant</span>
          </div>
          <span>Details</span>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2">
          {sortedRows.length === 0 ? (
            <div className="p-10 text-center rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-lg text-slate-300">No data found.</p>
              {projectionSpec && (
                <p className="mt-2 text-sm text-slate-500">
                  Try adjusting the ?cols=... parameter or check your sheet.
                </p>
              )}
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
