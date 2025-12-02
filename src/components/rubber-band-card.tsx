"use client"

import { motion, useMotionValue, animate } from "motion/react"
import type React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils" // if you have shadcn cn()

const cardVariants = cva(
  "rounded-2xl cursor-grab active:cursor-grabbing select-none transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-zinc-900/80 to-zinc-950/90 backdrop-blur-xl shadow-2xl border border-white/10",
        outline: "bg-transparent border border-zinc-700/40 p-3",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface RubberBandCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode
}

export default function RubberBandCard({
  children,
  className,
  variant,    // <<— correct spelling
  ...props
}: RubberBandCardProps) {

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleDragEnd = () => {
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
