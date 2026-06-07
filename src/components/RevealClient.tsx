"use client";

import type { Team } from "@prisma/client";
import { Flag } from "@/components/Flag";
import { useEffect, useState } from "react";

export function RevealClient({
  playerName,
  teams,
  doneAction
}: {
  playerName: string;
  teams: Team[];
  doneAction: React.ReactNode;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const step = Math.max(650, Math.min(1200, Math.floor(14000 / Math.max(teams.length, 1))));
    const timers = teams.map((_, index) => window.setTimeout(() => setVisibleCount(index + 1), 900 + index * step));
    return () => timers.forEach(window.clearTimeout);
  }, [teams]);

  return (
    <div className="reveal-stage">
      <div className="reveal-card">
        <p className="eyebrow">Your draw is ready</p>
        <h1 style={{ fontSize: "clamp(2.1rem, 7vw, 4.2rem)", marginBottom: 10 }}>{playerName}</h1>
        <p className="cream-muted">Teams are revealing now. One from each ranking band, balanced by confederation where possible.</p>
        <div className="list" style={{ marginTop: 24 }}>
          {teams.map((team, index) => (
            <div
              key={team.id}
              className="row reveal-team"
              style={{
                visibility: index < visibleCount ? "visible" : "hidden",
                background: "rgba(255,255,255,0.94)",
                color: "var(--ink)"
              }}
            >
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
        {visibleCount === teams.length ? <div style={{ marginTop: 24 }}>{doneAction}</div> : null}
      </div>
    </div>
  );
}
