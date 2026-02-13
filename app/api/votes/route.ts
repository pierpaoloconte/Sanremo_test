import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { voteSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = voteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Payload voto non valido' }, { status: 400 });
    }

    const { roomId, participantId, singerId, look, performance, song } = parsed.data;

    const vote = await prisma.vote.upsert({
      where: {
        roomId_participantId_singerId: {
          roomId,
          participantId,
          singerId
        }
      },
      update: {
        look: look ?? null,
        performance: performance ?? null,
        song: song ?? null
      },
      create: {
        roomId,
        participantId,
        singerId,
        look: look ?? null,
        performance: performance ?? null,
        song: song ?? null
      }
    });

    return NextResponse.json({
      vote: {
        look: vote.look,
        performance: vote.performance,
        song: vote.song,
        updatedAt: vote.updatedAt
      }
    });
  } catch {
    return NextResponse.json({ error: 'Errore salvataggio voto' }, { status: 500 });
  }
}
