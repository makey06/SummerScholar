import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetLesson,
  useRecordProgress,
  getGetLessonQueryKey,
  getListProgressQueryKey,
  getGetStatsSummaryQueryKey,
  getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import LoadingBounce from "@/components/LoadingBounce";
import Confetti from "@/components/Confetti";

// ─── Activity content types ────────────────────────────────────────
interface SightWordContent { word: string; emoji: string; hint: string; options: string[]; correctAnswer: string; }
interface SpellingContent { word: string; emoji: string; hint: string; letters: string[]; }
interface RhymeContent { word: string; options: string[]; correctAnswer: string; }
interface CountingContent { objects: string[]; count: number; options: number[]; correctAnswer: number; }
interface PatternContent { sequence: string[]; options: string[]; correctAnswer: string; }
interface ReadingContent { passage: string; question: string; options: string[]; correctAnswer: string; }
interface AdditionContent { a: number; b: number; c?: number; emoji: string; story: string | null; objects: string[]; correctAnswer: number; options: number[]; }
interface LetterContent { uppercase: string; options: string[]; correctAnswer: string; emoji: string; }

// ─── Shuffle utility ───────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Shared helpers ────────────────────────────────────────────────
function ChoiceButton({ label, onClick, correct, wrong, disabled }: {
  label: string; onClick: () => void; correct?: boolean; wrong?: boolean; disabled: boolean;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-4 px-4 rounded-2xl font-fredoka text-xl border-2 shadow-sm transition-colors ${
        correct ? "bg-green-400 border-green-500 text-white" :
        wrong   ? "bg-red-300 border-red-400 text-white" :
                  "bg-white border-border text-foreground hover:bg-primary/10 hover:border-primary"
      }`}
    >
      {label}
    </motion.button>
  );
}

// ─── Sight Word ───────────────────────────────────────────────────
function SightWordActivity({ content, onComplete }: { content: SightWordContent; onComplete: (stars: number) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [options] = useState(() => shuffle(content.options));

  function pick(opt: string) {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onComplete(opt === content.correctAnswer ? 3 : 1), 900);
  }

  return (
    <div className="space-y-6 text-center">
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
        className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 mx-4">
        <div className="text-6xl mb-3">{content.emoji}</div>
        <div className="font-fredoka text-6xl text-primary tracking-wide">{content.word}</div>
        <div className="text-muted-foreground font-semibold mt-2 text-sm">{content.hint}</div>
      </motion.div>
      <div className="px-4 space-y-2">
        <p className="font-bold text-muted-foreground text-sm mb-3">Tap the word you just read!</p>
        {options.map((opt) => (
          <ChoiceButton key={opt} label={opt} onClick={() => pick(opt)}
            correct={selected !== null && opt === content.correctAnswer}
            wrong={selected === opt && opt !== content.correctAnswer}
            disabled={selected !== null} />
        ))}
      </div>
    </div>
  );
}

// ─── Spelling Drag ────────────────────────────────────────────────
function SpellingActivity({ content, onComplete }: { content: SpellingContent; onComplete: (stars: number) => void }) {
  const [typed, setTyped] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState(false);

  function addLetter(l: string) {
    if (done) return;
    setTyped((prev) => [...prev, l]);
  }
  function removeLetter() {
    if (done) return;
    setTyped((prev) => prev.slice(0, -1));
  }
  function check() {
    const attempt = typed.join("").toLowerCase();
    if (attempt === content.word.toLowerCase()) {
      setDone(true);
      setTimeout(() => onComplete(3), 700);
    } else {
      setWrong(true);
      setTimeout(() => { setWrong(false); setTyped([]); }, 800);
    }
  }

  const shuffled = [...content.letters];

  return (
    <div className="space-y-6 text-center px-4">
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-6">
        <div className="text-5xl mb-2">{content.emoji}</div>
        <div className="text-muted-foreground font-bold">{content.hint}</div>
      </motion.div>

      {/* Answer slots */}
      <div className="flex justify-center gap-2 flex-wrap">
        {content.word.split("").map((_, i) => (
          <motion.div key={i} animate={wrong ? { x: [-4,4,-4,4,0] } : {}} transition={{ duration: 0.3 }}
            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-fredoka text-2xl font-black ${
              typed[i]
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white border-dashed border-border"
            }`}
          >
            {typed[i] ?? ""}
          </motion.div>
        ))}
      </div>

      {/* Letter tiles */}
      <div className="flex flex-wrap justify-center gap-2">
        {shuffled.map((l, i) => (
          <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => addLetter(l)}
            className="w-11 h-11 bg-secondary/70 rounded-xl font-fredoka text-xl font-black text-foreground border-2 border-secondary shadow-sm">
            {l}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-2 justify-center">
        <motion.button whileTap={{ scale: 0.95 }} onClick={removeLetter}
          className="px-4 py-2 bg-muted rounded-xl font-bold text-sm text-muted-foreground">
          ← Delete
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={check}
          disabled={typed.length === 0}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-fredoka text-lg disabled:opacity-40 shadow-sm">
          Check!
        </motion.button>
      </div>
    </div>
  );
}

