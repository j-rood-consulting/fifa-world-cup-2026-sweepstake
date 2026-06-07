import { notFound } from "next/navigation";
import { RevealClient } from "@/components/RevealClient";
import { markRevealViewed } from "@/lib/actions";
import { getPoolByJoinCode } from "@/lib/data";

export default async function RevealPage({ params }: { params: Promise<{ joinCode: string; playerCode: string }> }) {
  const { joinCode, playerCode } = await params;
  const pool = await getPoolByJoinCode(joinCode);
  if (!pool) notFound();

  const player = pool.players.find((candidate) => candidate.accessCode === playerCode);
  const draw = pool.draws[0];
  if (!player || !draw) notFound();

  const teams = draw.assignments
    .filter((assignment) => assignment.playerId === player.id)
    .sort((a, b) => a.rankingBand - b.rankingBand)
    .map((assignment) => assignment.team);

  return (
    <RevealClient
      playerName={player.displayName}
      teams={teams}
      doneAction={
        <form action={markRevealViewed.bind(null, pool.joinCode, player.accessCode)}>
          <button className="button" type="submit">Continue to results</button>
        </form>
      }
    />
  );
}
