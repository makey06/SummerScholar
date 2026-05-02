import { Router } from "express";
import type { Request, Response } from "express";
import { db, progressTable, profileTable, activitiesTable, lessonsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { RecordProgressBody } from "@workspace/api-zod";

const router = Router();

router.get("/progress", async (req: Request, res: Response): Promise<void> => {
  const records = await db.select().from(progressTable);
  res.json(records.map((r) => ({ id: r.id, activityId: r.activityId, starsEarned: r.starsEarned, completedAt: r.completedAt })));
});

router.post("/progress/record", async (req: Request, res: Response): Promise<void> => {
  const parsed = RecordProgressBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request body" }); return; }
  const { activityId, starsEarned } = parsed.data;

  const existing = await db.select().from(progressTable).where(eq(progressTable.activityId, activityId)).limit(1);
  let record;
  if (existing.length > 0) {
    const updated = await db.update(progressTable).set({ starsEarned }).where(eq(progressTable.activityId, activityId)).returning();
    record = updated[0];
  } else {
    const inserted = await db.insert(progressTable).values({ activityId, starsEarned }).returning();
    record = inserted[0];
  }

  // Update profile total stars
  const allProgress = await db.select({ starsEarned: progressTable.starsEarned }).from(progressTable);
  const totalStars = allProgress.reduce((sum, p) => sum + p.starsEarned, 0);

  // Calculate streak (simplified: count distinct days with completions)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const profiles = await db.select().from(profileTable).limit(1);
  if (profiles.length > 0) {
    await db.update(profileTable).set({ totalStars }).where(eq(profileTable.id, profiles[0].id));
  }

  res.json({ id: record.id, activityId: record.activityId, starsEarned: record.starsEarned, completedAt: record.completedAt });
});

export default router;
