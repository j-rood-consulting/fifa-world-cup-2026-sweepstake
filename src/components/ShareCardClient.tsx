"use client";

import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { useRef } from "react";

export function ShareCardClient({ children, filename }: { children: React.ReactNode; filename: string }) {
  const ref = useRef<HTMLDivElement>(null);

  async function download() {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  return (
    <div className="form-stack">
      <div ref={ref}>{children}</div>
      <button type="button" className="button" onClick={download}>
        <Download size={16} />
        Download share card
      </button>
    </div>
  );
}
