import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { joinRoomSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = joinRoomSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Input non valido' }, { status: 400 });
    }

    const roomName = parsed.data.roomName.trim();
    const participantName = parsed.data.participantName.trim();

    const room =
      (await prisma.room.findUnique({ where: { name: roomName } })) ||
      (await prisma.room.create({ data: { name: roomName } }));

    let participant = await prisma.participant.findUnique({
      where: {
        roomId_name: {
          roomId: room.id,
          name: participantName
        }
      }
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          roomId: room.id,
          name: participantName
        }
      });
    }

    const response = NextResponse.json({
      roomId: room.id,
      roomName: room.name,
      participantId: participant.id,
      participantName: participant.name
    });

    const cookieAge = 60 * 60 * 24 * 30;
    response.cookies.set('roomId', room.id, { path: '/', maxAge: cookieAge });
    response.cookies.set('participantId', participant.id, { path: '/', maxAge: cookieAge });
    response.cookies.set('participantName', participant.name, { path: '/', maxAge: cookieAge });

    const roomSingersCount = await prisma.singer.count({ where: { roomId: room.id } });
    const globalSingers = await prisma.singer.findMany({ where: { roomId: null } });

    if (roomSingersCount === 0 && globalSingers.length > 0) {
      await prisma.singer.createMany({
        data: globalSingers.map((s) => ({
          roomId: room.id,
          name: s.name,
          songTitle: s.songTitle,
          order: s.order
        }))
      });
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Errore server join room' }, { status: 500 });
  }
}
