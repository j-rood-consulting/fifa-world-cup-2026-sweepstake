import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Download, Play, RotateCcw, Trash2 } from "lucide-react";
import { RememberAdminPool } from "@/components/AdminPoolMemory";
import { CopyButton } from "@/components/CopyButton";
import { TeamCard } from "@/components/TeamCard";
import { removePlayer, runDraw, togglePaid } from "@/lib/actions";
import { getPoolByAdminCode } from "@/lib/data";
import { formatDateTime, statusLabel } from "@/lib/format";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export default async function AdminPage({
  params,
  searchParams
}: {
  params: Promise<{ adminCode: string }>;
  searchParams: Promise<{ reveal?: string }>;
}) {
  const { adminCode } = await params;
  const { reveal } = await searchParams;
  const pool = await getPoolByAdminCode(adminCode);
  if (!pool) notFound();

  const draw = pool.draws[0];
  const players = pool.players;
  const teamsPerPlayer = players.length ? Math.floor(pool.tournament.teamCount / players.length) : 0;
  const unassignedCount = players.length ? pool.tournament.teamCount - teamsPerPlayer * players.length : 0;
  const canDraw = players.length >= pool.minimumPlayers;
  const joinUrl = `${getBaseUrl()}/join/${pool.joinCode}`;
  const adminUrl = `${getBaseUrl()}/admin/${pool.adminCode}`;
  const whatsapp = `Join my FIFA World Cup 2026 Sweepstake pool: ${pool.name}\n\nOpen this link, enter your name, and tap Join pool:\n${joinUrl}`;

  const assignmentsByPlayer = new Map<string, typeof draw.assignments>();
  for (const assignment of draw?.assignments ?? []) {
    const current = assignmentsByPlayer.get(assignment.playerId) ?? [];
    current.push(assignment);
    assignmentsByPlayer.set(assignment.playerId, current);
  }

  return (
    <main className="dashboard-grid">
      <RememberAdminPool name={pool.name} adminCode={pool.adminCode} adminUrl={adminUrl} />
      <section className="form-stack">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>{pool.name}</h1>
          <p className="lead">Share the pool, track players, then run the draw when everyone is in.</p>
        </div>

        {reveal && draw ? (
          <div className="panel panel-pad dark-panel">
            <p className="eyebrow">Full pool reveal</p>
            <h2>The draw is complete.</h2>
            <div className="list">
              {players.map((player) => (
                <div className="row reveal-team" key={player.id}>
                  <div className="row-main">
                    <strong>{player.displayName}</strong>
                    <div className="muted">
                      {(assignmentsByPlayer.get(player.id) ?? []).map((assignment) => assignment.team.displayName).join(" · ")}
                    </div>
                  </div>
                  <span className="chip gold">{(assignmentsByPlayer.get(player.id) ?? []).length} teams</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <section className="panel panel-pad">
          <h2>Readiness</h2>
          <div className="stat-grid">
            <div className="stat">
              <strong>{players.length}</strong>
              <span>Players joined</span>
            </div>
            <div className="stat">
              <strong>{teamsPerPlayer}</strong>
              <span>Teams each</span>
            </div>
            <div className="stat">
              <strong>{unassignedCount}</strong>
              <span>Unassigned</span>
            </div>
          </div>
          <div className="list" style={{ marginTop: 14 }}>
            <div className="row">
              <span>Minimum players</span>
              <span className={`chip ${canDraw ? "green" : "coral"}`}>{players.length}/{pool.minimumPlayers}</span>
            </div>
            <div className="row">
              <span>Deadline</span>
              <span className="chip">{formatDateTime(pool.drawDeadline)}</span>
            </div>
            <div className="row">
              <span>Status</span>
              <span className="chip gold">{statusLabel(pool.drawStatus)}</span>
            </div>
          </div>
          <form action={runDraw.bind(null, pool.adminCode)} style={{ marginTop: 16 }}>
            <button className={`button ${pool.drawStatus === "drawn" ? "danger" : ""}`} type="submit" disabled={!canDraw}>
              {pool.drawStatus === "drawn" ? <RotateCcw size={18} /> : <Play size={18} />}
              {pool.drawStatus === "drawn" ? "Rerun draw" : "Run draw"}
            </button>
          </form>
          {pool.drawStatus === "drawn" ? (
            <p className="muted" style={{ marginTop: 10 }}>
              Rerunning deletes the current results and gives every player a fresh reveal.
            </p>
          ) : null}
        </section>
      </section>

      <aside className="form-stack">
        <section className="panel panel-pad">
          <h2>Share pool</h2>
          <p className="muted">Send this to players. They just open the link, enter their name, and join.</p>
          <p className="muted">Pool code: <strong>{pool.joinCode}</strong></p>
          <div className="actions">
            <CopyButton value={joinUrl} label="Copy join link" />
            <CopyButton value={whatsapp} label="Copy WhatsApp message" />
          </div>
        </section>

        <section className="panel panel-pad">
          <h2>Admin access</h2>
          <p className="muted">Admin code: <strong>{pool.adminCode}</strong></p>
          <p className="muted">
            Save this private link now. The player join link only contains the pool code, so it cannot be used to recover admin access.
          </p>
          <p className="notice">
            This browser will remember recent admin pools, but if you switch device or clear browser data you will need this code or link.
          </p>
          <div className="actions">
            <CopyButton value={adminUrl} label="Copy admin link" />
            <CopyButton value={pool.adminCode} label="Copy admin code" />
          </div>
        </section>

        <section className="panel panel-pad">
          <h2>Players</h2>
          <div className="list">
            {players.map((player) => (
              <div className="row" key={player.id}>
                <div className="row-main">
                  <strong>{player.displayName}</strong>
                  <div className="muted">Code {player.accessCode}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <form action={togglePaid.bind(null, pool.adminCode, player.id)}>
                    <button className="button ghost" type="submit" title="Toggle paid">
                      <Check size={16} />
                    </button>
                  </form>
                  {pool.drawStatus !== "drawn" ? (
                    <form action={removePlayer.bind(null, pool.adminCode, player.id)}>
                      <button className="button ghost" type="submit" title="Remove player">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            ))}
            {players.length === 0 ? <p className="muted">No players yet.</p> : null}
          </div>
        </section>

        {pool.paymentEnabled ? (
          <section className="panel panel-pad">
            <h2>Payment details</h2>
            <p className="muted">{pool.entryFeeAmount} {pool.currency} per player</p>
            <div className="list">
              <div className="row"><span>Account holder</span><strong>{pool.paymentAccountHolder}</strong></div>
              <div className="row"><span>Bank</span><strong>{pool.paymentBankName}</strong></div>
              <div className="row"><span>Account</span><strong>{pool.paymentAccountNumber}</strong></div>
              <div className="row"><span>Reference</span><strong>{pool.paymentReference}</strong></div>
            </div>
          </section>
        ) : null}
      </aside>

      {draw ? (
        <section className="panel panel-pad" style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <h2>Results</h2>
            <Link className="button ghost" href={`/admin/${pool.adminCode}/share`}>
              <Download size={18} />
              Download full share card
            </Link>
          </div>
          <div className="list">
            {players.map((player) => (
              <div key={player.id} className="panel panel-pad" style={{ boxShadow: "none" }}>
                <h3>{player.displayName}</h3>
                <div className="team-grid">
                  {(assignmentsByPlayer.get(player.id) ?? []).map((assignment) => (
                    <TeamCard key={assignment.id} team={assignment.team} band={assignment.rankingBand} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
