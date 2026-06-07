import Link from "next/link";
import { ArrowRight, Plus, Shield, Users } from "lucide-react";

export default function HomePage() {
  return (
    <main className="hero-grid">
      <section>
        <p className="eyebrow">48 teams · seeded draw · one reveal moment</p>
        <h1>Run a World Cup sweepstake people actually enjoy.</h1>
        <p className="lead">
          Create a pool, share the link in WhatsApp, let players join with a name, then run a fair seeded draw with a fast personal reveal for everyone.
        </p>
        <div className="actions">
          <Link className="button" href="/create">
            <Plus size={18} />
            Create a pool
          </Link>
          <a className="button secondary" href="#join">
            <Users size={18} />
            Join a pool
          </a>
          <a className="button secondary" href="#admin">
            <Shield size={18} />
            Manage pool
          </a>
        </div>
      </section>

      <aside className="form-stack">
        <section className="panel panel-pad" id="join">
          <h2>Join or return</h2>
          <p className="muted">Use the pool code to join for the first time, or add your 4-digit player code to open your view.</p>
          <form
            className="form-stack"
            action={async (formData) => {
              "use server";
              const code = String(formData.get("joinCode") ?? "").trim().toUpperCase();
              if (code) {
                const { redirect } = await import("next/navigation");
                redirect(`/join/${code}`);
              }
            }}
          >
            <div className="field">
              <label htmlFor="joinCode">Pool code</label>
              <input id="joinCode" name="joinCode" placeholder="ABC123" />
            </div>
            <button className="button" type="submit">
              Join pool
              <ArrowRight size={18} />
            </button>
          </form>

          <form
            className="form-stack"
            action={async (formData) => {
              "use server";
              const poolCode = String(formData.get("poolCode") ?? "").trim().toUpperCase();
              const playerCode = String(formData.get("playerCode") ?? "").trim();
              if (poolCode && playerCode) {
                const { redirect } = await import("next/navigation");
                redirect(`/pool/${poolCode}?code=${encodeURIComponent(playerCode)}`);
              }
            }}
          >
            <div className="two-col">
              <div className="field">
                <label htmlFor="poolCode">Pool code</label>
                <input id="poolCode" name="poolCode" placeholder="ABC123" />
              </div>
              <div className="field">
                <label htmlFor="playerCode">Player code</label>
                <input id="playerCode" name="playerCode" inputMode="numeric" placeholder="1234" />
              </div>
            </div>
            <button className="button ghost" type="submit">Open my view</button>
          </form>
        </section>

        <section className="panel panel-pad" id="admin">
          <h2>Manage a pool</h2>
          <p className="muted">Admins can return with the private admin code shown after setup.</p>
          <form
            className="form-stack"
            action={async (formData) => {
              "use server";
              const code = String(formData.get("adminCode") ?? "").trim().toUpperCase();
              if (code) {
                const { redirect } = await import("next/navigation");
                redirect(`/admin/${code}`);
              }
            }}
          >
            <div className="field">
              <label htmlFor="adminCode">Admin code</label>
              <input id="adminCode" name="adminCode" placeholder="ADMIN123" />
            </div>
            <button className="button" type="submit">
              Open dashboard
              <ArrowRight size={18} />
            </button>
          </form>
        </section>
      </aside>
    </main>
  );
}
