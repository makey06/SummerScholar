import { motion } from "framer-motion";

export default function LoadingBounce({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="flex gap-2">
        {["⭐", "🌟", "✨"].map((star, i) => (
          <motion.span
            key={i}
            className="text-3xl"
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          >
            {star}
          </motion.span>
        ))}
      </div>
      <p className="text-muted-foreground font-bold">{message}</p>
    </div>
  );
}
