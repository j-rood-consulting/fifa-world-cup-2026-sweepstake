-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "teamCount" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "flagCode" TEXT NOT NULL,
    "confederation" TEXT NOT NULL,
    "fifaRanking" INTEGER NOT NULL,
    "groupCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fixture" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "winnerTeamId" TEXT,
    "matchNumber" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "groupCode" TEXT,
    "venue" TEXT,
    "city" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fixture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "adminCode" TEXT NOT NULL,
    "joinCode" TEXT NOT NULL,
    "setupMode" TEXT NOT NULL DEFAULT 'quick',
    "playerCap" INTEGER,
    "minimumPlayers" INTEGER NOT NULL DEFAULT 2,
    "drawDeadline" TIMESTAMP(3),
    "drawStatus" TEXT NOT NULL DEFAULT 'waiting',
    "drawStartedAt" TIMESTAMP(3),
    "drawCompletedAt" TIMESTAMP(3),
    "allowPlayerLeave" BOOLEAN NOT NULL DEFAULT true,
    "allowPlayerNameEdit" BOOLEAN NOT NULL DEFAULT true,
    "showPlayerListBeforeDraw" BOOLEAN NOT NULL DEFAULT true,
    "resultsVisibility" TEXT NOT NULL DEFAULT 'public_after_draw',
    "paymentEnabled" BOOLEAN NOT NULL DEFAULT false,
    "entryFeeAmount" TEXT,
    "currency" TEXT,
    "paymentAccountHolder" TEXT,
    "paymentBankName" TEXT,
    "paymentAccountNumber" TEXT,
    "paymentBranchCode" TEXT,
    "paymentReference" TEXT,
    "paymentNote" TEXT,
    "prizeStructureJson" TEXT,
    "rulesNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "paidStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "hasViewedReveal" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Draw" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "drawNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'complete',
    "algorithmVersion" TEXT NOT NULL,
    "randomSeedHash" TEXT NOT NULL,
    "createdByAdmin" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrawAssignment" (
    "id" TEXT NOT NULL,
    "drawId" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "rankingBand" INTEGER NOT NULL,
    "revealOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DrawAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnassignedTeam" (
    "id" TEXT NOT NULL,
    "drawId" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnassignedTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "actorId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventPayload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_year_key" ON "Tournament"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Team_tournamentId_name_key" ON "Team"("tournamentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Fixture_tournamentId_matchNumber_key" ON "Fixture"("tournamentId", "matchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Pool_adminCode_key" ON "Pool"("adminCode");

-- CreateIndex
CREATE UNIQUE INDEX "Pool_joinCode_key" ON "Pool"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "Player_poolId_accessCode_key" ON "Player"("poolId", "accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "Draw_poolId_drawNumber_key" ON "Draw"("poolId", "drawNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DrawAssignment_drawId_teamId_key" ON "DrawAssignment"("drawId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "UnassignedTeam_drawId_teamId_key" ON "UnassignedTeam"("drawId", "teamId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_winnerTeamId_fkey" FOREIGN KEY ("winnerTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pool" ADD CONSTRAINT "Pool_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Draw" ADD CONSTRAINT "Draw_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrawAssignment" ADD CONSTRAINT "DrawAssignment_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrawAssignment" ADD CONSTRAINT "DrawAssignment_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrawAssignment" ADD CONSTRAINT "DrawAssignment_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrawAssignment" ADD CONSTRAINT "DrawAssignment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnassignedTeam" ADD CONSTRAINT "UnassignedTeam_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnassignedTeam" ADD CONSTRAINT "UnassignedTeam_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnassignedTeam" ADD CONSTRAINT "UnassignedTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

