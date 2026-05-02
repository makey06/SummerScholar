import { motion } from "framer-motion";
import { useListAchievements, useGetStatsSummary, getListAchievementsQueryKey, getGetStatsSummaryQueryKey } from "@workspace/api-client-react";
import LoadingBounce from "@/components/LoadingBounce";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

export default function Achievements() {
  const { data: achievements, isLoading } = useListAchievements({ query: { queryKey: getListAchievementsQueryKey() } });
  const { data: stats } = useGetStatsSummary({ query: { queryKey: getGetStatsSummaryQueryKey() } });

  if (isLoading) return <LoadingBounce message="Opening trophy room..." />;

  const unlocked = (achievements ?? []).filter((a) => a.isUnlocked);
  const locked = (achievements ?? []).filter((a) => !a.isUnlocked);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-6xl mb-2 bounce-in">🏆</div>
        <h1 className="font-fredoka text-3xl text-foreground">Trophy Room</h1>
        <p className="text-muted-foreground font-semibold mt-1">
          {unlocked.length}/{(achievements ?? []).length} badges earned!
        </p>
      </motion.div>

      {/* Stars banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
        className="bg-gradient-to-r from-yellow-100 via-orange-50 to-yellow-100 rounded-2xl p-4 text-center border border-yellow-200 shadow-sm"
      >
        <div className="font-fredoka text-4xl text-yellow-600">⭐ {stats?.totalStars ?? 0} Stars</div>
        <div className="text-yellow-700 font-semibold text-sm mt-1">
          {stats?.totalActivitiesCompleted ?? 0} activities completed · {stats?.totalLessonsCompleted ?? 0} lessons finished
        </div>
      </motion.div>

      {/* Unlocked badges */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="font-fredoka text-xl text-foreground mb-3">Earned Badges</h2>
          <motion.div
            variants={containerVariants} initial="hidden" animate="visible"
            className="grid grid-cols-3 gap-3"
          >
            {unlocked.map((badge) => (
              <motion.div
                key={badge.id} variants={itemVariants}
                whileHover={{ scale: 1.08, rotate: 2 }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-3 text-center border-2 border-yellow-200 shadow-sm relative overflow-hidden"
                data-testid={`badge-${badge.slug}`}
              >
                <div className="text-4xl mb-1 star-burst">{badge.emoji}</div>
                <div className="font-bold text-sm text-foreground leading-tight">{badge.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{badge.description}</div>
                <div className="absolute top-1 right-1 text-yellow-400 text-xs">✨</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <div>
          <h2 className="font-fredoka text-xl text-muted-foreground mb-3">Still to Earn</h2>
          <motion.div
            variants={containerVariants} initial="hidden" animate="visible"
            className="grid grid-cols-3 gap-3"
          >
            {locked.map((badge) => (
              <motion.div
                key={badge.id} variants={itemVariants}
                className="bg-muted/40 rounded-2xl p-3 text-center border border-border relative"
                data-testid={`badge-locked-${badge.slug}`}
              >
                <div className="text-4xl mb-1 opacity-30 grayscale">{badge.emoji}</div>
                <div className="font-bold text-xs text-muted-foreground leading-tight">{badge.name}</div>
                <div className="text-[10px] text-muted-foreground/70 mt-0.5 leading-tight">{badge.description}</div>
                <div className="absolute top-1.5 right-1.5 text-muted-foreground text-xs">🔒</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {unlocked.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="text-center bg-muted/30 rounded-3xl p-8"
        >
          <div className="text-5xl mb-3 float">🌟</div>
          <h3 className="font-fredoka text-xl text-foreground mb-1">Start Earning Badges!</h3>
          <p className="text-muted-foreground font-semibold text-sm">Complete activities to unlock your first trophy.</p>
        </motion.div>
      )}
    </div>
  );
}
