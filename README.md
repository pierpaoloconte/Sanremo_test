# Sanremo Voting Room

Web app full-stack responsive per creare una stanza e votare i cantanti del Festival di Sanremo.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite
- API route handlers Next.js con validazione Zod

## Setup locale
1. Installazione dipendenze:
   ```bash
   npm install
   ```
2. Genera il client Prisma:
   ```bash
   npm run prisma:generate
   ```
3. Esegui migrazione (crea DB SQLite):
   ```bash
   npm run prisma:migrate -- --name init
   ```
4. Seed cantanti di default:
   ```bash
   npm run prisma:seed
   ```
5. Avvio sviluppo:
   ```bash
   npm run dev
   ```

## API disponibili
- `POST /api/rooms/join`
- `GET /api/singers?room=<roomId>`
- `POST /api/votes`
- `GET /api/summary?room=<roomId>`

## Flusso funzionale
- Home: inserisci nome stanza + nome partecipante e premi **Entra**.
- Vota: per ogni cantante imposta look/esibizione/canzone (1-10), autosalvataggio con debounce.
- Riassunto: classifica aggregata per stanza con spareggi su canzone -> esibizione -> look.
