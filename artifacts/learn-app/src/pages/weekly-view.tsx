import { Link } from "wouter";
import { motion } from "framer-motion";
import { Lock, CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import { useListAllLessons, getListAllLessonsQueryKey, type LessonWithCategory } from "@workspace/api-client-react";
import LoadingBounce from "@/components/LoadingBounce";
import StarDisplay from "@/components/StarDisplay";
import { useState } from "react";

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

const weekThemes = [
  { emoji: "🌱", label: "Getting Started" },
  { emoji: "🌿", label: "Growing Strong" },
  { emoji: "🌸", label: "Blooming Skills" },
  { emoji: "☀️", label: "Sunshine Learning" },
  { emoji: "🌈", label: "Rainbow Week" },
  { emoji: "⭐", label: "Star Power" },
  { emoji: "🚀", label: "Blast Off!" },
  { emoji: "🏆", label: "Champion Week" },
];

export default function WeeklyView() {
  const { data: lessons, isLoading } = useListAllLessons({
    query: { queryKey: getListAllLessonsQueryKey() },
  });

  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([1, 2]));

  function toggleWeek(week: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  }

  if (isLoading) return <LoadingBounce message="Loading all lessons..." />;

  const byWeek = new Map<number, LessonWithCategory[]>();
  for (const lesson of lessons ?? []) {
    if (!byWeek.has(lesson.week)) byWeek.set(lesson.week, []);
    byWeek.get(lesson.week)!.push(lesson);
  }
  const weeks = [...byWeek.entries()].sort(([a], [b]) => a - b);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {weeks.map(([week, weekLessons], wi) => {
        const theme = weekThemes[week - 1] ?? { emoji: "📚", label: `Week ${week}` };
        const totalLessons = weekLessons.length;
        const completedLessons = weekLessons.filter(
          (l) => l.completedActivities >= l.totalActivities && l.totalActivities > 0
        ).length;
        const isExpanded = expandedWeeks.has(week);

        const bySubject = new Map<string, typeof weekLessons>();
        for (const l of weekLessons) {
          if (!bySubject.has(l.categorySlug)) bySubject.set(l.categorySlug, []);
          bySubject.get(l.categorySlug)!.push(l);
        }

        return (
          <motion.div
            key={week}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: wi * 0.06 }}
            className="bg-card rounded-3xl border border-card-border shadow-sm overflow-hidden"
          >
            {/* Week header — clickable to expand/collapse */}
            <button
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
              onClick={() => toggleWeek(week)}
            >
              <span className="text-3xl">{theme.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-fredoka text-xl text-foreground">
                  Week {week} — {theme.label}
                </div>
                <div className="text-xs text-muted-foreground font-semibold mt-0.5">
                  {completedLessons}/{totalLessons} lessons done
                </div>
              </div>
              {/* Progress pill */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-20 h-2 rounded-full bg-muted overflow-hidden hidden sm:block">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0}%` }}
                  />
                </div>
                {isExpanded ? (
                  <ChevronDown size={18} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={18} className="text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Expanded lessons grouped by subject */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
                {[...bySubject.entries()].map(([slug, subjectLessons]) => {
                  const first = subjectLessons[0];
                  return (
                    <div key={slug}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{first.categoryEmoji}</span>
                        <span className="font-bold text-sm text-foreground">{first.categoryName}</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="space-y-2 pl-1">
                        {subjectLessons.map((lesson) => {
                          const isComplete =
                            lesson.completedActivities >= lesson.totalActivities &&
                            lesson.totalActivities > 0;
                          const isLocked = !lesson.isUnlocked;

                          return isLocked ? (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 bg-muted/40 rounded-2xl p-3 opacity-60 border border-border"
                            >
                              <Lock size={16} className="text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-muted-foreground text-sm truncate">
                                  {lesson.title}
                                </div>
                                <div className="text-xs text-muted-foreground">Locked</div>
                              </div>
                            </div>
                          ) : (
                            <motion.div
                              key={lesson.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Link href={`/lessons/${lesson.id}`}>
                                <div
                                  className={`flex items-center gap-3 rounded-2xl p-3 border cursor-pointer transition-shadow hover:shadow-sm ${
                                    isComplete
                                      ? "bg-green-50/70 border-green-200"
                                      : "bg-white border-card-border"
                                  }`}
                                >
                                  <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                    style={{ background: `${lesson.categoryColorHex}33` }}
                                  >
                                    {isComplete ? "✅" : "📖"}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-bold text-foreground text-sm truncate">
                                      {lesson.title}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span
                                        className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                                          difficultyColors[lesson.difficulty] ??
                                          "bg-muted text-muted-foreground"
                                        }`}
                                      >
                                        {lesson.difficulty}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-semibold">
                                        {lesson.completedActivities}/{lesson.totalActivities}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    {isComplete ? (
                                      <CheckCircle size={16} className="text-green-500" />
                                    ) : (
                                      <StarDisplay
                                        earned={
                                          lesson.starsEarned > 0
                                            ? Math.min(
                                                3,
                                                Math.ceil(
                                                  lesson.starsEarned / lesson.totalActivities
                                                )
                                              )
                                            : 0
                                        }
                                        max={3}
                                        size="sm"
                                      />
                                    )}
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
