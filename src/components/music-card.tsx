"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2 } from "lucide-react"

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    audio.addEventListener("timeupdate", updateProgress)
    return () => audio.removeEventListener("timeupdate", updateProgress)
  }, [])

  return (
    <div className="w-full srounded-2xl flex flex-col items-center space-y-4 bg-black dark:bg-white">
      {/* Album Cover */}
      <div className="w-25 h-25 rounded-xl overflow-hidden shadow-md">
        <img
          src="https://picsum.photos/200"
          alt="Album cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Song Info */}
      <div className="text-center">
        <h2 className="text-xl font-semibold">Song Title</h2>
        <p className="text-gray-500">Artist Name</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={togglePlay}
          className="p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        {/* Volume */}
        <div className="flex items-center space-x-2">
          <Volume2 size={20} className="text-gray-500" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              setVolume(Number(e.target.value))
              if (audioRef.current) audioRef.current.volume = Number(e.target.value)
            }}
            className="w-24"
          />
        </div>
      </div>

      {/* Hidden audio */}
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
    </div>
  )
}
