import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetStatsSummary, useGetProfile, useListAchievements, getGetStatsSummaryQueryKey } from "@workspace/api-client-react";
import LoadingBounce from "@/components/LoadingBounce";
import ProgressRing from "@/components/ProgressRing";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Home() {
  const profile = useGetProfile();
  const stats = useGetStatsSummary({ query: { queryKey: getGetStatsSummaryQueryKey() } });
  const achievements = useListAchievements();

  if (profile.isLoading || stats.isLoading) return <LoadingBounce message="Getting your adventure ready!" />;

  const profileData = profile.data;
  const statsData = stats.data;
  const unlockedBadges = (achievements.data ?? []).filter((a) => a.isUnlocked).slice(0, 3);

  const timeOfDay = new Date().getHours();
  const greeting = timeOfDay < 12 ? "Good morning" : timeOfDay < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Hero greeting */}
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-6 text-center relative overflow-hidden"
      >
        <motion.div variants={itemVariants} className="text-6xl mb-2 float">{profileData?.avatarEmoji ?? "🦄"}</motion.div>
        <motion.h1 variants={itemVariants} className="font-fredoka text-3xl text-foreground">
          {greeting}, {profileData?.name ?? "Explorer"}!
        </motion.h1>
        <motion.p variants={itemVariants} className="text-muted-foreground font-semibold mt-1">
          Ready for today's adventure?
        </motion.p>

        <motion.div variants={itemVariants} className="flex justify-center gap-4 mt-4">
          <div className="bg-white/80 rounded-2xl px-4 py-3 text-center shadow-sm">
            <div className="font-fredoka text-3xl text-yellow-500">⭐ {statsData?.totalStars ?? 0}</div>
            <div className="text-xs font-bold text-muted-foreground">Total Stars</div>
          </div>
          <div className="bg-white/80 rounded-2xl px-4 py-3 text-center shadow-sm">
            <div className="font-fredoka text-3xl text-orange-500">🔥 {statsData?.currentStreak ?? 0}</div>
            <div className="text-xs font-bold text-muted-foreground">Day Streak</div>
          </div>
          <div className="bg-white/80 rounded-2xl px-4 py-3 text-center shadow-sm">
            <div className="font-fredoka text-3xl text-purple-500">📚 {statsData?.totalLessonsCompleted ?? 0}</div>
            <div className="text-xs font-bold text-muted-foreground">Lessons Done</div>
          </div>
        </motion.div>

        {/* Decorative background bubbles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/30 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-xl pointer-events-none" />
      </motion.div>

      {/* Week progress */}
      {statsData && (
        <motion.div variants={itemVariants} initial="hidden" animate="visible"
          className="bg-card rounded-2xl p-4 border border-card-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-fredoka text-lg text-foreground">Week {statsData.currentWeek} of {statsData.totalWeeks}</h2>
            <span className="text-sm font-bold text-muted-foreground">{statsData.totalActivitiesCompleted} activities done!</span>
          </div>
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((statsData.currentWeek / statsData.totalWeeks) * 100, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Subject cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-fredoka text-xl text-foreground">Choose a Subject</h2>
          <Link href="/categories">
            <span className="text-sm font-bold text-primary cursor-pointer hover:underline">See all</span>
          </Link>
        </div>
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          {(statsData?.categoriesProgress ?? []).slice(0, 4).map((cat) => (
            <motion.div key={cat.categoryId} variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href={`/categories/${cat.categoryId}`}>
                <div
                  className="rounded-2xl p-4 cursor-pointer relative overflow-hidden shadow-sm border border-white/20"
                  style={{ background: `linear-gradient(135deg, ${cat.colorHex}dd, ${cat.colorHex}88)` }}
                  data-testid={`card-category-${cat.categoryId}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{cat.emoji}</span>
                    <div className="relative">
                      <ProgressRing value={cat.completedLessons} max={cat.totalLessons} size={40} strokeWidth={4} color="white" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-[9px] font-black">
                          {cat.totalLessons > 0 ? Math.round((cat.completedLessons / cat.totalLessons) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="font-fredoka text-base text-white drop-shadow">{cat.categoryName}</div>
                    <div className="text-white/80 text-xs font-semibold">{cat.completedLessons}/{cat.totalLessons} lessons</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Recent achievements */}
      {unlockedBadges.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-4 border border-card-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-fredoka text-lg text-foreground">Recent Badges</h2>
            <Link href="/achievements">
              <span className="text-sm font-bold text-primary cursor-pointer hover:underline">See all</span>
            </Link>
          </div>
          <div className="flex gap-3">
            {unlockedBadges.map((badge) => (
              <motion.div key={badge.id} whileHover={{ scale: 1.1 }} className="flex flex-col items-center gap-1 text-center">
                <div className="text-3xl bg-secondary/30 rounded-2xl p-2 bounce-in">{badge.emoji}</div>
                <span className="text-xs font-bold text-foreground max-w-[64px] leading-tight">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Call to action if no progress */}
      {(statsData?.totalActivitiesCompleted ?? 0) === 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="text-center bg-gradient-to-br from-secondary/30 to-accent/20 rounded-3xl p-8 border border-secondary/30"
        >
          <div className="text-5xl mb-3 float">🚀</div>
          <h3 className="font-fredoka text-2xl text-foreground mb-2">Let's Start Your Adventure!</h3>
          <p className="text-muted-foreground font-semibold mb-4">Pick a subject and earn your first star!</p>
          <Link href="/categories">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-primary-foreground font-fredoka text-lg px-8 py-3 rounded-2xl shadow-md"
              data-testid="button-start-adventure"
            >
              Choose a Subject!
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
