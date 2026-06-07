export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    not_started: "Not started",
    group_stage: "Group stage",
    qualified: "Qualified",
    knocked_out: "Knocked out",
    winner: "Winner",
    scheduled: "Scheduled",
    live: "Live",
    complete: "Complete",
    waiting: "Waiting",
    drawn: "Drawn"
  };
  return labels[status] ?? status;
}
