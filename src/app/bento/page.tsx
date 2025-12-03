import TechStackCard from "@/components/tech-stack-card"
import ProfileCard from "@/components/profile-card"
import DailyToolsCard from "@/components/daily-tools-card"
import ProjectsCard from "@/components/projects-card"
import SocialLinksGrid from "@/components/social-links-grid"

export default function Page() {
  return (
    <div className="min-h-screen w-full px-6 lg:px-10 font-mono 
        bg-[url('/light-bg.png')] bg-cover bg-center bg-no-repeat 
        dark:bg-[url('/dark-bg.png')]
      ">
      <div className="max-w-5xl mx-auto">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-8 sm:grid-rows-5 p-5 max-sm:p-4 sm:h-[770px] relative w-full max-sm:gap-3 max-sm:min-h-screen auto-rows-[1fr]">
        {/* LEFT COLUMN — Tech Stack */}
        <div className="flex w-full rounded-xl dark:border dark:border-dark-5 border-dark-3 transform-gpu  cursor-grab sm:col-start-1 sm:col-end-3 sm:row-start-1 sm:row-end-5 z-[8] max-sm:h-max relative !border-dark-3 dark:!border-0  dark:p-1 p-0.5">
          <TechStackCard />
        </div>

        {/* CENTER COLUMN — Profile and Daily Tools */}
        <div className="relative flex w-full rounded-xl  transform-gpu  cursor-grab sm:col-start-3 sm:col-end-7 sm:row-start-1 sm:row-end-3 z-10 max-sm:h-max ">
          <ProfileCard />
          {/* <DailyToolsCard /> */}
        </div>
        <div className="relative flex w-full rounded-xl transform-gpu cursor-grab sm:col-start-3 sm:col-end-7 sm:row-start-3 sm:row-end-6  [box-shadow:0_0px_0px_-0px_#ffffff1f_inset] dark:[box-shadow:0_0px_0px_-0px_#ffffff1f_inset] z-[9] bg-transparent max-sm:h-max">
          <DailyToolsCard />
        </div>

        {/* RIGHT COLUMN — Social Links and Projects */}
        <div className="
          relative flex rounded-xl border dark:border-dark-5 border-dark-3 
          transform-gpu cursor-grab
          sm:col-start-7 sm:col-end-9 
          sm:row-start-1 sm:row-end-2     <!-- FIXED HERE -->
          w-full 
          sm:mr-auto border-none bg-transparent
          [box-shadow:0_0px_0px_-0px_#ffffff1f_inset] 
          dark:[box-shadow:0_0px_0px_-0px_#ffffff1f_inset] 
          z-[7] max-sm:h-max dark:bg-transparent
        ">
          <SocialLinksGrid />
        </div>

        <div className="flex w-full rounded-xl border dark:border-dark-5 border-dark-3 transform-gpu  cursor-grab row-start-4 sm:col-start-7 sm:col-end-9 sm:row-start-2 sm:row-end-4  border-none relative hover:scale-55 z-[8] max-sm:h-max mx-auto overflow-hidden">
          <ProjectsCard />
        </div>
      </div>
      </div>
    </div>
  )
}
