import { Router } from "express";
import type { Request, Response } from "express";
import { db, categoriesTable, lessonsTable, activitiesTable, progressTable } from "@workspace/db";
import { eq, asc, inArray, sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req: Request, res: Response): Promise<void> => {
  const categories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder));

  const result = await Promise.all(
    categories.map(async (cat) => {
      const lessons = await db.select({ id: lessonsTable.id }).from(lessonsTable).where(eq(lessonsTable.categoryId, cat.id));
      const lessonIds = lessons.map((l) => l.id);
      let completedLessons = 0;
      if (lessonIds.length > 0) {
        const activities = await db.select({ id: activitiesTable.id, lessonId: activitiesTable.lessonId }).from(activitiesTable).where(inArray(activitiesTable.lessonId, lessonIds));
        const activityIds = activities.map((a) => a.id);
        if (activityIds.length > 0) {
          const completedActivityIds = new Set(
            (await db.select({ activityId: progressTable.activityId }).from(progressTable).where(inArray(progressTable.activityId, activityIds))).map((p) => p.activityId)
          );
          const completedByLesson = new Map<number, number>();
          const totalByLesson = new Map<number, number>();
          for (const act of activities) {
            totalByLesson.set(act.lessonId, (totalByLesson.get(act.lessonId) ?? 0) + 1);
            if (completedActivityIds.has(act.id)) {
              completedByLesson.set(act.lessonId, (completedByLesson.get(act.lessonId) ?? 0) + 1);
            }
          }
          for (const lessonId of lessonIds) {
            const total = totalByLesson.get(lessonId) ?? 0;
            const done = completedByLesson.get(lessonId) ?? 0;
            if (total > 0 && done >= total) completedLessons++;
          }
        }
      }
      return {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        emoji: cat.emoji,
        colorHex: cat.colorHex,
        totalLessons: lessonIds.length,
        completedLessons,
      };
    })
  );

  res.json(result);
});

export default router;
