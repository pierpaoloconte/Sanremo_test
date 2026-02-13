import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { roomQuerySchema } from '@/lib/validators';

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return values.reduce((acc, current) => acc + current, 0) / values.length;
};

export async function GET(request: NextRequest) {
  const room = request.nextUrl.searchParams.get('room') ?? '';
  const parsed = roomQuerySchema.safeParse({ room });

  if (!parsed.success) {
    return NextResponse.json({ error: 'room mancante/non valida' }, { status: 400 });
  }

  const singers = await prisma.singer.findMany({
    where: { roomId: parsed.data.room },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    include: {
      votes: {
        where: {
          roomId: parsed.data.room,
          look: { not: null },
          performance: { not: null },
          song: { not: null }
        }
      }
    }
  });

  const summary = singers
    .map((singer) => {
      const looks = singer.votes.map((v) => v.look as number);
      const performances = singer.votes.map((v) => v.performance as number);
      const songs = singer.votes.map((v) => v.song as number);

      const avgLook = average(looks);
      const avgPerformance = average(performances);
      const avgSong = average(songs);
      const avgTotal = average([avgLook, avgPerformance, avgSong]);

      return {
        singerId: singer.id,
        singerName: singer.name,
        songTitle: singer.songTitle,
        avgLook,
        avgPerformance,
        avgSong,
        avgTotal,
        votersCount: singer.votes.length
      };
    })
    .sort((a, b) => {
      if (b.avgTotal !== a.avgTotal) return b.avgTotal - a.avgTotal;
      if (b.avgSong !== a.avgSong) return b.avgSong - a.avgSong;
      if (b.avgPerformance !== a.avgPerformance) return b.avgPerformance - a.avgPerformance;
      return b.avgLook - a.avgLook;
    });

  return NextResponse.json({ summary });
}
