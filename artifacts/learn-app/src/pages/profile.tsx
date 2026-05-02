import { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetProfile, useUpdateProfile, useGetStatsSummary, useListAchievements,
  getGetProfileQueryKey, getGetStatsSummaryQueryKey, getListAchievementsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import LoadingBounce from "@/components/LoadingBounce";

const AVATAR_OPTIONS = ["🦄", "🐱", "🐶", "🐸", "🦊", "🐼", "🐨", "🐯", "🦁", "🐻", "🐰", "🦋", "🐙", "🦖", "🦕", "🐳", "🐬", "🦜", "🦩", "🐧"];

export default function Profile() {
  const queryClient = useQueryClient();
  const profile = useGetProfile();
  const stats = useGetStatsSummary({ query: { queryKey: getGetStatsSummaryQueryKey() } });
  const achievements = useListAchievements({ query: { queryKey: getListAchievementsQueryKey() } });
  const updateProfile = useUpdateProfile();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatarEmoji, setAvatarEmoji] = useState("");
  const [saved, setSaved] = useState(false);

  function startEdit() {
    setName(profile.data?.name ?? "");
    setAvatarEmoji(profile.data?.avatarEmoji ?? "🦄");
    setEditing(true);
    setSaved(false);
  }

  function handleSave() {
    if (!name.trim()) return;
    updateProfile.mutate(
      { data: { name: name.trim(), avatarEmoji } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
          setEditing(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        },
      }
    );
  }

  if (profile.isLoading) return <LoadingBounce message="Loading profile..." />;

  const p = profile.data;
  const s = stats.data;
  const unlockedAchievements = (achievements.data ?? []).filter((a) => a.isUnlocked);
  const lockedAchievements = (achievements.data ?? []).filter((a) => !a.isUnlocked);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-fredoka text-3xl text-foreground">My Profile</h1>
      </motion.div>

      {/* Avatar + name */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-6 text-center relative overflow-hidden shadow-sm"
      >
        {editing ? (
          <div className="space-y-4">
            <div>
              <p className="font-bold text-sm text-muted-foreground mb-2">Pick your avatar</p>
              <div className="grid grid-cols-5 gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <motion.button
                    key={emoji} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setAvatarEmoji(emoji)}
                    className={`text-3xl p-1.5 rounded-xl transition-colors ${
                      avatarEmoji === emoji ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                    }`}
                    data-testid={`button-avatar-${emoji}`}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-bold text-sm text-muted-foreground mb-1">Your name</p>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={20}
                className="w-full border-2 border-primary/30 rounded-xl px-4 py-2 font-bold text-center text-foreground bg-white focus:outline-none focus:border-primary text-lg"
                data-testid="input-name"
              />
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleSave} disabled={updateProfile.isPending || !name.trim()}
                className="flex-1 bg-primary text-primary-foreground font-fredoka text-lg py-2 rounded-xl disabled:opacity-50"
                data-testid="button-save-profile"
              >
                {updateProfile.isPending ? "Saving..." : "Save!"}
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setEditing(false)}
                className="flex-1 bg-muted text-muted-foreground font-bold text-sm py-2 rounded-xl"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <motion.div className="text-7xl mb-2 float">{p?.avatarEmoji ?? "🦄"}</motion.div>
            <h2 className="font-fredoka text-3xl text-foreground">{p?.name ?? "Explorer"}</h2>
            {saved && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-green-600 font-bold text-sm mt-1">
                Profile saved!
              </motion.div>
            )}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={startEdit}
              className="mt-3 bg-white/80 text-primary font-bold text-sm px-4 py-2 rounded-xl border border-primary/20 shadow-sm"
              data-testid="button-edit-profile"
            >
              Edit Profile
            </motion.button>
          </>
        )}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary/30 rounded-full blur-xl pointer-events-none" />
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: "Total Stars", value: `⭐ ${p?.totalStars ?? 0}`, color: "from-yellow-100 to-orange-50" },
          { label: "Day Streak", value: `🔥 ${p?.currentStreak ?? 0}`, color: "from-orange-100 to-red-50" },
          { label: "Activities", value: `🎯 ${s?.totalActivitiesCompleted ?? 0}`, color: "from-purple-100 to-pink-50" },
          { label: "Lessons", value: `📚 ${s?.totalLessonsCompleted ?? 0}`, color: "from-green-100 to-teal-50" },
        ].map(({ label, value, color }) => (
          <motion.div
            key={label} whileHover={{ scale: 1.04 }}
            className={`bg-gradient-to-br ${color} rounded-2xl p-3 sm:p-4 text-center border border-white shadow-sm`}
          >
            <div className="font-fredoka text-xl sm:text-2xl text-foreground">{value}</div>
            <div className="text-xs font-bold text-muted-foreground mt-0.5">{label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summer progress bar */}
      {s && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 border border-card-border shadow-sm"
        >
          <h3 className="font-fredoka text-lg text-foreground mb-2">Summer Progress</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((s.currentWeek / s.totalWeeks) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">
              Week {s.currentWeek}/{s.totalWeeks}
            </span>
          </div>
        </motion.div>
      )}

      {/* Per-subject progress */}
      {s && s.categoriesProgress.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-card rounded-2xl p-4 border border-card-border shadow-sm space-y-3"
        >
          <h3 className="font-fredoka text-lg text-foreground">Progress by Subject</h3>
          {s.categoriesProgress.map((cp) => {
            const pct = cp.totalLessons > 0 ? Math.round((cp.completedLessons / cp.totalLessons) * 100) : 0;
            return (
              <div key={cp.categoryId}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cp.emoji}</span>
                    <span className="font-bold text-sm text-foreground">{cp.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold">
                      {cp.completedLessons}/{cp.totalLessons}
                    </span>
                    {cp.starsEarned > 0 && (
                      <span className="text-xs font-bold text-yellow-600">⭐{cp.starsEarned}</span>
                    )}
                  </div>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${cp.colorHex}cc, ${cp.colorHex})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Trophies */}
      {achievements.data && achievements.data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-card rounded-2xl p-4 border border-card-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-fredoka text-lg text-foreground">Trophies</h3>
            <span className="text-sm font-bold text-muted-foreground">
              {unlockedAchievements.length}/{achievements.data.length} earned
            </span>
          </div>

          {unlockedAchievements.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Unlocked 🎉</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {unlockedAchievements.map((a) => (
                  <motion.div
                    key={a.id}
                    whileHover={{ scale: 1.04 }}
                    className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-3 border border-yellow-200 text-center"
                  >
                    <div className="text-3xl mb-1">{a.emoji}</div>
                    <div className="font-fredoka text-sm text-foreground leading-tight">{a.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{a.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {lockedAchievements.length > 0 && (
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Still to earn 🔒</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {lockedAchievements.slice(0, 6).map((a) => (
                  <div
                    key={a.id}
                    className="bg-muted/40 rounded-xl p-3 border border-muted text-center opacity-60"
                  >
                    <div className="text-3xl mb-1 grayscale">{a.emoji}</div>
                    <div className="font-fredoka text-sm text-muted-foreground leading-tight">{a.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{a.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
