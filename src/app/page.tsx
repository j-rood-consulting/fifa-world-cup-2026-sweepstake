import Link from "next/link";
import { ArrowRight, Plus, Users } from "lucide-react";

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
        </div>
      </section>

      <section className="panel panel-pad" id="join">
        <h2>Join with a code</h2>
        <p className="muted">Got a pool code from your admin? Enter it here, or just open the join link they shared.</p>
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
            Continue
            <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
