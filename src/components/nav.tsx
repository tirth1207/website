"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type NavItem = {
  label: string
  href?: string
  icon?: React.ReactNode
  onClick?: () => void
}

interface NavigationMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NavItem[]
  orientation?: "vertical" | "horizontal"
  rounded?: boolean
  accentColor?: string
}

/**
 * Simple reusable Navigation Menu (shadcn-style)
 * Example:
 * <NavigationMenu items={[{ label: "Home" }, { label: "About" }]} />
 */
export function NavigationMenu({
  className,
  items,
  orientation = "vertical",
  rounded = true,
  accentColor = "indigo",
  ...props
}: NavigationMenuProps) {
  return (
    <nav
      data-slot="navigation-menu"
      className={cn(
        "flex w-full items-center justify-center p-4",
        orientation === "vertical" ? "flex-col space-y-3" : "flex-row space-x-6",
        rounded && "rounded-2xl",
        className
      )}
      {...props}
    >
      <ul
        className={cn(
          "flex items-center justify-center",
          orientation === "vertical" ? "flex-col space-y-4" : "flex-row space-x-6"
        )}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={cn(
              "cursor-pointer transition-colors duration-200 hover:opacity-90",
              `hover:text-${accentColor}-500`
            )}
          >
            {item.href ? (
              <Link
                href={item.href}
                onClick={item.onClick}
                className="flex items-center space-x-2"
              >
                {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                onClick={item.onClick}
                className="flex items-center space-x-2 bg-transparent outline-none"
              >
                {item.icon && <span className="text-muted-foreground">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
