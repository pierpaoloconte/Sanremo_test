'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import SessionShell, { getStoredSession } from '@/components/SessionShell';
import type { SingerWithVote } from '@/components/api-types';

const categories = ['look', 'performance', 'song'] as const;
type Category = (typeof categories)[number];
type DraftVote = Record<Category, number | null>;

export default function VotePage() {
  const [singers, setSingers] = useState<SingerWithVote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, 'saved' | 'unsaved' | 'saving'>>({});
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const singersRef = useRef<SingerWithVote[]>([]);

  useEffect(() => {
    const session = getStoredSession();
    if (!session) return;

    const load = async () => {
      try {
        const response = await fetch(`/api/singers?room=${session.roomId}`);
        if (!response.ok) throw new Error('Impossibile caricare i cantanti');
        const data = (await response.json()) as { singers: SingerWithVote[] };
        setSingers(data.singers);
        singersRef.current = data.singers;
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Errore');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const votedCount = useMemo(
    () => singers.filter((s) => s.vote?.look && s.vote.performance && s.vote.song).length,
    [singers]
  );

  const saveVote = async (singerId: string, draft: DraftVote) => {
    const session = getStoredSession();
    if (!session) return;

    setStatus((prev) => ({ ...prev, [singerId]: 'saving' }));

    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: session.roomId,
        participantId: session.participantId,
        singerId,
        ...draft
      })
    });

    if (!response.ok) {
      setStatus((prev) => ({ ...prev, [singerId]: 'unsaved' }));
      return;
    }

    const updated = (await response.json()) as { vote: SingerWithVote['vote'] };

    setSingers((prev) => {
      const next = prev.map((singer) => (singer.id === singerId ? { ...singer, vote: updated.vote } : singer));
      singersRef.current = next;
      return next;
    });
    setStatus((prev) => ({ ...prev, [singerId]: 'saved' }));
  };

  const updateVoteField = (singerId: string, category: Category, value: number) => {
    setSingers((prev) => {
      const next = prev.map((singer) => {
        if (singer.id !== singerId) return singer;
        const current = singer.vote ?? { look: null, performance: null, song: null, updatedAt: new Date().toISOString() };
        return {
          ...singer,
          vote: {
            ...current,
            [category]: value
          }
        };
      });
      singersRef.current = next;
      return next;
    });

    setStatus((prev) => ({ ...prev, [singerId]: 'unsaved' }));

    if (timersRef.current[singerId]) {
      clearTimeout(timersRef.current[singerId]);
    }

    timersRef.current[singerId] = setTimeout(() => {
      const singer = singersRef.current.find((item) => item.id === singerId);
      const draft: DraftVote = {
        look: singer?.vote?.look ?? null,
        performance: singer?.vote?.performance ?? null,
        song: singer?.vote?.song ?? null
      };
      void saveVote(singerId, draft);
    }, 450);
  };

  return (
    <SessionShell>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Votazione Cantanti</h1>
        <p className="text-sm text-slate-300">Progresso: {votedCount} / {singers.length} cantanti votati</p>

        {loading && <p>Caricamento...</p>}
        {error && <p className="text-rose-400">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {singers.map((singer) => (
            <article key={singer.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <h2 className="text-lg font-semibold">{singer.name}</h2>
              <p className="mb-3 text-sm text-slate-400">{singer.songTitle}</p>

              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category} className="block text-sm capitalize">
                    {category === 'performance' ? 'esibizione' : category}
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={(singer.vote?.[category] ?? 5).toString()}
                      onChange={(e) => updateVoteField(singer.id, category, Number(e.target.value))}
                      className="mt-1 w-full"
                    />
                    <span className="text-xs text-cyan-300">Valore: {singer.vote?.[category] ?? '-'}</span>
                  </label>
                ))}
              </div>

              <p className="mt-3 text-xs">
                {status[singer.id] === 'saved' && <span className="text-emerald-400">Salvato</span>}
                {status[singer.id] === 'saving' && <span className="text-amber-400">Salvataggio...</span>}
                {(!status[singer.id] || status[singer.id] === 'unsaved') && (
                  <span className="text-slate-400">Non salvato</span>
                )}
              </p>
            </article>
          ))}
        </div>
      </section>
    </SessionShell>
  );
}
