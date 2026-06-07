import { prisma } from "@/lib/prisma";

export async function getTournament() {
  const tournament = await prisma.tournament.findFirst({
    where: { year: 2026 },
    include: {
      teams: { orderBy: { fifaRanking: "asc" } }
    }
  });

  if (!tournament) {
    throw new Error("Tournament data has not been seeded. Run npm run seed.");
  }

  return tournament;
}

export async function getPoolByJoinCode(joinCode: string) {
  return prisma.pool.findUnique({
    where: { joinCode: joinCode.toUpperCase() },
    include: {
      tournament: true,
      players: { orderBy: { joinedAt: "asc" } },
      draws: {
        orderBy: { drawNumber: "desc" },
        take: 1,
        include: {
          assignments: {
            include: { player: true, team: true },
            orderBy: [{ player: { joinedAt: "asc" } }, { rankingBand: "asc" }]
          },
          unassignedTeams: {
            include: { team: true },
            orderBy: { team: { fifaRanking: "asc" } }
          }
        }
      }
    }
  });
}

export async function getPoolByAdminCode(adminCode: string) {
  return prisma.pool.findUnique({
    where: { adminCode },
    include: {
      tournament: {
        include: {
          teams: { orderBy: { fifaRanking: "asc" } },
          fixtures: {
            include: { homeTeam: true, awayTeam: true, winnerTeam: true },
            orderBy: { matchNumber: "asc" }
          }
        }
      },
      players: { orderBy: { joinedAt: "asc" } },
      draws: {
        orderBy: { drawNumber: "desc" },
        take: 1,
        include: {
          assignments: {
            include: { player: true, team: true },
            orderBy: [{ player: { joinedAt: "asc" } }, { rankingBand: "asc" }]
          },
          unassignedTeams: {
            include: { team: true },
            orderBy: { team: { fifaRanking: "asc" } }
          }
        }
      }
    }
  });
}

export async function getFixtures() {
  return prisma.fixture.findMany({
    include: { homeTeam: true, awayTeam: true, winnerTeam: true },
    orderBy: { matchNumber: "asc" }
  });
}
