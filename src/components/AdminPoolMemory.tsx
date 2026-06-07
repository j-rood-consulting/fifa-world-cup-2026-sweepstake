"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

type SavedAdminPool = {
  name: string;
  adminCode: string;
  adminUrl: string;
  savedAt: number;
};

const storageKey = "fifa-wc-2026-admin-pools";
const emptyPools: SavedAdminPool[] = [];
let cachedRaw = "";
let cachedPools: SavedAdminPool[] = emptyPools;

function readPools() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return emptyPools;
    return JSON.parse(raw) as SavedAdminPool[];
  } catch {
    return emptyPools;
  }
}

function getAdminPoolSnapshot() {
  const raw = window.localStorage.getItem(storageKey) ?? "";
  if (raw === cachedRaw) return cachedPools;

  cachedRaw = raw;
  cachedPools = readPools();
  return cachedPools;
}

export function RememberAdminPool({ name, adminCode, adminUrl }: { name: string; adminCode: string; adminUrl: string }) {
  useEffect(() => {
    const pools = readPools().filter((pool) => pool.adminCode !== adminCode);
    const next = [{ name, adminCode, adminUrl, savedAt: Date.now() }, ...pools].slice(0, 6);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }, [adminCode, adminUrl, name]);

  return null;
}

export function RecentAdminPools() {
  const pools = useSyncExternalStore(
    () => () => {},
    getAdminPoolSnapshot,
    () => emptyPools
  );

  if (pools.length === 0) return null;

  return (
    <div className="recent-admin-pools">
      <strong>Recent admin pools on this device</strong>
      <div className="list">
        {pools.map((pool) => (
          <Link className="row" href={`/admin/${pool.adminCode}`} key={pool.adminCode}>
            <span className="row-main">
              <strong>{pool.name}</strong>
              <span className="muted">Admin code {pool.adminCode}</span>
            </span>
            <span className="chip">Open</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
