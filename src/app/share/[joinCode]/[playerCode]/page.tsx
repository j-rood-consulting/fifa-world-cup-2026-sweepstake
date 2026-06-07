import { notFound } from "next/navigation";
import { Flag } from "@/components/Flag";
import { ShareCardClient } from "@/components/ShareCardClient";
import { getPoolByJoinCode } from "@/lib/data";

export default async function SharePage({ params }: { params: Promise<{ joinCode: string; playerCode: string }> }) {
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
    <main className="dashboard-grid">
      <section>
        <p className="eyebrow">Share card</p>
        <h1>{player.displayName}&apos;s teams</h1>
        <p className="lead">Download a WhatsApp-friendly image of your draw.</p>
      </section>

      <section className="panel panel-pad">
        <ShareCardClient filename={`${player.displayName.toLowerCase().replace(/\s+/g, "-")}-world-cup-draw.png`}>
          <div className="share-card">
            <p className="eyebrow">FIFA World Cup 2026 Sweepstake</p>
            <h2 style={{ color: "var(--cream)", fontSize: 38 }}>{pool.name}</h2>
            <p className="cream-muted" style={{ fontSize: 18 }}>{player.displayName}&apos;s teams</p>
            <div className="list" style={{ marginTop: 24 }}>
              {teams.map((team, index) => (
                <div className="row" key={team.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Flag code={team.flagCode} />
                    <div>
                      <strong>{team.displayName}</strong>
                      <div className="muted">Rank {team.fifaRanking} · Group {team.groupCode}</div>
                    </div>
                  </div>
                  <span className="chip gold">Band {index + 1}</span>
                </div>
              ))}
            </div>
            <p className="cream-muted" style={{ marginTop: 24 }}>One team from each ranking band. Drawn fairly.</p>
          </div>
        </ShareCardClient>
      </section>
    </main>
  );
}
