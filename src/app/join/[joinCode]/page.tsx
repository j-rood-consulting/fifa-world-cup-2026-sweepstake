import { notFound } from "next/navigation";
import { joinPool } from "@/lib/actions";
import { getPoolByJoinCode } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export default async function JoinPage({ params }: { params: Promise<{ joinCode: string }> }) {
  const { joinCode } = await params;
  const pool = await getPoolByJoinCode(joinCode);
  if (!pool) notFound();

  return (
    <main className="dashboard-grid">
      <section>
        <p className="eyebrow">Join pool</p>
        <h1>{pool.name}</h1>
        <p className="lead">Admin: {pool.adminName}. The draw is {pool.drawStatus === "drawn" ? "complete" : "waiting to be run"}.</p>
        <div className="stat-grid">
          <div className="stat">
            <strong>{pool.players.length}</strong>
            <span>Players</span>
          </div>
          <div className="stat">
            <strong>{pool.minimumPlayers}</strong>
            <span>Minimum</span>
          </div>
          <div className="stat">
            <strong>{pool.drawDeadline ? formatDateTime(pool.drawDeadline) : "Manual"}</strong>
            <span>Draw timing</span>
          </div>
        </div>
      </section>
      <section className="panel panel-pad">
        {pool.drawStatus === "drawn" ? (
          <div className="form-stack">
            <h2>The draw has been made</h2>
            <p className="muted">Enter your player code on the pool page to view your teams.</p>
            <a className="button" href={`/pool/${pool.joinCode}`}>Open results</a>
          </div>
        ) : (
          <form className="form-stack" action={joinPool.bind(null, pool.joinCode)}>
            <h2>Add your name</h2>
            <p className="muted">You will get a 4-digit code after joining. Keep it handy for your reveal.</p>
            <div className="field">
              <label htmlFor="displayName">Display name</label>
              <input id="displayName" name="displayName" placeholder="Your name" required />
            </div>
            <button className="button" type="submit">Join pool</button>
          </form>
        )}
      </section>
    </main>
  );
}
