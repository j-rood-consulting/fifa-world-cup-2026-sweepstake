"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { makeAdminCode, makeJoinCode, makePlayerCode } from "@/lib/codes";
import { getTournament } from "@/lib/data";
import { createSeededDraw } from "@/lib/draw";
import { prisma } from "@/lib/prisma";

const poolSchema = z.object({
  name: z.string().min(2).max(80),
  adminName: z.string().min(2).max(60),
  setupMode: z.enum(["quick", "advanced"]).default("quick"),
  playerCap: z.coerce.number().int().min(2).max(48).optional().or(z.literal("").transform(() => undefined)),
  minimumPlayers: z.coerce.number().int().min(2).max(48).default(2),
  drawDeadline: z.string().optional(),
  entryFeeAmount: z.string().optional(),
  currency: z.string().optional(),
  paymentAccountHolder: z.string().optional(),
  paymentBankName: z.string().optional(),
  paymentAccountNumber: z.string().optional(),
  paymentBranchCode: z.string().optional(),
  paymentReference: z.string().optional(),
  paymentNote: z.string().optional(),
  prizeStructureJson: z.string().optional(),
  rulesNote: z.string().optional()
});

export async function createPool(formData: FormData) {
  const parsed = poolSchema.parse(Object.fromEntries(formData));
  const tournament = await getTournament();
  const joinCode = makeJoinCode();
  const adminCode = makeAdminCode();

  const pool = await prisma.pool.create({
    data: {
      tournamentId: tournament.id,
      name: parsed.name,
      adminName: parsed.adminName,
      setupMode: parsed.setupMode,
      joinCode,
      adminCode,
      playerCap: parsed.playerCap,
      minimumPlayers: parsed.minimumPlayers,
      drawDeadline: parsed.drawDeadline ? new Date(parsed.drawDeadline) : null,
      paymentEnabled: parsed.setupMode === "advanced" && Boolean(parsed.entryFeeAmount || parsed.paymentBankName),
      entryFeeAmount: parsed.entryFeeAmount || null,
      currency: parsed.currency || "GBP",
      paymentAccountHolder: parsed.paymentAccountHolder || null,
      paymentBankName: parsed.paymentBankName || null,
      paymentAccountNumber: parsed.paymentAccountNumber || null,
      paymentBranchCode: parsed.paymentBranchCode || null,
      paymentReference: parsed.paymentReference || null,
      paymentNote: parsed.paymentNote || null,
      prizeStructureJson: parsed.prizeStructureJson || null,
      rulesNote: parsed.rulesNote || null
    }
  });

  await prisma.auditEvent.create({
    data: {
      poolId: pool.id,
      actorType: "admin",
      eventType: "pool_created",
      eventPayload: JSON.stringify({ setupMode: parsed.setupMode })
    }
  });

  redirect(`/admin/${pool.adminCode}`);
}

export async function joinPool(joinCode: string, formData: FormData) {
  const name = z.string().min(2).max(60).parse(formData.get("displayName"));
  const pool = await prisma.pool.findUnique({
    where: { joinCode: joinCode.toUpperCase() },
    include: { players: true }
  });

  if (!pool) throw new Error("Pool not found.");
  if (pool.drawStatus === "drawn") throw new Error("The draw has already been made.");
  if (pool.playerCap && pool.players.length >= pool.playerCap) throw new Error("This pool is full.");

  let accessCode = makePlayerCode();
  while (pool.players.some((player) => player.accessCode === accessCode)) {
    accessCode = makePlayerCode();
  }

  const player = await prisma.player.create({
    data: {
      poolId: pool.id,
      displayName: name,
      accessCode
    }
  });

  await prisma.auditEvent.create({
    data: {
      poolId: pool.id,
      actorType: "player",
      actorId: player.id,
      eventType: "player_joined"
    }
  });

  redirect(`/pool/${pool.joinCode}?code=${player.accessCode}&new=1`);
}

