import { useState } from 'react'
import { ReactComponent as BeamioStatic } from './assets/BeamioStatic.svg'
import { ReactComponent as BeamioAnimated } from './assets/BeamioAnimated.svg'

export default function BeamioLogo() {
  const [playing, setPlaying] = useState(false)

  const ANIMATION_DURATION = 2300 // 2.3 秒

  const handleClick = () => {
    if (!playing) {
      setPlaying(true)
      setTimeout(() => {
        setPlaying(false)
      }, ANIMATION_DURATION)
    }
  }

  return (
    <div
      // ✅ 容器尺寸从 40px → 80px
      className="relative inline-flex items-center justify-start cursor-pointer w-[80px] h-[80px]"
      onClick={handleClick}
    >
      {/* 静态蓝色 B：尺寸从 w-10 h-10 → w-20 h-20 */}
      <BeamioStatic
        className={`w-20 h-20 transition-opacity duration-150 flex-shrink-0 ${
          playing ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 动画版：宽高也放大 2 倍 */}
      {playing && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 overflow-visible"
          style={{ pointerEvents: 'none' }}
        >
          {/* 原来 w-[260px] h-20 → 现在 w-[520px] h-40 */}
          <BeamioAnimated className="w-[520px] h-40" />
        </div>
      )}
    </div>
  )
}
