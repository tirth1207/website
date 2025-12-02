"use client"
import { Badge } from "@/components/ui/badge"
import RubberBandCard from "@/components/rubber-band-card"
import { useMotionValue, animate,motion } from "motion/react";

export default function TechStackCard() {
  const frontend = ["React", "Next.js", "Shadcn", "Tailwind", "Motion",]

  const backend = ["Node.js", "Express.js", "NPM"]

  const services = [ "Docker", "Appwrite", "Supabase", "Prisma ORM", "Postman"]

  return (
    <RubberBandCard className="flex w-full rounded-xl border dark:border-dark-5 dark:border-dark-3 transform-gpu dark:bg-dark-1 cursor-grab sm:col-start-1 sm:col-end-3 sm:row-start-1 sm:row-end-5 z-[8] max-sm:h-max relative !border-dark-3  p-0.5">
      <motion.div className="space-y-6" whileHover="hover" initial="initial">
        <div className="pt-2 pl-2">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
            {"{"}
            <span className="text-white">{"}"}</span>
          </h1>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">TECH</h1>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">STACK</h1>
        </div>

        <motion.div
          className="h-[4px] bg-white mt-4"
          variants={{
            initial: { width: "0%" },
            hover: { width: "80%" },
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
        />
        <div className="space-y-4 pl-2">
          <div>
            <p className="text-zinc-400 text-sm font-semibold mb-2">Frontend:</p>
            <div className="flex flex-wrap gap-1">
              {frontend.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="dark:text-dark-1 text-white"
                >
                  <p className="px-2 rounded-md border dark:border-dark-2/65 border-zinc-800 mx-auto">{tech}</p>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-zinc-400 text-sm font-semibold mb-2">Backend:</p>
            <div className="flex flex-wrap gap-1">
              {backend.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="dark:text-dark-1 text-white"
                >
                  <p className="px-2 rounded-md border dark:border-dark-2/65 border-zinc-800 mx-auto">{tech}</p>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-zinc-400 text-sm font-semibold mb-2">DB & Services:</p>
            <div className="flex flex-wrap gap-1">
              {services.map((service) => (
                <Badge
                  key={service}
                  variant="outline"
                  className="dark:text-dark-1 text-white"
                >
                  <p className="px-2 rounded-md border dark:border-dark-2/65 border-zinc-800 mx-auto">{service}</p>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </RubberBandCard>
  )
}
