'use client';

import { useEffect, useState } from 'react';
import SessionShell, { getStoredSession } from '@/components/SessionShell';
import type { SummaryRow } from '@/components/api-types';

export default function SummaryPage() {
  const [rows, setRows] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getStoredSession();
    if (!session) return;

    const load = async () => {
      try {
        const response = await fetch(`/api/summary?room=${session.roomId}`);
        if (!response.ok) throw new Error('Errore caricamento riassunto');
        const data = (await response.json()) as { summary: SummaryRow[] };
        setRows(data.summary);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Errore');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <SessionShell>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Classifica stanza</h1>
        {loading && <p>Caricamento...</p>}
        {error && <p className="text-rose-400">{error}</p>}

        <div className="hidden overflow-x-auto rounded-xl border border-slate-800 md:block">
          <table className="min-w-full bg-slate-900 text-sm">
            <thead className="bg-slate-800 text-left text-slate-200">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Cantante</th>
                <th className="px-3 py-2">Brano</th>
                <th className="px-3 py-2">Look</th>
                <th className="px-3 py-2">Esibizione</th>
                <th className="px-3 py-2">Canzone</th>
                <th className="px-3 py-2">Totale</th>
                <th className="px-3 py-2">Votanti</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.singerId} className="border-t border-slate-800">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2 font-semibold">{row.singerName}</td>
                  <td className="px-3 py-2 text-slate-300">{row.songTitle}</td>
                  <td className="px-3 py-2">{row.avgLook.toFixed(2)}</td>
                  <td className="px-3 py-2">{row.avgPerformance.toFixed(2)}</td>
                  <td className="px-3 py-2">{row.avgSong.toFixed(2)}</td>
                  <td className="px-3 py-2 text-cyan-300">{row.avgTotal.toFixed(2)}</td>
                  <td className="px-3 py-2">{row.votersCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 md:hidden">
          {rows.map((row, index) => (
            <article key={row.singerId} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-sm text-cyan-300">#{index + 1}</p>
              <h2 className="font-semibold">{row.singerName}</h2>
              <p className="text-sm text-slate-400">{row.songTitle}</p>
              <p className="mt-2 text-sm">Totale: {row.avgTotal.toFixed(2)}</p>
              <p className="text-xs text-slate-400">
                Look {row.avgLook.toFixed(2)} · Esibizione {row.avgPerformance.toFixed(2)} · Canzone {row.avgSong.toFixed(2)}
              </p>
              <p className="text-xs text-slate-400">Votanti: {row.votersCount}</p>
            </article>
          ))}
        </div>
      </section>
    </SessionShell>
  );
}
