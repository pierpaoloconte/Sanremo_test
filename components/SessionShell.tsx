'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { SessionData } from './types';

const SESSION_KEY = 'sanremo-session';

export function getStoredSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export default function SessionShell({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const current = getStoredSession();
    setSession(current);
    if (!current && pathname !== '/') {
      router.replace('/');
    }
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = 'roomId=; Max-Age=0; path=/';
    document.cookie = 'participantId=; Max-Age=0; path=/';
    document.cookie = 'participantName=; Max-Age=0; path=/';
    router.push('/');
  };

  return (
    <div className="min-h-screen">
      {pathname !== '/' && session && (
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Stanza: {session.roomName}</p>
              <p className="font-semibold">Utente: {session.participantName}</p>
            </div>
            <nav className="flex items-center gap-2">
              <Link className="rounded bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600" href="/cantanti">
                Cantanti
              </Link>
              <Link className="rounded bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600" href="/vota">
                Vota
              </Link>
              <Link className="rounded bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600" href="/riassunto">
                Riassunto
              </Link>
              <button onClick={logout} className="rounded bg-rose-700 px-3 py-2 text-sm hover:bg-rose-600">
                Esci
              </button>
            </nav>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl p-4">{children}</main>
    </div>
  );
}

export const sessionKey = SESSION_KEY;