// ─── Rhyme Match ──────────────────────────────────────────────────
function RhymeActivity({ content, onComplete }: { content: RhymeContent; onComplete: (stars: number) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [options] = useState(() => shuffle(content.options));

  function pick(opt: string) {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onComplete(opt === content.correctAnswer ? 3 : 1), 900);
  }

  return (
    <div className="space-y-6 text-center px-4">
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
        className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-3xl p-8">
        <div className="text-4xl mb-2">🎵</div>
        <div className="font-fredoka text-5xl text-blue-600">{content.word}</div>
        <div className="text-muted-foreground font-bold mt-2">Which word rhymes with this?</div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <motion.button key={opt}
            whileHover={!selected ? { scale: 1.05 } : {}} whileTap={!selected ? { scale: 0.95 } : {}}
            onClick={() => pick(opt)} disabled={!!selected}
            className={`py-5 rounded-2xl font-fredoka text-2xl border-2 shadow-sm transition-colors ${
              selected
                ? opt === content.correctAnswer ? "bg-green-400 border-green-500 text-white"
                  : selected === opt ? "bg-red-300 border-red-400 text-white"
                  : "bg-white border-border text-muted-foreground"
                : "bg-white border-border text-foreground hover:bg-primary/10 hover:border-primary"
            }`}
            data-testid={`button-rhyme-${opt}`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Counting ─────────────────────────────────────────────────────
function CountingActivity({ content, onComplete }: { content: CountingContent; onComplete: (stars: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [options] = useState(() => shuffle(content.options));

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    setTimeout(() => onComplete(n === content.correctAnswer ? 3 : 1), 900);
  }

  return (
    <div className="space-y-6 text-center px-4">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6">
        <p className="font-bold text-muted-foreground mb-3">How many do you see?</p>
        <div className="flex flex-wrap justify-center gap-1 max-h-36 overflow-y-auto">
          {content.objects.map((obj, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04, type: "spring" }}
              className="text-2xl">{obj}</motion.span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((n) => (
          <motion.button key={n}
            whileHover={selected === null ? { scale: 1.05 } : {}} whileTap={selected === null ? { scale: 0.95 } : {}}
            onClick={() => pick(n)} disabled={selected !== null}
            className={`py-5 rounded-2xl font-fredoka text-3xl border-2 shadow-sm transition-colors ${
              selected !== null
                ? n === content.correctAnswer ? "bg-green-400 border-green-500 text-white"
                  : selected === n ? "bg-red-300 border-red-400 text-white"
                  : "bg-white border-border text-muted-foreground"
                : "bg-white border-border text-foreground hover:bg-primary/10 hover:border-primary"
            }`}
            data-testid={`button-count-${n}`}
          >
            {n}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Pattern Fill ─────────────────────────────────────────────────
function PatternActivity({ content, onComplete }: { content: PatternContent; onComplete: (stars: number) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [options] = useState(() => shuffle(content.options));

  function pick(opt: string) {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onComplete(opt === content.correctAnswer ? 3 : 1), 900);
  }

  return (
    <div className="space-y-6 text-center px-4">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6">
        <p className="font-bold text-muted-foreground mb-4">What comes next in the pattern?</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {content.sequence.map((item, i) => (
            <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08, type: "spring" }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                item === "❓" ? "border-2 border-dashed border-primary bg-primary/10" : "bg-white shadow-sm"
              }`}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <motion.button key={opt}
            whileHover={!selected ? { scale: 1.1 } : {}} whileTap={!selected ? { scale: 0.9 } : {}}
            onClick={() => pick(opt)} disabled={!!selected}
            className={`h-16 rounded-2xl text-3xl border-2 shadow-sm transition-colors ${
              selected
                ? opt === content.correctAnswer ? "bg-green-400 border-green-500"
                  : selected === opt ? "bg-red-300 border-red-400"
                  : "bg-white border-border opacity-50"
                : "bg-white border-border hover:bg-primary/10 hover:border-primary"
            }`}
            data-testid={`button-pattern-${opt}`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Reading Passage ──────────────────────────────────────────────
function ReadingActivity({ content, onComplete }: { content: ReadingContent; onComplete: (stars: number) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  function pick(opt: string) {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onComplete(opt === content.correctAnswer ? 3 : 1), 1000);
  }

  return (
    <div className="space-y-5 px-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-100">
        <div className="text-2xl mb-3 text-center">📖</div>
        <p className="text-foreground font-semibold text-base leading-relaxed text-center">{content.passage}</p>
      </motion.div>

      <div className="bg-card rounded-2xl p-4 border border-card-border">
        <p className="font-bold text-foreground mb-3 text-center">{content.question}</p>
        <div className="space-y-2">
          {content.options.map((opt) => (
            <ChoiceButton key={opt} label={opt} onClick={() => pick(opt)}
              correct={selected !== null && opt === content.correctAnswer}
              wrong={selected === opt && opt !== content.correctAnswer}
              disabled={selected !== null} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Addition ─────────────────────────────────────────────────────
function AdditionActivity({ content, onComplete }: { content: AdditionContent; onComplete: (stars: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [options] = useState(() => shuffle(content.options));

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    setTimeout(() => onComplete(n === content.correctAnswer ? 3 : 1), 900);
  }

  const groupA = Array(content.a).fill(content.emoji);
  const groupB = Array(content.b).fill(content.emoji);
  const groupC = content.c != null ? Array(content.c).fill(content.emoji) : [];

  return (
    <div className="space-y-6 text-center px-4">
      {content.story && (
        <div className="bg-yellow-50 rounded-2xl p-3 border border-yellow-100">
          <p className="font-semibold text-foreground text-sm">{content.story}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-6">
        <div className="flex items-center justify-center gap-3 flex-wrap text-3xl">
          <div className="flex flex-wrap justify-center gap-1 max-w-[120px]">
            {groupA.map((e, i) => <span key={i}>{e}</span>)}
          </div>
          <span className="font-fredoka text-4xl text-primary">+</span>
          <div className="flex flex-wrap justify-center gap-1 max-w-[120px]">
            {groupB.map((e, i) => <span key={i}>{e}</span>)}
          </div>
          {groupC.length > 0 && (
            <>
              <span className="font-fredoka text-4xl text-primary">+</span>
              <div className="flex flex-wrap justify-center gap-1 max-w-[120px]">
                {groupC.map((e, i) => <span key={i}>{e}</span>)}
              </div>
            </>
          )}
          <span className="font-fredoka text-4xl text-muted-foreground">= ?</span>
        </div>
        <div className="font-fredoka text-xl text-muted-foreground mt-3">
          {content.a} + {content.b}{content.c != null ? ` + ${content.c}` : ""} = ?
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((n) => (
          <motion.button key={n}
            whileHover={selected === null ? { scale: 1.05 } : {}} whileTap={selected === null ? { scale: 0.95 } : {}}
            onClick={() => pick(n)} disabled={selected !== null}
            className={`py-5 rounded-2xl font-fredoka text-3xl border-2 shadow-sm transition-colors ${
              selected !== null
                ? n === content.correctAnswer ? "bg-green-400 border-green-500 text-white"
                  : selected === n ? "bg-red-300 border-red-400 text-white"
                  : "bg-white border-border text-muted-foreground"
                : "bg-white border-border text-foreground hover:bg-primary/10 hover:border-primary"
            }`}
            data-testid={`button-add-${n}`}
          >
            {n}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Letter Match ─────────────────────────────────────────────────
function LetterMatchActivity({ content, onComplete }: { content: LetterContent; onComplete: (stars: number) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [options] = useState(() => shuffle(content.options));

  function pick(opt: string) {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onComplete(opt === content.correctAnswer ? 3 : 1), 900);
  }

  return (
    <div className="space-y-6 text-center px-4">
      <motion.div initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 mx-4">
        <div className="text-5xl mb-2">{content.emoji}</div>
        <div className="font-fredoka text-8xl text-primary">{content.uppercase}</div>
        <div className="text-muted-foreground font-bold mt-2">Find the matching lowercase letter!</div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <motion.button key={opt}
            whileHover={!selected ? { scale: 1.05 } : {}} whileTap={!selected ? { scale: 0.95 } : {}}
            onClick={() => pick(opt)} disabled={!!selected}
            className={`py-5 rounded-2xl font-fredoka text-4xl border-2 shadow-sm transition-colors ${
              selected
                ? opt === content.correctAnswer ? "bg-green-400 border-green-500 text-white"
                  : selected === opt ? "bg-red-300 border-red-400 text-white"
                  : "bg-white border-border text-muted-foreground opacity-50"
                : "bg-white border-border text-foreground hover:bg-primary/10 hover:border-primary"
            }`}
            data-testid={`button-letter-${opt}`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Celebration ─────────────────────────────────────────────────
function ActivityCelebration({ stars, onNext, isLast }: { stars: number; onNext: () => void; isLast: boolean }) {
  const messages = stars === 3
    ? ["Amazing!", "Perfect!", "You're a star!", "Brilliant!"]
    : ["Good try!", "Nice job!", "Keep going!", "You got this!"];
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4"
    >
      <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.6 }} className="text-7xl">
        {stars === 3 ? "🌟" : "⭐"}
      </motion.div>
      <h2 className="font-fredoka text-4xl text-foreground">{msg}</h2>
      <div className="flex gap-1">
        {Array(3).fill(0).map((_, i) => (
          <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 * i, type: "spring" }}
            className={`text-3xl ${i < stars ? "opacity-100" : "opacity-25"}`}>⭐</motion.span>
        ))}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="bg-primary text-primary-foreground font-fredoka text-xl px-10 py-3 rounded-2xl shadow-md mt-2"
        data-testid="button-next-activity"
      >
        {isLast ? "Finish Lesson!" : "Next Activity!"}
      </motion.button>
    </motion.div>
  );
}

// ─── Lesson Complete ─────────────────────────────────────────────
function LessonComplete({ totalStars, lessonTitle, onHome }: { totalStars: number; lessonTitle: string; onHome: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-10 px-6 text-center space-y-5"
    >
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-8xl">🏆</motion.div>
      <div>
        <h2 className="font-fredoka text-4xl text-foreground">Lesson Complete!</h2>
        <p className="text-muted-foreground font-semibold mt-1">{lessonTitle}</p>
      </div>
      <div className="flex gap-2">
        {Array(totalStars > 9 ? 9 : totalStars).fill(0).map((_, i) => (
          <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.08 * i, type: "spring" }} className="text-3xl">⭐</motion.span>
        ))}
      </div>
      <div className="bg-secondary/30 rounded-2xl px-6 py-3">
        <div className="font-fredoka text-3xl text-foreground">⭐ {totalStars} Stars Earned!</div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={onHome}
        className="bg-primary text-primary-foreground font-fredoka text-xl px-10 py-3 rounded-2xl shadow-md"
        data-testid="button-home-after-lesson"
      >
        Back to Home
      </motion.button>
    </motion.div>
  );
}

// ─── Main Lesson Player ───────────────────────────────────────────
export default function LessonPlayer() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = Number(params.lessonId);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useGetLesson(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) },
  });

  const recordProgress = useRecordProgress();

  const [activityIndex, setActivityIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastStars, setLastStars] = useState(0);
  const [lessonDone, setLessonDone] = useState(false);
  const [totalStarsEarned, setTotalStarsEarned] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  if (isLoading) return <LoadingBounce message="Opening lesson..." />;
  if (!lesson) return <div className="text-center py-16 font-fredoka text-xl text-muted-foreground">Lesson not found</div>;

  const activities = [...lesson.activities].sort((a, b) => a.orderIndex - b.orderIndex);
  const currentActivity = activities[activityIndex];

  function handleActivityComplete(stars: number) {
    if (!currentActivity) return;
    setLastStars(stars);
    setShowCelebration(true);
    if (stars >= 2) { setConfettiTrigger(true); setTimeout(() => setConfettiTrigger(false), 50); }

    recordProgress.mutate(
      { data: { activityId: currentActivity.id, starsEarned: stars } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProgressQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsSummaryQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetLessonQueryKey(lessonId) });
        },
      }
    );

    setTotalStarsEarned((prev) => prev + stars);
  }

  function handleNext() {
    setShowCelebration(false);
    if (activityIndex + 1 >= activities.length) {
      setConfettiTrigger(true);
      setTimeout(() => setConfettiTrigger(false), 50);
      setLessonDone(true);
    } else {
      setActivityIndex((prev) => prev + 1);
    }
  }

  function renderActivity() {
    if (!currentActivity) return null;
    let content: unknown;
    try { content = JSON.parse(currentActivity.contentJson); } catch { return <div>Error loading activity</div>; }

    switch (currentActivity.type) {
      case "sight_word_flash": return <SightWordActivity content={content as SightWordContent} onComplete={handleActivityComplete} />;
      case "spelling_drag":    return <SpellingActivity  content={content as SpellingContent}   onComplete={handleActivityComplete} />;
      case "rhyme_match":      return <RhymeActivity     content={content as RhymeContent}       onComplete={handleActivityComplete} />;
      case "counting_tap":     return <CountingActivity  content={content as CountingContent}    onComplete={handleActivityComplete} />;
      case "pattern_fill":     return <PatternActivity   content={content as PatternContent}     onComplete={handleActivityComplete} />;
      case "reading_passage":  return <ReadingActivity   content={content as ReadingContent}     onComplete={handleActivityComplete} />;
      case "addition_basic":   return <AdditionActivity  content={content as AdditionContent}    onComplete={handleActivityComplete} />;
      case "letter_match":     return <LetterMatchActivity content={content as LetterContent}    onComplete={handleActivityComplete} />;
      default: return <div className="text-center py-8 text-muted-foreground">Unknown activity type</div>;
    }
  }

  return (
    <div className="max-w-lg mx-auto px-0 py-4">
      <Confetti trigger={confettiTrigger} />

      {/* Header */}
      <div className="px-4 mb-4">
        <button onClick={() => setLocation(`/categories/${lesson.categoryId}`)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-bold text-sm mb-3"
          data-testid="button-back-lesson">
          <ChevronLeft size={16} /> Back
        </button>

        {!lessonDone && (
          <>
            <h1 className="font-fredoka text-xl text-foreground">{lesson.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              {activities.map((_, i) => (
                <div key={i} className={`h-2 rounded-full flex-1 transition-colors ${
                  i < activityIndex ? "bg-green-400" :
                  i === activityIndex ? "bg-primary" :
                  "bg-muted"
                }`} />
              ))}
              <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                {activityIndex + 1}/{activities.length}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {lessonDone ? (
          <LessonComplete
            key="complete"
            totalStars={totalStarsEarned}
            lessonTitle={lesson.title}
            onHome={() => setLocation("/")}
          />
        ) : showCelebration ? (
          <ActivityCelebration
            key={`celebrate-${activityIndex}`}
            stars={lastStars}
            onNext={handleNext}
            isLast={activityIndex + 1 >= activities.length}
          />
        ) : (
          <motion.div
            key={`activity-${activityIndex}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {renderActivity()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
