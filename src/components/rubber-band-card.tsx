"use client"

import { motion, useMotionValue, animate } from "motion/react"
import type React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ------------------------
// Variants
// ------------------------
const cardVariants = cva(
  "rounded-2xl cursor-grab active:cursor-grabbing select-none transition-all",
  {
    variants: {
      variant: {
        default:
          "dark:bg-gradient-to-br dark:from-zinc-900/30 dark:to-zinc-950/30 dark:backdrop-blur-xl dark:shadow-xl dark:border dark:border-white/5 bg-gradient-to-br from-white/30 to-zinc-100/30 backdrop-blur shadow-xl border border-black/5 ",
        outline: "bg-transparent  p-3",
        // border border-zinc-700/40
        secondary:
          "bg-secondary/50 text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ------------------------
// FIXED: Remove React drag events to avoid type collision
// ------------------------
interface RubberBandCardProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      | "onDrag"
      | "onDragStart"
      | "onDragEnd"
      | "onAnimationStart"
      | "onAnimationEnd"
      | "onAnimationIteration"
      | "onTransitionEnd"
      | "draggable"
    >,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode
}


// ------------------------
// Component
// ------------------------
export default function RubberBandCard({
  children,
  className,
  variant,
  ...props
}: RubberBandCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Motion v11 correct signature
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    _info: any
  ) => {
    animate(x, 0, {
      type: "spring",
      stiffness: 500,
      damping: 40,
      mass: 0.6,
    })

    animate(y, 0, {
      type: "spring",
      stiffness: 500,
      damping: 40,
      mass: 0.6,
    })
  }

  return (
    <motion.div
      drag
      dragElastic={0.4}
      dragMomentum={false}
      style={{ x, y }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.015 }}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}
