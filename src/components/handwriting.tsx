// "use client";

// import { motion } from "motion/react";
// import type { TargetAndTransition } from "motion/react";
// import { cn } from "@/lib/utils";
// import opentype from "opentype.js";
// import { useEffect, useState } from "react";

// const initialProps: TargetAndTransition = {
//   pathLength: 0,
//   opacity: 0,
// };

// const animateProps: TargetAndTransition = {
//   pathLength: 1,
//   opacity: 1,
// };

// type Props = React.ComponentProps<typeof motion.svg> & {
//   children: string;
//   fontUrl?: string; // path to .ttf or .otf
//   speed?: number;
//   onAnimationComplete?: () => void;
// };

// function pathToD(path: opentype.Path): string {
//   const parts: string[] = [];
//   for (const cmd of path.commands) {
//     switch (cmd.type) {
//       case "M":
//         parts.push(`M${cmd.x} ${cmd.y}`);
//         break;
//       case "L":
//         parts.push(`L${cmd.x} ${cmd.y}`);
//         break;
//       case "C":
//         parts.push(`C${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y}`);
//         break;
//       case "Q":
//         parts.push(`Q${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y}`);
//         break;
//       case "Z":
//         parts.push("Z");
//         break;
//       default:
//         break;
//     }
//   }
//   return parts.join(" ");
// }

// export function AnimatedHelloText({
//   children,
//   fontUrl = "/fonts/SF-Pro-Display-Regular.otf", // example
//   className,
//   speed = 1,
//   onAnimationComplete,
//   ...props
// }: Props) {
//   const calc = (x: number) => x * speed;

//   const [paths, setPaths] = useState<string[]>([]);
//   const [viewBox, setViewBox] = useState<string | undefined>(undefined);

//   useEffect(() => {
//     let cancelled = false;

//     async function generate() {
//       try {
//         const response = await fetch(fontUrl);
//         const arrayBuffer = await response.arrayBuffer();
//         const font = opentype.parse(arrayBuffer);

//         const fontSize = 160;
//         const baselineY = fontSize; // place baseline within viewBox
//         const letterSpacing = 0; // tweak if needed

//         let xCursor = 0;
//         const generated: string[] = [];

//         for (const ch of Array.from(children)) {
//           const glyph = font.charToGlyph(ch);
//           const path = glyph.getPath(xCursor, baselineY, fontSize);
//           const d = pathToD(path);
//           if (d) generated.push(d);

//           const unitsPerEm = font.unitsPerEm || 1000;
//           const scale = fontSize / unitsPerEm;
//           const advanceUnits = glyph.advanceWidth || unitsPerEm;
//           const advance = advanceUnits * scale + letterSpacing;
//           xCursor += advance;
//         }

//         const ascent = (font.ascender / (font.unitsPerEm || 1000)) * fontSize;
//         const descent = Math.abs((font.descender / (font.unitsPerEm || 1000)) * fontSize);
//         const height = ascent + descent;
//         const vb = `0 0 ${Math.max(1, Math.ceil(xCursor))} ${Math.ceil(height)}`;

//         if (!cancelled) {
//           setPaths(generated);
//           setViewBox(vb);
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setPaths([]);
//           setViewBox(undefined);
//         }
//       }
//     }

//     generate();

//     return () => {
//       cancelled = true;
//     };
//   }, [children, fontUrl]);

//   return (
//     <motion.svg
//       className={cn("h-20", className)}
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       stroke="currentColor"
//       viewBox={viewBox}
//       initial={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//       {...props}
//     >
//       <title>{children}</title>

//       {paths.map((d, i) => (
//         <motion.path
//           key={i}
//           d={d}
//           style={{ strokeLinecap: "round" }}
//           initial={initialProps}
//           animate={animateProps}
//           transition={{
//             duration: calc(0.8),
//             ease: "easeInOut",
//             delay: calc(i * 0.6),
//             opacity: { duration: 0.4, delay: calc(i * 0.6) },
//           }}
//           onAnimationComplete={i === paths.length - 1 ? onAnimationComplete : undefined}
//         />
//       ))}
//     </motion.svg>
//   );
// }
