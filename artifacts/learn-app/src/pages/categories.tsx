import { Link } from "wouter";
import { motion } from "framer-motion";
import { LayoutGrid, CalendarDays } from "lucide-react";
import { useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import LoadingBounce from "@/components/LoadingBounce";
import ProgressRing from "@/components/ProgressRing";
import WeeklyView from "./weekly-view";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

type Tab = "subjects" | "weeks";

export default function Categories() {
  const [tab, setTab] = useState<Tab>("subjects");
  const { data: categories, isLoading } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });

  if (isLoading) return <LoadingBounce message="Loading subjects..." />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
        <h1 className="font-fredoka text-3xl text-foreground">Choose Your Subject</h1>
        <p className="text-muted-foreground font-semibold mt-1">Every subject is a new world to explore!</p>
      </motion.div>

      {/* Tab toggle */}
      <div className="flex bg-muted/50 rounded-2xl p-1 mb-6 gap-1">
        <button
          onClick={() => setTab("subjects")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-fredoka text-base transition-all ${
            tab === "subjects"
              ? "bg-white shadow-sm text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutGrid size={17} />
          By Subject
        </button>
        <button
          onClick={() => setTab("weeks")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-fredoka text-base transition-all ${
            tab === "weeks"
              ? "bg-white shadow-sm text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarDays size={17} />
          By Week
        </button>
      </div>

      {tab === "subjects" ? (
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          {(categories ?? []).map((cat) => {
            const pct = cat.totalLessons > 0 ? Math.round((cat.completedLessons / cat.totalLessons) * 100) : 0;
            return (
              <motion.div key={cat.id} variants={itemVariants} whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.96 }}>
                <Link href={`/categories/${cat.id}`}>
                  <div
                    className="rounded-3xl p-5 cursor-pointer relative overflow-hidden shadow-md border-2 border-white/30 min-h-[160px] flex flex-col justify-between"
                    style={{ background: `linear-gradient(145deg, ${cat.colorHex}ee, ${cat.colorHex}99)` }}
                    data-testid={`card-category-${cat.id}`}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="text-4xl bg-white/20 rounded-2xl p-2">{cat.emoji}</div>
                      <div className="relative flex items-center justify-center">
                        <ProgressRing value={cat.completedLessons} max={cat.totalLessons} size={48} strokeWidth={5} color="white" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-[10px] font-black">{pct}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div>
                      <div className="font-fredoka text-xl text-white drop-shadow-sm">{cat.name}</div>
                      <div className="text-white/80 text-xs font-semibold mt-0.5">{cat.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white/90 text-xs font-bold">
                          {cat.completedLessons}/{cat.totalLessons} lessons
                        </span>
                        {cat.completedLessons > 0 && (
                          <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {cat.completedLessons === cat.totalLessons ? "Complete!" : "In Progress"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/10 rounded-full pointer-events-none" />
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full pointer-events-none" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <WeeklyView />
      )}
    </div>
  );
}
