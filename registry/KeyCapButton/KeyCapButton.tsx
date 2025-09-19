import { cn } from "@/lib/utils";
import React from "react";

interface KeycapButtonProps {
  children: string;
}

const KeycapButton: React.FC<KeycapButtonProps> = ({ children }) => {
  return (
    <div className="grid h-[500px] place-items-center text-center">
      {/* Button Section */}
      <div className="relative z-10">
        <button
          className={`
            relative px-4 py-3 rounded-2xl font-['Pixelify_Sans']
            bg-white/30 dark:bg-neutral-900/40 shadow-2xl overflow-hidden 
            border border-white dark:border-neutral-800
            group
            transition-colors
          `}
        >
          {/* Glow Background */}
          <span
            className={cn(
              // Outer glow behind the button; expand by padding amount
              "pointer-events-none absolute inset-0 -m-[var(--padding)]",
              "rounded-[var(--brad)] blur-[20px] opacity-50",
              // Conic gradient background + rainbow rotation
              "bg-rainbow-conic animate-keycap-rainbow pause-on-active",
              // Place behind
              "-z-10",
            )}
          ></span>

          {/* Glass Overlay */}
          <span
            className={`
              absolute inset-0 -z-10 rounded-2xl
              bg-white/10 backdrop-blur-xl
              shadow-inner border border-white/20
              before:absolute before:inset-0 before:rounded-2xl
              before:bg-gradient-to-b before:from-white/40 before:to-transparent
              before:opacity-30
              transition-colors
            `}
          ></span>

          {/* Inner Label */}
          <span
            className={`
              block rounded-2xl px-4 py-3
              bg-gradient-to-b from-neutral-700 to-neutral-800
              dark:from-neutral-800 dark:to-neutral-900
              transition-transform duration-100 group-active:scale-90 shadow-lg
              transition-colors
            `}
          >
            <span
              className={`
                block rounded-full px-8 py-3 text-white text-lg
                bg-gradient-to-b from-neutral-800 to-neutral-700
                dark:from-neutral-900 dark:to-neutral-800
                transition-colors
              `}
            >
              {children}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default KeycapButton;
