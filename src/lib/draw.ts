import type { Player, Team } from "@prisma/client";

type DrawTeam = Pick<Team, "id" | "confederation" | "fifaRanking">;
type DrawPlayer = Pick<Player, "id">;

export type DrawResult = {
  assignments: Array<{
    playerId: string;
    teamId: string;
    rankingBand: number;
    revealOrder: number;
  }>;
  unassignedTeamIds: string[];
  teamsPerPlayer: number;
};

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function createSeededDraw(players: DrawPlayer[], teams: DrawTeam[], seed: number): DrawResult {
  if (players.length < 2) {
    throw new Error("At least two players are required.");
  }

  const teamsPerPlayer = Math.floor(teams.length / players.length);

  if (teamsPerPlayer < 1) {
    throw new Error("There are more players than available teams.");
  }

  const random = mulberry32(seed);
  const rankedTeams = [...teams].sort((a, b) => a.fifaRanking - b.fifaRanking);
  const assignedCount = teamsPerPlayer * players.length;
  const assignedTeams = rankedTeams.slice(0, assignedCount);
  const unassignedTeamIds = rankedTeams.slice(assignedCount).map((team) => team.id);
  const confedsByPlayer = new Map(players.map((player) => [player.id, new Set<string>()]));
  const assignments: DrawResult["assignments"] = [];
  let revealOrder = 1;

  for (let bandIndex = 0; bandIndex < teamsPerPlayer; bandIndex += 1) {
    const band = shuffle(
      assignedTeams.slice(bandIndex * players.length, (bandIndex + 1) * players.length),
      random
    );
    const playerOrder = shuffle(players, random);
    const availablePlayers = [...playerOrder];

    for (const team of band) {
      availablePlayers.sort((a, b) => {
        const aHas = confedsByPlayer.get(a.id)?.has(team.confederation) ? 1 : 0;
        const bHas = confedsByPlayer.get(b.id)?.has(team.confederation) ? 1 : 0;
        return aHas - bHas || random() - 0.5;
      });

      const player = availablePlayers.shift();
      if (!player) continue;

      confedsByPlayer.get(player.id)?.add(team.confederation);
      assignments.push({
        playerId: player.id,
        teamId: team.id,
        rankingBand: bandIndex + 1,
        revealOrder
      });
      revealOrder += 1;
    }
  }

  return {
    assignments,
    unassignedTeamIds,
    teamsPerPlayer
  };
}
