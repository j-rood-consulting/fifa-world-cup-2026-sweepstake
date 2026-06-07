export function Flag({ code, large = false }: { code: string; large?: boolean }) {
  return <span className={`fi fi-${code.toLowerCase()} flag${large ? " large" : ""}`} aria-hidden="true" />;
}
