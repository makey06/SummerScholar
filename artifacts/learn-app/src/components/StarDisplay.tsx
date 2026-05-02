import { motion } from "framer-motion";

interface StarDisplayProps {
  earned: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export default function StarDisplay({ earned, max = 3, size = "md" }: StarDisplayProps) {
  const sizes = { sm: "text-base", md: "text-xl", lg: "text-3xl" };
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
          className={`${sizes[size]} ${i < earned ? "opacity-100" : "opacity-25"}`}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}
