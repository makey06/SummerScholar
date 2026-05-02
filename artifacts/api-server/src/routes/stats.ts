import { Router } from "express";
import type { Request, Response } from "express";
import { db, profileTable, categoriesTable, lessonsTable, activitiesTable, progressTable, achievementsTable } from "@workspace/db";
import { eq, asc, inArray } from "drizzle-orm";

const router = Router();

router.get("/stats/summary", async (req: Request, res: Response): Promise<void> => {
  const profiles = await db.select().from(profileTable).limit(1);
  const profile = profiles[0] ?? { totalStars: 0, currentStreak: 0 };

  const allProgress = await db.select().from(progressTable);
  const completedActivityIds = new Set(allProgress.map((p) => p.activityId));
  const totalActivitiesCompleted = completedActivityIds.size;

  // Count completed lessons
  const allActivities = await db.select({ id: activitiesTable.id, lessonId: activitiesTable.lessonId }).from(activitiesTable);
  const actsByLesson = new Map<number, number[]>();
  for (const act of allActivities) {
    if (!actsByLesson.has(act.lessonId)) actsByLesson.set(act.lessonId, []);
    actsByLesson.get(act.lessonId)!.push(act.id);
  }
  let totalLessonsCompleted = 0;
  for (const [, actIds] of actsByLesson) {
    if (actIds.length > 0 && actIds.every((id) => completedActivityIds.has(id))) totalLessonsCompleted++;
  }

  // Weeks
  const allLessons = await db.select({ week: lessonsTable.week }).from(lessonsTable);
  const totalWeeks = allLessons.length > 0 ? Math.max(...allLessons.map((l) => l.week)) : 8;
  const completedLessonIds = [...actsByLesson.entries()].filter(([, ids]) => ids.every((id) => completedActivityIds.has(id))).map(([lessonId]) => lessonId);
  const completedLessonsData = completedLessonIds.length > 0
    ? await db.select({ week: lessonsTable.week }).from(lessonsTable).where(inArray(lessonsTable.id, completedLessonIds))
    : [];
  const currentWeek = completedLessonsData.length > 0 ? Math.max(...completedLessonsData.map((l) => l.week)) : 1;

  // Category progress
  const categories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.sortOrder));
  const categoriesProgress = await Promise.all(
    categories.map(async (cat) => {
      const lessons = await db.select({ id: lessonsTable.id }).from(lessonsTable).where(eq(lessonsTable.categoryId, cat.id));
      const lessonIds = lessons.map((l) => l.id);
      let completedLessons = 0;
      let starsEarned = 0;
      if (lessonIds.length > 0) {
        const acts = await db.select({ id: activitiesTable.id, lessonId: activitiesTable.lessonId }).from(activitiesTable).where(inArray(activitiesTable.lessonId, lessonIds));
        const catActIds = acts.map((a) => a.id);
        if (catActIds.length > 0) {
          const catProgress = await db.select().from(progressTable).where(inArray(progressTable.activityId, catActIds));
          starsEarned = catProgress.reduce((sum, p) => sum + p.starsEarned, 0);
          const completedCatActivityIds = new Set(catProgress.map((p) => p.activityId));
          const actsByLessonCat = new Map<number, number[]>();
          for (const act of acts) {
            if (!actsByLessonCat.has(act.lessonId)) actsByLessonCat.set(act.lessonId, []);
            actsByLessonCat.get(act.lessonId)!.push(act.id);
          }
          for (const [, ids] of actsByLessonCat) {
            if (ids.length > 0 && ids.every((id) => completedCatActivityIds.has(id))) completedLessons++;
          }
        }
      }
      return { categoryId: cat.id, categoryName: cat.name, emoji: cat.emoji, colorHex: cat.colorHex, completedLessons, totalLessons: lessonIds.length, starsEarned };
    })
  );

  res.json({ totalStars: profile.totalStars, totalActivitiesCompleted, totalLessonsCompleted, currentStreak: profile.currentStreak, currentWeek, totalWeeks, categoriesProgress });
});

router.get("/stats/achievements", async (req: Request, res: Response): Promise<void> => {
  const achievements = await db.select().from(achievementsTable).orderBy(asc(achievementsTable.id));
  res.json(achievements.map((a) => ({
    id: a.id, slug: a.slug, name: a.name, description: a.description, emoji: a.emoji,
    isUnlocked: a.isUnlocked, unlockedAt: a.unlockedAt ?? null,
  })));
});

router.get("/stats/weekly", async (req: Request, res: Response): Promise<void> => {
  const allActivities = await db.select({ id: activitiesTable.id, lessonId: activitiesTable.lessonId }).from(activitiesTable);
  const actToLesson = new Map(allActivities.map((a) => [a.id, a.lessonId]));

  const allLessons = await db.select({ id: lessonsTable.id, week: lessonsTable.week }).from(lessonsTable);
  const lessonToWeek = new Map(allLessons.map((l) => [l.id, l.week]));

  const allProgress = await db.select().from(progressTable);
  const weekMap = new Map<number, { activitiesCompleted: number; starsEarned: number; lessonIds: Set<number> }>();
  for (const p of allProgress) {
    const lessonId = actToLesson.get(p.activityId);
    const week = lessonId != null ? (lessonToWeek.get(lessonId) ?? 1) : 1;
    if (!weekMap.has(week)) weekMap.set(week, { activitiesCompleted: 0, starsEarned: 0, lessonIds: new Set() });
    const entry = weekMap.get(week)!;
    entry.activitiesCompleted++;
    entry.starsEarned += p.starsEarned;
    if (lessonId != null) entry.lessonIds.add(lessonId);
  }

  const totalWeeks = allLessons.length > 0 ? Math.max(...allLessons.map((l) => l.week)) : 8;
  const result = Array.from({ length: totalWeeks }, (_, i) => {
    const week = i + 1;
    const entry = weekMap.get(week);
    return { week, activitiesCompleted: entry?.activitiesCompleted ?? 0, starsEarned: entry?.starsEarned ?? 0, lessonsCompleted: entry?.lessonIds.size ?? 0 };
  });

  res.json(result);
});

export default router;
