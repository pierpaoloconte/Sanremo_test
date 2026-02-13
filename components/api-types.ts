export type SingerWithVote = {
  id: string;
  name: string;
  songTitle: string;
  order: number;
  vote: {
    look: number | null;
    performance: number | null;
    song: number | null;
    updatedAt: string;
  } | null;
};

export type SummaryRow = {
  singerId: string;
  singerName: string;
  songTitle: string;
  avgLook: number;
  avgPerformance: number;
  avgSong: number;
  avgTotal: number;
  votersCount: number;
};
