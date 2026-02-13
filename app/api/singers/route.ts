import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { roomQuerySchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  const room = request.nextUrl.searchParams.get('room') ?? '';
  const parsed = roomQuerySchema.safeParse({ room });

  if (!parsed.success) {
    return NextResponse.json({ error: 'room mancante/non valida' }, { status: 400 });
  }

  const participantId = request.cookies.get('participantId')?.value;
  const sort = request.nextUrl.searchParams.get('sort') === 'alpha' ? 'alpha' : 'order';
  if (!participantId) {
    return NextResponse.json({ error: 'participant non trovato in cookie' }, { status: 401 });
  }

  const singers = await prisma.singer.findMany({
    where: { roomId: parsed.data.room },
    orderBy: sort === 'alpha' ? [{ name: 'asc' }] : [{ order: 'asc' }, { name: 'asc' }],
    include: {
      votes: {
        where: {
          roomId: parsed.data.room,
          participantId
        },
        take: 1
      }
    }
  });

  return NextResponse.json({
    singers: singers.map((singer) => ({
      id: singer.id,
      name: singer.name,
      songTitle: singer.songTitle,
      order: singer.order,
      vote: singer.votes[0]
        ? {
            look: singer.votes[0].look,
            performance: singer.votes[0].performance,
            song: singer.votes[0].song,
            updatedAt: singer.votes[0].updatedAt
          }
        : null
    }))
  });
}
