import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PIECES = ["⭐", "🌟", "✨", "🎉", "🎊", "💫", "🌈", "🎈"];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  angle: number;
  distance: number;
}

export default function Confetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: Date.now() + i,
      emoji: PIECES[i % PIECES.length],
      x: Math.random() * 100,
      angle: Math.random() * 360,
      distance: 60 + Math.random() * 80,
    }));
    setParticles(newParticles);
    const t = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-2xl"
            style={{ left: `${p.x}%`, top: "40%" }}
            initial={{ opacity: 1, scale: 0.5, y: 0, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: 1.5,
              y: -(p.distance + 80),
              rotate: p.angle,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
