'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SessionShell, { getStoredSession, sessionKey } from '@/components/SessionShell';
import type { SessionData } from '@/components/types';

export default function HomePage() {
  const [roomName, setRoomName] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      router.replace('/vota');
    }
  }, [router]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName })
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? 'Errore durante ingresso in stanza');
      }

      const session = (await response.json()) as SessionData;
      localStorage.setItem(sessionKey, JSON.stringify(session));
      router.push('/vota');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionShell>
      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold">Sanremo Voting Room</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Nome stanza</span>
            <input
              required
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
              placeholder="es. amici-2026"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Il tuo nome</span>
            <input
              required
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
              placeholder="es. Giulia"
            />
          </label>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
          >
            {loading ? 'Ingresso...' : 'Entra'}
          </button>
        </form>
      </div>
    </SessionShell>
  );
}
