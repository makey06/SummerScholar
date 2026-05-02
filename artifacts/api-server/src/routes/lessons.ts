import { Router } from "express";
import type { Request, Response } from "express";
import { db, lessonsTable, activitiesTable, progressTable } from "@workspace/db";
import { eq, asc, inArray } from "drizzle-orm";
import { ListLessonsParams, GetLessonParams } from "@workspace/api-zod";

const router = Router();

async function getLessonWithStats(lessonId: number) {
  const activities = await db.select().from(activitiesTable).where(eq(activitiesTable.lessonId, lessonId)).orderBy(asc(activitiesTable.orderIndex));
  const activityIds = activities.map((a) => a.id);
  const progressRecords = activityIds.length > 0
    ? await db.select().from(progressTable).where(inArray(progressTable.activityId, activityIds))
    : [];
  const completedActivityIds = new Set(progressRecords.map((p) => p.activityId));
  const starsEarned = progressRecords.reduce((sum, p) => sum + p.starsEarned, 0);
  return { activities, completedActivityIds, starsEarned };
}

router.get("/categories/:categoryId/lessons", async (req: Request, res: Response): Promise<void> => {
  const parsed = ListLessonsParams.safeParse(req.params);
  if (!parsed.success) { res.status(400).json({ error: "Invalid categoryId" }); return; }
  const { categoryId } = parsed.data;

  const lessons = await db.select().from(lessonsTable).where(eq(lessonsTable.categoryId, categoryId)).orderBy(asc(lessonsTable.week), asc(lessonsTable.dayOrder));

  const result = await Promise.all(
    lessons.map(async (lesson) => {
      const { activities, completedActivityIds, starsEarned } = await getLessonWithStats(lesson.id);
      return {
        id: lesson.id,
        categoryId: lesson.categoryId,
        title: lesson.title,
        week: lesson.week,
        dayOrder: lesson.dayOrder,
        difficulty: lesson.difficulty,
        totalActivities: activities.length,
        completedActivities: completedActivityIds.size,
        starsEarned,
        isUnlocked: lesson.isUnlocked,
      };
    })
  );

  res.json(result);
});

router.get("/lessons/:lessonId", async (req: Request, res: Response): Promise<void> => {
  const parsed = GetLessonParams.safeParse(req.params);
  if (!parsed.success) { res.status(400).json({ error: "Invalid lessonId" }); return; }
  const { lessonId } = parsed.data;

  const lessons = await db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId)).limit(1);
  if (lessons.length === 0) { res.status(404).json({ error: "Lesson not found" }); return; }
  const lesson = lessons[0];

  const { activities, completedActivityIds, starsEarned } = await getLessonWithStats(lessonId);

  const activitiesWithStatus = activities.map((act) => ({
    id: act.id,
    lessonId: act.lessonId,
    type: act.type,
    orderIndex: act.orderIndex,
    contentJson: act.contentJson,
    isCompleted: completedActivityIds.has(act.id),
    starsEarned: 0,
  }));

  res.json({
    id: lesson.id,
    categoryId: lesson.categoryId,
    title: lesson.title,
    week: lesson.week,
    dayOrder: lesson.dayOrder,
    difficulty: lesson.difficulty,
    totalActivities: activities.length,
    completedActivities: completedActivityIds.size,
    starsEarned,
    isUnlocked: lesson.isUnlocked,
    activities: activitiesWithStatus,
  });
});

export default router;
