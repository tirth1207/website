"use client"
import { Github, Mail, Linkedin, Twitter } from "lucide-react"
import Image from "next/image"
import RubberBandCard from "./rubber-band-card"
import { MorphingText } from "./ui/morphing-text"
import React from "react";

export default function ProfileCard() {
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      };

      const formatted = new Intl.DateTimeFormat("en-GB", options)
        .format(now)
        .replace(",", ""); // remove default comma for clean output

      setTime(formatted); // e.g. "03/12/2025 10:55:37 PM"
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <RubberBandCard className="w-full p-3">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-700">
            <Image
              src="/developer-profile.png"
              alt="Shawn"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Tirth</h2>
            <p className="text-zinc-400 text-xs">@rathodtirth</p>
          </div>
        </div>

        <div className="pt-2">
          <div className="mb-2 flex items-center gap-[12px]">
            <p className="text-white font-semibold leading-none inline-block">I build  </p>
            <MorphingText className="leading-none" texts={[" Frontend", " FullStack"]} />
          </div>

          <p className="text-zinc-300 text-xs leading-relaxed">
            Hello, I&aposm Tirth! a 18 year old developer based in Ahmedabad - India.
          </p>
        </div>

        <div className="absolute bottom-5 left-5 max-sm:hidden">
          <p className="text-xs font-mono text-zinc-400/70">
          “It&aposs not a bug,  
          <br/>
          it&aposs a feature.”
          </p>
        </div>

        <div className="absolute bottom-5 right-5 b">
          <div className="font-mono flex justify-end items-center gap-1 text-sm text-zinc-400">
            <div className="size-1.5 rounded-full bg-[#00ff00] dark:bg-[#00ff00] "></div>
            <p className="text-xs">Available for work</p>
          </div>
          <div className="flex items-center justify-center">
            <time className="text-[10px] font-light text-zinc-500 font-mono tabular-nums tracking-wider">
              {time}
            </time>
          </div>
        </div>
      </div>
    </RubberBandCard>
  )
}
