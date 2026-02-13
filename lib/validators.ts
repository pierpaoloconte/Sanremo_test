import { z } from 'zod';

export const joinRoomSchema = z.object({
  roomName: z.string().trim().min(1).max(50),
  participantName: z.string().trim().min(1).max(50)
});

export const roomQuerySchema = z.object({
  room: z.string().trim().min(1)
});

export const voteSchema = z.object({
  roomId: z.string().trim().min(1),
  participantId: z.string().trim().min(1),
  singerId: z.string().trim().min(1),
  look: z.number().int().min(1).max(10).nullable().optional(),
  performance: z.number().int().min(1).max(10).nullable().optional(),
  song: z.number().int().min(1).max(10).nullable().optional()
});
