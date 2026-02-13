import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultSingers = [
  { name: 'Alba Rossa', songTitle: 'Luci sul Mare' },
  { name: 'Bruno Vega', songTitle: 'Notte Elettrica' },
  { name: 'Chiara Blu', songTitle: 'Sospesa' },
  { name: 'Dario Nova', songTitle: 'Senza Rete' },
  { name: 'Elisa Vento', songTitle: 'Stelle Cadenti' },
  { name: 'Fabio Luna', songTitle: 'Un Altro Giorno' },
  { name: 'Greta Sole', songTitle: 'Cuore in Tasca' },
  { name: 'Hugo Mare', songTitle: 'Onde Lente' },
  { name: 'Irene Vox', songTitle: 'Di Nuovo Qui' },
  { name: 'Luca Prisma', songTitle: 'Polvere d\'Oro' },
  { name: 'Mara Sky', songTitle: 'Riflessi' },
  { name: 'Nico Storm', songTitle: 'Senza Paura' }
];

async function main() {
  const count = await prisma.singer.count({ where: { roomId: null } });

  if (count === 0) {
    await prisma.singer.createMany({
      data: defaultSingers.map((singer, index) => ({
        ...singer,
        order: index + 1,
        roomId: null
      }))
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
