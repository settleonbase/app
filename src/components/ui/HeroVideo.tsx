import { useRef, useState } from "react"
import video1 from "../../assets/video1.mp4"

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return

    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <div className="relative aspect-video w-full bg-slate-100 lg:block">

      {/* 视频 */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={video1}
        autoPlay
        muted={muted}
        loop
        playsInline
      />

      {/* 喇叭按钮 */}
      <button
        onClick={toggleMute}
        className="
          absolute bottom-3 right-3 
          inline-flex items-center justify-center 
          w-10 h-10 rounded-xl 
          bg-black/30 hover:bg-black/40 
          text-white text-xl 
          backdrop-blur-sm transition
        "
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </div>
  )
}
