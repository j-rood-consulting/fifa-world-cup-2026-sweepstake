import Link from "next/link";
import { notFound } from "next/navigation";
import { Flag } from "@/components/Flag";
import { ShareCardClient } from "@/components/ShareCardClient";
import { getPoolByAdminCode } from "@/lib/data";

export default async function AdminSharePage({ params }: { params: Promise<{ adminCode: string }> }) {
  const { adminCode } = await params;
  const pool = await getPoolByAdminCode(adminCode);
  if (!pool) notFound();

  const draw = pool.draws[0];
  if (!draw) notFound();

  const assignmentsByPlayer = new Map<string, typeof draw.assignments>();
  for (const assignment of draw.assignments) {
    const current = assignmentsByPlayer.get(assignment.playerId) ?? [];
    current.push(assignment);
    assignmentsByPlayer.set(assignment.playerId, current);
  }

  const filename = `${pool.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-full-draw.png`;

  return (
    <main className="dashboard-grid">
      <section>
        <p className="eyebrow">Admin share card</p>
        <h1>Full draw board</h1>
        <p className="lead">Download one image with every player and their teams, ready to share in the group chat.</p>
        <div className="actions">
          <Link className="button secondary" href={`/admin/${pool.adminCode}`}>Back to admin</Link>
        </div>
      </section>

      <section className="panel panel-pad">
        <ShareCardClient filename={filename}>
          <div className="admin-share-card">
            <p className="eyebrow">FIFA World Cup 2026 Sweepstake</p>
            <div className="admin-share-header">
              <div>
                <h2>{pool.name}</h2>
                <p>{pool.players.length} players · {draw.assignments.length} teams assigned</p>
              </div>
              <span className="admin-share-badge">Full draw</span>
            </div>

            <div className="admin-share-list">
              {pool.players.map((player) => {
                const assignments = assignmentsByPlayer.get(player.id) ?? [];

                return (
                  <div className="admin-share-row" key={player.id}>
                    <div className="admin-share-player">
                      <strong>{player.displayName}</strong>
                      <span>{assignments.length} teams</span>
                    </div>
                    <div className="admin-share-teams">
                      {assignments.map((assignment) => (
                        <div className="admin-share-team" key={assignment.id}>
                          <Flag code={assignment.team.flagCode} />
                          <div>
                            <strong>{assignment.team.displayName}</strong>
                            <span>Rank {assignment.team.fifaRanking} · Band {assignment.rankingBand}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {draw.unassignedTeams.length ? (
              <div className="admin-share-unassigned">
                <strong>Unassigned teams</strong>
                <div>
                  {draw.unassignedTeams.map((entry) => (
                    <span key={entry.id}>
                      <Flag code={entry.team.flagCode} />
                      {entry.team.displayName}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <p className="admin-share-footer">Drawn fairly by ranking band. One sweepstake, one reveal moment.</p>
          </div>
        </ShareCardClient>
      </section>
    </main>
  );
}
