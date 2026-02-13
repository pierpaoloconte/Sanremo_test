-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Participant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Singer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT,
    "name" TEXT NOT NULL,
    "songTitle" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "Singer_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "singerId" TEXT NOT NULL,
    "look" INTEGER,
    "performance" INTEGER,
    "song" INTEGER,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Vote_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vote_singerId_fkey" FOREIGN KEY ("singerId") REFERENCES "Singer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_roomId_name_key" ON "Participant"("roomId", "name");

-- CreateIndex
CREATE INDEX "Participant_roomId_idx" ON "Participant"("roomId");

-- CreateIndex
CREATE INDEX "Singer_roomId_idx" ON "Singer"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_roomId_participantId_singerId_key" ON "Vote"("roomId", "participantId", "singerId");

-- CreateIndex
CREATE INDEX "Vote_roomId_idx" ON "Vote"("roomId");