export async function updatePlayerName(joinCode: string, playerCode: string, formData: FormData) {
  const displayName = z.string().min(2).max(60).parse(formData.get("displayName"));
  const pool = await prisma.pool.findUnique({ where: { joinCode: joinCode.toUpperCase() } });
  if (!pool || !pool.allowPlayerNameEdit || pool.drawStatus === "drawn") return;

  await prisma.player.update({
    where: { poolId_accessCode: { poolId: pool.id, accessCode: playerCode } },
    data: { displayName }
  });

  revalidatePath(`/pool/${joinCode}`);
}

export async function removePlayer(adminCode: string, playerId: string) {
  const pool = await prisma.pool.findUnique({ where: { adminCode } });
  if (!pool || pool.drawStatus === "drawn") return;

  await prisma.player.delete({ where: { id: playerId } });
  revalidatePath(`/admin/${adminCode}`);
}

export async function togglePaid(adminCode: string, playerId: string) {
  const pool = await prisma.pool.findUnique({ where: { adminCode } });
  if (!pool) return;

  const player = await prisma.player.findUnique({ where: { id: playerId } });
  if (!player) return;

  await prisma.player.update({
    where: { id: playerId },
    data: { paidStatus: player.paidStatus === "paid" ? "unpaid" : "paid" }
  });

  revalidatePath(`/admin/${adminCode}`);
}

export async function runDraw(adminCode: string) {
  const pool = await prisma.pool.findUnique({
    where: { adminCode },
    include: {
      players: { orderBy: { joinedAt: "asc" } },
      tournament: { include: { teams: true } },
      draws: true
    }
  });

  if (!pool) throw new Error("Pool not found.");
  if (pool.players.length < pool.minimumPlayers) throw new Error("Minimum players not met.");

  await prisma.$transaction(async (tx) => {
    await tx.drawAssignment.deleteMany({ where: { poolId: pool.id } });
    await tx.unassignedTeam.deleteMany({ where: { poolId: pool.id } });
    await tx.draw.deleteMany({ where: { poolId: pool.id } });

    const seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const result = createSeededDraw(pool.players, pool.tournament.teams, seed);
    const draw = await tx.draw.create({
      data: {
        poolId: pool.id,
        drawNumber: pool.draws.length + 1,
        algorithmVersion: "rank-band-confed-v1",
        randomSeedHash: String(seed),
        completedAt: new Date()
      }
    });

    await tx.drawAssignment.createMany({
      data: result.assignments.map((assignment) => ({
        ...assignment,
        drawId: draw.id,
        poolId: pool.id
      }))
    });

    if (result.unassignedTeamIds.length > 0) {
      await tx.unassignedTeam.createMany({
        data: result.unassignedTeamIds.map((teamId) => ({
          drawId: draw.id,
          poolId: pool.id,
          teamId,
          reason: "Lowest-ranked remainder after equal allocation"
        }))
      });
    }

    await tx.player.updateMany({
      where: { poolId: pool.id },
      data: { hasViewedReveal: false }
    });

    await tx.pool.update({
      where: { id: pool.id },
      data: {
        drawStatus: "drawn",
        drawStartedAt: new Date(),
        drawCompletedAt: new Date()
      }
    });

    await tx.auditEvent.create({
      data: {
        poolId: pool.id,
        actorType: "admin",
        eventType: "draw_run",
        eventPayload: JSON.stringify({
          players: pool.players.length,
          assigned: result.assignments.length,
          unassigned: result.unassignedTeamIds.length
        })
      }
    });
  });

  redirect(`/admin/${adminCode}?reveal=1`);
}

export async function markRevealViewed(joinCode: string, playerCode: string) {
  const pool = await prisma.pool.findUnique({ where: { joinCode: joinCode.toUpperCase() } });
  if (!pool) redirect("/");

  await prisma.player.update({
    where: { poolId_accessCode: { poolId: pool.id, accessCode: playerCode } },
    data: { hasViewedReveal: true }
  });

  redirect(`/pool/${pool.joinCode}?code=${playerCode}`);
}
