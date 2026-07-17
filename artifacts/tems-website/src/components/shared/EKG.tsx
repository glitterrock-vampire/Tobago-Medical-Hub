import { motion } from "framer-motion";

export function EKG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-full ${className}`}
    >
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        d="M0 10 h 20 l 3 -5 l 4 10 l 6 -15 l 6 20 l 4 -10 h 57"
      />
    </svg>
  );
}
