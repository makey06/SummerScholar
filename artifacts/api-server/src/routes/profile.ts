import { Router } from "express";
import type { Request, Response } from "express";
import { db, profileTable } from "@workspace/db";
import { UpdateProfileBody } from "@workspace/api-zod";

const router = Router();

router.get("/profile", async (req: Request, res: Response): Promise<void> => {
  let profiles = await db.select().from(profileTable).limit(1);
  if (profiles.length === 0) {
    const inserted = await db.insert(profileTable).values({ name: "Explorer", avatarEmoji: "🦄" }).returning();
    profiles = inserted;
  }
  res.json(profiles[0]);
});

router.put("/profile", async (req: Request, res: Response): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  let profiles = await db.select().from(profileTable).limit(1);
  if (profiles.length === 0) {
    const inserted = await db.insert(profileTable).values(parsed.data).returning();
    res.json(inserted[0]);
    return;
  }
  const { eq } = await import("drizzle-orm");
  const updated = await db.update(profileTable).set(parsed.data).where(eq(profileTable.id, profiles[0].id)).returning();
  res.json(updated[0]);
});

export default router;
