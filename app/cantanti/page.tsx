'use client';

import { useEffect, useState } from 'react';
import SessionShell, { getStoredSession } from '@/components/SessionShell';
import type { SingerWithVote } from '@/components/api-types';

export default function SingersPage() {
  const [singers, setSingers] = useState<SingerWithVote[]>([]);
  const [sort, setSort] = useState<'order' | 'alpha'>('order');

  useEffect(() => {
    const session = getStoredSession();
    if (!session) return;

    const load = async () => {
      const response = await fetch(`/api/singers?room=${session.roomId}&sort=${sort}`);
      const data = (await response.json()) as { singers: SingerWithVote[] };
      setSingers(data.singers);
    };

    void load();
  }, [sort]);

  return (
    <SessionShell>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Cantanti</h1>
        <div>
          <label className="text-sm">Ordina per: </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as 'order' | 'alpha')}
            className="ml-2 rounded border border-slate-700 bg-slate-900 px-2 py-1"
          >
            <option value="order">Ordine gara</option>
            <option value="alpha">Alfabetico</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {singers.map((singer) => (
            <article key={singer.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">#{singer.order}</p>
              <h2 className="font-semibold">{singer.name}</h2>
              <p className="text-sm text-slate-300">{singer.songTitle}</p>
            </article>
          ))}
        </div>
      </section>
    </SessionShell>
  );
}
