import RubberBandCard from "./rubber-band-card"
import { Github, Zap, Code, Figma, LayoutGrid, Palette } from "lucide-react"

export default function DailyToolsCard() {
  const tools = [
    { icon: Github, label: "GitHub", color: "text-gray-300" },
    { icon: Zap, label: "Vercel", color: "text-blue-400" },
    { icon: Code, label: "VS Code", color: "text-blue-500" },
    { icon: Figma, label: "Figma", color: "text-purple-400" },
    { icon: LayoutGrid, label: "Clerk", color: "text-amber-300" },
    { icon: Palette, label: "Tailwind", color: "text-cyan-300" },
  ]

  return (
    <RubberBandCard className="w-full p-6" variant={"outline"}>
      <div className="grid h-full grid grid-cols-1 sm:grid-cols-5 sm:grid-rows-7 max-sm:py-2 max-sm:gap-2 !shadow-none">
        <div className="row-start-2 row-end-3 sm:col-start-1 sm:col-end-2 sm:row-start-1 sm:row-end-8 ">

        </div>
        <div className=" sm:col-start-2 sm:col-end-4  sm:row-start-1 sm:row-end-3">

        </div>
        <div className="sm:col-start-4 sm:col-end-6 sm:row-start-1 sm:row-end-4 relative border border-zinc-700/20 rounded-3xl max-sm:h-[400px]">
        </div>
        <div className="sm:col-start-4 sm:col-end-6 sm:row-start-4 sm:row-end-5">

        </div>
        <div className="row-start-7 sm:col-start-2 sm:col-end-4  sm:row-start-3 sm:row-end-4 relative max-sm:hidden">

        </div>
        <div className=" sm:col-start-2 sm:col-end-4  sm:row-start-4 sm:row-end-7 border-dark-3 dark:border-dark-5 rounded-3xl bg-transparent group relative">

        </div>
        <div className=" sm:col-start-2 sm:col-end-4 sm:row-start-7 sm:row-end-8 p-1">
          
        </div>
        <div className="sm:col-start-4 sm:col-end-6 sm:row-start-5 sm:row-end-8 relative flex flex-col-reverse items-center bg-transparent justify-start p-1">
          
        </div>
      </div>
    </RubberBandCard>
  )
}
