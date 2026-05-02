import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Lock, CheckCircle } from "lucide-react";
import {
  useListCategories,
  useListLessons,
  getListCategoriesQueryKey,
  getListLessonsQueryKey,
} from "@workspace/api-client-react";
import LoadingBounce from "@/components/LoadingBounce";
import StarDisplay from "@/components/StarDisplay";

export default function CategoryView() {
  const params = useParams<{ categoryId: string }>();
  const categoryId = Number(params.categoryId);

  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const { data: lessons, isLoading } = useListLessons(categoryId, {
    query: { enabled: !!categoryId, queryKey: getListLessonsQueryKey(categoryId) },
  });

  const category = (categories ?? []).find((c) => c.id === categoryId);

  if (isLoading) return <LoadingBounce message="Loading lessons..." />;

  // Group by week
  const byWeek = new Map<number, typeof lessons>();
  for (const lesson of lessons ?? []) {
    if (!byWeek.has(lesson.week)) byWeek.set(lesson.week, []);
    byWeek.get(lesson.week)!.push(lesson);
  }
  const weeks = [...byWeek.entries()].sort(([a], [b]) => a - b);

  const difficultyColors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link href="/categories">
          <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-bold mb-3 text-sm" data-testid="button-back">
            <ChevronLeft size={16} /> Back to Subjects
          </button>
        </Link>

        {category && (
          <div
            className="rounded-3xl p-5 relative overflow-hidden shadow-md"
            style={{ background: `linear-gradient(135deg, ${category.colorHex}ee, ${category.colorHex}88)` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-5xl">{category.emoji}</span>
              <div>
                <h1 className="font-fredoka text-3xl text-white drop-shadow">{category.name}</h1>
                <p className="text-white/80 font-semibold text-sm">{category.description}</p>
                <div className="text-white/90 text-sm font-bold mt-1">
                  {category.completedLessons}/{category.totalLessons} lessons completed
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full pointer-events-none" />
          </div>
        )}
      </motion.div>

      {/* Weeks */}
      <div className="space-y-6">
        {weeks.map(([week, weekLessons], wi) => (
          <motion.div
            key={week}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: wi * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-primary text-primary-foreground font-fredoka text-sm px-3 py-1 rounded-full shadow">
                Week {week}
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-2">
              {(weekLessons ?? []).map((lesson, li) => {
                const isComplete = lesson.completedActivities >= lesson.totalActivities && lesson.totalActivities > 0;
                const isLocked = !lesson.isUnlocked;

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: wi * 0.1 + li * 0.06 }}
                    whileHover={!isLocked ? { scale: 1.02 } : {}}
                    whileTap={!isLocked ? { scale: 0.98 } : {}}
                    data-testid={`card-lesson-${lesson.id}`}
                  >
                    {isLocked ? (
                      <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3 border border-border opacity-60">
                        <Lock size={24} className="text-muted-foreground flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-bold text-muted-foreground">{lesson.title}</div>
                          <div className="text-xs text-muted-foreground">Complete earlier lessons to unlock</div>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/lessons/${lesson.id}`}>
                        <div
                          className={`bg-card rounded-2xl p-4 flex items-center gap-3 border cursor-pointer shadow-sm transition-shadow hover:shadow-md ${
                            isComplete ? "border-green-200 bg-green-50/50" : "border-card-border"
                          }`}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                            style={{ background: category ? `${category.colorHex}33` : "#f3e8ff" }}>
                            {isComplete ? "✅" : "📖"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-foreground">{lesson.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColors[lesson.difficulty] ?? "bg-muted text-muted-foreground"}`}>
                                {lesson.difficulty}
                              </span>
                              <span className="text-xs text-muted-foreground font-semibold">
                                {lesson.completedActivities}/{lesson.totalActivities} done
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {isComplete ? (
                              <CheckCircle size={20} className="text-green-500" />
                            ) : (
                              <StarDisplay earned={lesson.starsEarned > 0 ? Math.min(3, Math.ceil(lesson.starsEarned / lesson.totalActivities)) : 0} max={3} size="sm" />
                            )}
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {(lessons ?? []).length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <p className="font-fredoka text-xl text-muted-foreground">No lessons yet — check back soon!</p>
        </div>
      )}
    </div>
  );
}
