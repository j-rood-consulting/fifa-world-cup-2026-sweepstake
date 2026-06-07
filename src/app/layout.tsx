import type { Metadata } from "next";
import Link from "next/link";
import { Trophy } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Sweepstake",
  description: "Create, join, draw, reveal, and follow a World Cup sweepstake pool."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <Link className="brand" href="/">
              <span className="brand-mark">
                <Trophy size={20} />
              </span>
              <span>FIFA World Cup 2026 Sweepstake</span>
            </Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
