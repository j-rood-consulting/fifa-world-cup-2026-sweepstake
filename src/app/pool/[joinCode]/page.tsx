import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { TeamCard } from "@/components/TeamCard";
import { getFixtures, getPoolByJoinCode } from "@/lib/data";
import { formatDateTime, statusLabel } from "@/lib/format";
import { updatePlayerName } from "@/lib/actions";

function getAssignmentsByPlayer(draw: NonNullable<Awaited<ReturnType<typeof getPoolByJoinCode>>>["draws"][number] | undefined) {
  const map = new Map<string, NonNullable<typeof draw>["assignments"]>();
  for (const assignment of draw?.assignments ?? []) {
    const current = map.get(assignment.playerId) ?? [];
    current.push(assignment);
    map.set(assignment.playerId, current);
  }
  return map;
}

export default async function PoolPage({
  params,
  searchParams
}: {
  params: Promise<{ joinCode: string }>;
  searchParams: Promise<{ code?: string; new?: string }>;
}) {
  const { joinCode } = await params;
  const { code, new: isNew } = await searchParams;
  const pool = await getPoolByJoinCode(joinCode);
  if (!pool) notFound();

  const player = code ? pool.players.find((candidate) => candidate.accessCode === code) : null;
  const draw = pool.draws[0];

  if (player && draw && !player.hasViewedReveal) {
    redirect(`/reveal/${pool.joinCode}/${player.accessCode}`);
  }

  const assignmentsByPlayer = getAssignmentsByPlayer(draw);
  const fixtures = draw ? await getFixtures() : [];
  const myAssignments = player ? assignmentsByPlayer.get(player.id) ?? [] : [];

  return (
    <main className="form-stack">
      {isNew && player ? (
        <section className="panel panel-pad dark-panel">
          <p className="eyebrow">Save this code</p>
          <h1 style={{ fontSize: "clamp(2.5rem, 10vw, 5rem)" }}>{player.accessCode}</h1>
          <p className="cream-muted">You will need this code to view your reveal and teams later.</p>
          <CopyButton value={player.accessCode} label="Copy code" />
        </section>
      ) : null}

      <section className="dashboard-grid">
        <div>
          <p className="eyebrow">Pool</p>
          <h1>{pool.name}</h1>
          <p className="lead">
            {draw ? "The draw has been made. Check your teams, the full pool, and fixtures." : "The draw has not been made yet. The admin will run it when the pool is ready."}
          </p>
        </div>

        <aside className="panel panel-pad">
          {player ? (
            <div className="form-stack">
              <h2>{player.displayName}</h2>
              <p className="muted">Your code: {player.accessCode}</p>
              {pool.drawStatus !== "drawn" && pool.allowPlayerNameEdit ? (
                <form className="form-stack" action={updatePlayerName.bind(null, pool.joinCode, player.accessCode)}>
                  <div className="field">
                    <label htmlFor="displayName">Edit name</label>
                    <input id="displayName" name="displayName" defaultValue={player.displayName} />
                  </div>
                  <button className="button ghost" type="submit">Update name</button>
                </form>
              ) : null}
            </div>
          ) : (
            <form className="form-stack" action={`/pool/${pool.joinCode}`} method="get">
              <h2>Enter player code</h2>
              <p className="muted">Use your 4-digit code to see your teams.</p>
              <div className="field">
                <label htmlFor="code">Player code</label>
                <input id="code" name="code" inputMode="numeric" placeholder="1234" />
              </div>
              <button className="button" type="submit">Open my teams</button>
            </form>
          )}
        </aside>
      </section>

      {!draw ? (
        <section className="panel panel-pad">
          <h2>Waiting room</h2>
          <div className="stat-grid">
            <div className="stat"><strong>{pool.players.length}</strong><span>Players</span></div>
            <div className="stat"><strong>{pool.minimumPlayers}</strong><span>Minimum</span></div>
            <div className="stat"><strong>{formatDateTime(pool.drawDeadline)}</strong><span>Deadline</span></div>
          </div>
          {pool.showPlayerListBeforeDraw ? (
            <div className="list" style={{ marginTop: 16 }}>
              {pool.players.map((entry) => (
                <div className="row" key={entry.id}>
                  <strong>{entry.displayName}</strong>
                  <span className={`chip ${entry.paidStatus === "paid" ? "green" : ""}`}>{entry.paidStatus}</span>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : (
        <>
          {player ? (
            <section className="panel panel-pad">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <h2>My teams</h2>
                  <p className="muted">Your personal draw from the ranking bands.</p>
                </div>
                <Link className="button ghost" href={`/share/${pool.joinCode}/${player.accessCode}`}>Share card</Link>
              </div>
              <div className="team-grid">
                {myAssignments.map((assignment) => (
                  <TeamCard key={assignment.id} team={assignment.team} band={assignment.rankingBand} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="panel panel-pad">
            <h2>All players</h2>
            <div className="list">
              {pool.players.map((entry) => (
                <div className="panel panel-pad" key={entry.id} style={{ boxShadow: "none" }}>
                  <h3>{entry.displayName}</h3>
                  <div className="team-grid">
                    {(assignmentsByPlayer.get(entry.id) ?? []).map((assignment) => (
                      <TeamCard key={assignment.id} team={assignment.team} band={assignment.rankingBand} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel panel-pad">
            <h2>Fixtures and status</h2>
            <div className="fixture-list">
              {fixtures.map((fixture) => (
                <div className="fixture-row" key={fixture.id}>
                  <span><strong>{fixture.homeTeam.displayName}</strong></span>
                  <span className="chip">
                    {fixture.homeScore ?? "-"} : {fixture.awayScore ?? "-"}
                  </span>
                  <span style={{ textAlign: "right" }}><strong>{fixture.awayTeam.displayName}</strong></span>
                  <small className="muted">Group {fixture.groupCode} · {formatDateTime(fixture.startsAt)}</small>
                  <small className="muted center">{statusLabel(fixture.status)}</small>
                  <small className="muted" style={{ textAlign: "right" }}>{fixture.stage}</small>
                </div>
              ))}
            </div>
          </section>

          {draw.unassignedTeams.length ? (
            <section className="panel panel-pad">
              <h2>Unassigned teams</h2>
              <div className="team-grid">
                {draw.unassignedTeams.map((entry) => (
                  <TeamCard key={entry.id} team={entry.team} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
