import type { Team } from "@prisma/client";
import { Flag } from "@/components/Flag";
import { statusLabel } from "@/lib/format";

export function TeamCard({ team, band }: { team: Team; band?: number }) {
  return (
    <article className="team-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <Flag code={team.flagCode} large />
        {band ? <span className="chip gold">Band {band}</span> : null}
      </div>
      <div>
        <h3>{team.displayName}</h3>
        <p className="muted" style={{ marginBottom: 0 }}>
          Rank {team.fifaRanking} · Group {team.groupCode} · {team.confederation}
        </p>
      </div>
      <span className="chip green">{statusLabel(team.status)}</span>
    </article>
  );
}
