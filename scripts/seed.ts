import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const groups = {
  A: ["Mexico", "South Africa", "Korea Republic", "Czechia"],
  B: ["Canada", "Switzerland", "Qatar", "Bosnia and Herzegovina"],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["United States", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Curaçao", "Côte d'Ivoire", "Ecuador"],
  F: ["Netherlands", "Japan", "Tunisia", "Sweden"],
  G: ["Belgium", "Egypt", "IR Iran", "New Zealand"],
  H: ["Spain", "Cabo Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Norway", "Iraq"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "Uzbekistan", "Colombia", "Congo DR"],
  L: ["England", "Croatia", "Ghana", "Panama"]
} as const;

const teamMeta: Record<string, { flag: string; iso: string; confed: string; rank: number }> = {
  Argentina: { flag: "ar", iso: "ARG", confed: "CONMEBOL", rank: 1 },
  Spain: { flag: "es", iso: "ESP", confed: "UEFA", rank: 2 },
  France: { flag: "fr", iso: "FRA", confed: "UEFA", rank: 3 },
  England: { flag: "gb-eng", iso: "ENG", confed: "UEFA", rank: 4 },
  Portugal: { flag: "pt", iso: "POR", confed: "UEFA", rank: 5 },
  Brazil: { flag: "br", iso: "BRA", confed: "CONMEBOL", rank: 6 },
  Morocco: { flag: "ma", iso: "MAR", confed: "CAF", rank: 7 },
  Netherlands: { flag: "nl", iso: "NED", confed: "UEFA", rank: 8 },
  Belgium: { flag: "be", iso: "BEL", confed: "UEFA", rank: 9 },
  Germany: { flag: "de", iso: "GER", confed: "UEFA", rank: 10 },
  Croatia: { flag: "hr", iso: "CRO", confed: "UEFA", rank: 11 },
  Colombia: { flag: "co", iso: "COL", confed: "CONMEBOL", rank: 13 },
  Mexico: { flag: "mx", iso: "MEX", confed: "CONCACAF", rank: 14 },
  Senegal: { flag: "sn", iso: "SEN", confed: "CAF", rank: 15 },
  "United States": { flag: "us", iso: "USA", confed: "CONCACAF", rank: 16 },
  Uruguay: { flag: "uy", iso: "URU", confed: "CONMEBOL", rank: 17 },
  Japan: { flag: "jp", iso: "JPN", confed: "AFC", rank: 18 },
  Switzerland: { flag: "ch", iso: "SUI", confed: "UEFA", rank: 19 },
  "IR Iran": { flag: "ir", iso: "IRN", confed: "AFC", rank: 20 },
  Türkiye: { flag: "tr", iso: "TUR", confed: "UEFA", rank: 22 },
  Austria: { flag: "at", iso: "AUT", confed: "UEFA", rank: 23 },
  Ecuador: { flag: "ec", iso: "ECU", confed: "CONMEBOL", rank: 24 },
  "Korea Republic": { flag: "kr", iso: "KOR", confed: "AFC", rank: 25 },
  Australia: { flag: "au", iso: "AUS", confed: "AFC", rank: 27 },
  Algeria: { flag: "dz", iso: "ALG", confed: "CAF", rank: 28 },
  Egypt: { flag: "eg", iso: "EGY", confed: "CAF", rank: 29 },
  Canada: { flag: "ca", iso: "CAN", confed: "CONCACAF", rank: 30 },
  Norway: { flag: "no", iso: "NOR", confed: "UEFA", rank: 31 },
  "Côte d'Ivoire": { flag: "ci", iso: "CIV", confed: "CAF", rank: 33 },
  Panama: { flag: "pa", iso: "PAN", confed: "CONCACAF", rank: 34 },
  Sweden: { flag: "se", iso: "SWE", confed: "UEFA", rank: 38 },
  Czechia: { flag: "cz", iso: "CZE", confed: "UEFA", rank: 39 },
  Paraguay: { flag: "py", iso: "PAR", confed: "CONMEBOL", rank: 40 },
  Scotland: { flag: "gb-sct", iso: "SCO", confed: "UEFA", rank: 43 },
  "Congo DR": { flag: "cd", iso: "COD", confed: "CAF", rank: 45 },
  Tunisia: { flag: "tn", iso: "TUN", confed: "CAF", rank: 46 },
  Uzbekistan: { flag: "uz", iso: "UZB", confed: "AFC", rank: 50 },
  Iraq: { flag: "iq", iso: "IRQ", confed: "AFC", rank: 56 },
  Qatar: { flag: "qa", iso: "QAT", confed: "AFC", rank: 57 },
  "South Africa": { flag: "za", iso: "RSA", confed: "CAF", rank: 60 },
  "Saudi Arabia": { flag: "sa", iso: "KSA", confed: "AFC", rank: 61 },
  Jordan: { flag: "jo", iso: "JOR", confed: "AFC", rank: 63 },
  "Bosnia and Herzegovina": { flag: "ba", iso: "BIH", confed: "UEFA", rank: 64 },
  "Cabo Verde": { flag: "cv", iso: "CPV", confed: "CAF", rank: 67 },
  Ghana: { flag: "gh", iso: "GHA", confed: "CAF", rank: 73 },
  Curaçao: { flag: "cw", iso: "CUW", confed: "CONCACAF", rank: 82 },
  Haiti: { flag: "ht", iso: "HAI", confed: "CONCACAF", rank: 83 },
  "New Zealand": { flag: "nz", iso: "NZL", confed: "OFC", rank: 85 }
};

const groupStartDates: Record<string, string> = {
  A: "2026-06-11T19:00:00.000Z",
  B: "2026-06-12T19:00:00.000Z",
  C: "2026-06-13T19:00:00.000Z",
  D: "2026-06-12T22:00:00.000Z",
  E: "2026-06-14T19:00:00.000Z",
  F: "2026-06-14T22:00:00.000Z",
  G: "2026-06-15T19:00:00.000Z",
  H: "2026-06-15T22:00:00.000Z",
  I: "2026-06-16T19:00:00.000Z",
  J: "2026-06-16T22:00:00.000Z",
  K: "2026-06-17T19:00:00.000Z",
  L: "2026-06-17T22:00:00.000Z"
};

function addDays(date: string, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

async function main() {
  await prisma.auditEvent.deleteMany();
  await prisma.drawAssignment.deleteMany();
  await prisma.unassignedTeam.deleteMany();
  await prisma.draw.deleteMany();
  await prisma.player.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.fixture.deleteMany();
  await prisma.team.deleteMany();
  await prisma.tournament.deleteMany();

  const tournament = await prisma.tournament.create({
    data: {
      name: "FIFA World Cup 2026",
      year: 2026,
      teamCount: 48,
      startsAt: new Date("2026-06-11T19:00:00.000Z"),
      endsAt: new Date("2026-07-19T22:00:00.000Z")
    }
  });

  const createdTeams = new Map<string, string>();

  for (const [groupCode, teamNames] of Object.entries(groups)) {
    for (const teamName of teamNames) {
      const meta = teamMeta[teamName];
      const team = await prisma.team.create({
        data: {
          tournamentId: tournament.id,
          name: teamName,
          displayName: teamName,
          isoCode: meta.iso,
          flagCode: meta.flag,
          confederation: meta.confed,
          fifaRanking: meta.rank,
          groupCode
        }
      });
      createdTeams.set(teamName, team.id);
    }
  }

  let matchNumber = 1;
  for (const [groupCode, teamNames] of Object.entries(groups)) {
    const pairings = [
      [teamNames[0], teamNames[1], 0],
      [teamNames[2], teamNames[3], 0],
      [teamNames[0], teamNames[2], 6],
      [teamNames[3], teamNames[1], 6],
      [teamNames[3], teamNames[0], 12],
      [teamNames[1], teamNames[2], 12]
    ] as const;

    for (const [home, away, offset] of pairings) {
      await prisma.fixture.create({
        data: {
          tournamentId: tournament.id,
          homeTeamId: createdTeams.get(home)!,
          awayTeamId: createdTeams.get(away)!,
          matchNumber,
          stage: "Group stage",
          groupCode,
          startsAt: addDays(groupStartDates[groupCode], offset),
          venue: "TBC",
          city: "TBC"
        }
      });
      matchNumber += 1;
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeded FIFA World Cup 2026 tournament data.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
