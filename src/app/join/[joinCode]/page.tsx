import Link from "next/link";
import { notFound } from "next/navigation";
import { joinPool } from "@/lib/actions";
import { getPoolByJoinCode } from "@/lib/data";

export default async function JoinPage({ params }: { params: Promise<{ joinCode: string }> }) {
  const { joinCode } = await params;
  const pool = await getPoolByJoinCode(joinCode);
  if (!pool) notFound();

  return (
    <main className="join-page">
      <section className="join-intro">
        <p className="eyebrow">Pool invite</p>
        <h1>{pool.name}</h1>
        <p className="lead">Enter your name to join {pool.adminName}&apos;s World Cup sweepstake.</p>
      </section>
      <section className="panel panel-pad form-stack join-card">
        {pool.drawStatus === "drawn" ? (
          <div className="form-stack">
            <h2>The draw is already complete</h2>
            <p className="muted">Use your player code to view your teams.</p>
            <Link className="button" href={`/pool/${pool.joinCode}`}>Open results</Link>
          </div>
        ) : (
          <form className="form-stack" action={joinPool.bind(null, pool.joinCode)}>
            <h2>Join the pool</h2>
            <div className="field">
              <label htmlFor="displayName">Your name</label>
              <input id="displayName" name="displayName" placeholder="Your name" required />
            </div>
            <button className="button" type="submit">Join pool</button>
          </form>
        )}

        <form className="form-stack quiet-return" action={`/pool/${pool.joinCode}`} method="get">
          <h2>Already joined?</h2>
          <div className="field">
            <label htmlFor="code">Player code</label>
            <input id="code" name="code" inputMode="numeric" placeholder="1234" />
          </div>
          <button className="button ghost" type="submit">Open my view</button>
        </form>
      </section>
    </main>
  );
}
