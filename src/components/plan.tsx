"use client";

import { motion, useMotionValue, animate } from "motion/react";
import React from "react";

interface RubberBandCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function RubberBandCard({ children, className }: RubberBandCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = () => {
    animate(x, 0, {
      type: "spring",
      stiffness: 500,
      damping: 40,
      mass: 0.6,
    });

    animate(y, 0, {
      type: "spring",
      stiffness: 500,
      damping: 40,
      mass: 0.6,
    });
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-zinc-950">
      <motion.div
        drag
        dragElastic={0.4}
        dragMomentum={false}
        style={{ x, y }}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.015 }}
        className={`
          w-72 p-6 rounded-2xl bg-zinc-900/70 backdrop-blur-xl shadow-2xl
          border border-white/10 cursor-grab active:cursor-grabbing select-none
          ${className ?? ""}
        `}
      >
        {children}
      </motion.div>
    </div>
  );
}
