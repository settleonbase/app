import React from 'react'
import './Marquee.css'
import s11 from '../assets/s11.jpg'
import s22 from '../assets/s22.jpg'
import s33 from '../assets/s33.jpg'

interface ScrollingLineProps {
  text?: string                    // 保持兼容：纯文字行
  segments?: Segment[]             // 新增：文字 + 图片混排
  direction: 'left' | 'right'
  speed: number
}

type Segment =
  | { type: 'text'; text: string }
  | { type: 'img'; src: string; alt?: string }

// 为了保证任意时刻都有文字，重复若干次
const REPEAT_TIMES = 6

// ========================
// 字符点阵数据
// ========================

type CharMapKey =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'
  | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R'
  | 'S' | 'T' | 'U' | 'V' | 'W' | 'X'
  | 'Y' | 'Z'
  | ' ' | '.'

const CHAR_MAPS: Record<CharMapKey, number[][]> = {
  A: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  B: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
  ],
  C: [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,1],
  ],
  D: [
    [1,1,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,1,1,0,0],
  ],
  E: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  F: [
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  G: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  H: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  I: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,1,1,1,1],
  ],
  J: [
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  K: [
    [1,0,0,0,1],
    [1,0,0,1,0],
    [1,0,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  L: [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  M: [
    [1,0,0,0,1],
    [1,1,0,1,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  N: [
    [1,0,0,0,1],
    [1,1,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  O: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  P: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
  Q: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,0,1,0],
    [0,1,1,0,1],
  ],
  R: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  S: [
    [0,1,1,1,1],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,1,1,1,0],
  ],
  T: [
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  U: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  V: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,1,0,0],
  ],
  W: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,1,0,1],
    [1,0,1,0,1],
    [1,1,0,1,1],
    [1,1,0,1,1],
    [1,0,0,0,1],
  ],
  X: [
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [1,0,0,0,1],
  ],
  Y: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  Z: [
    [1,1,1,1,1],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1],
  ],
  ' ': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
  ],
  '.': [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,1,0,0],
    [0,1,1,1,0],
    [0,0,1,0,0],
  ],
}

// ========================
// Pixel 组件：无鼠标逻辑，只看 active
// ========================

interface PixelProps {
  active: number
}

const Pixel: React.FC<PixelProps> = React.memo(({ active }) => {
  const cls = active ? 'pixel active' : 'pixel inactive'
  return <div className={cls} />
})

// ========================
// Char 组件：每个字符自己的容器，用 CSS :hover 检测
// ========================

interface CharProps {
  char: keyof typeof CHAR_MAPS | string
}

const Char: React.FC<CharProps> = ({ char }) => {
  const upper = char.toUpperCase()
  const map = CHAR_MAPS[upper as CharMapKey]

  if (!map) {
    return <div style={{ width: 'var(--char-gap)' }} />
  }

  const pixelGap = 'var(--dot-gap)'

  return (
    <div
      className="char-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginRight: 'var(--char-gap)',
        userSelect: 'none',
      }}
    >
      {map.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'flex',
            marginBottom: rowIndex === map.length - 1 ? 0 : pixelGap,
          }}
        >
          {row.map((active, colIndex) => (
            <div
              key={colIndex}
              style={{
                marginRight: colIndex === row.length - 1 ? 0 : pixelGap,
              }}
            >
              <Pixel active={active} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ========================
// ScrollingLine：只负责跑马灯，不再管鼠标
// ========================

const ScrollingLine: React.FC<ScrollingLineProps> = ({
  text,
  segments,
  direction,
  speed,
}) => {
  const speedVar = { '--speed': `${speed}s` } as React.CSSProperties
  const lineClass =
    direction === 'left' ? 'marquee-content-left' : 'marquee-content-right'

  const items: Segment[] =
    segments && segments.length > 0
      ? segments
      : [{ type: 'text', text: text ?? '' }]

  return (
    <div className="marquee-line">
      <div className={lineClass} style={speedVar}>
        {Array.from({ length: REPEAT_TIMES }).map((_, repeatIndex) => (
          <React.Fragment key={repeatIndex}>
            {items.map((seg, segIndex) => {
              if (seg.type === 'text') {
                return seg.text.split('').map((char, charIndex) => (
                  <Char
                    key={`${repeatIndex}-${segIndex}-c${charIndex}`}
                    char={char}
                  />
                ))
              }

              return (
                <span
                  key={`${repeatIndex}-${segIndex}-img`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    marginRight: 'var(--char-gap)',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={seg.src}
                    alt={seg.alt ?? ''}
                    style={{
                      height:
                        'calc(var(--dot-size) * 7 + var(--dot-gap) * 6)',
                      display: 'block',
                      objectFit: 'contain',
                      flexShrink: 0,
                      minWidth: 'calc(var(--dot-size) * 3)',
                    }}
                  />
                </span>
              )
            })}

            <Char
              key={`${repeatIndex}-gap`}
              char=" "
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ========================
// Marquee 主组件：不再监听 mousemove
// ========================

const Marquee: React.FC = () => {
  const line1Text1 = 'Pay like chat. '
  const line1Text2 = ' Settle onchain.'
  const line2Text2 = 'Links. codes. QRs.'
  const line2Text1 = ' Not 0x-anything.'
  const line3Text1 = 'No gas runs. '
  const line3Text2 = ' Global stablecoins.'

  // 放慢 2 倍：320~640 秒一圈
  const [line1Speed, line2Speed, line3Speed] = React.useMemo(() => {
    const rand = () => 160 + Math.random() * 160
    return [rand(), rand(), rand()]
  }, [])

  const line2Segments: Segment[] = React.useMemo(
    () => [
      { type: 'text', text: line2Text1 },
      { type: 'img', src: s22, alt: 'Beamio logo' },
      { type: 'text', text: line2Text2 },
    ],
    []
  )

  const line1Segments: Segment[] = React.useMemo(
    () => [
      { type: 'text', text: line1Text1 },
      { type: 'img', src: s33, alt: 'Beamio logo' },
      { type: 'text', text: line1Text2 },
    ],
    []
  )

  const line3Segments: Segment[] = React.useMemo(
    () => [
      { type: 'text', text: line3Text1 },
      { type: 'img', src: s11, alt: 'Beamio logo' },
      { type: 'text', text: line3Text2 },
    ],
    []
  )

  return (
    <div className="dot-matrix-display-container">
      <ScrollingLine
        segments={line1Segments}
        direction="right"
        speed={line1Speed}
      />
      <ScrollingLine
        segments={line2Segments}
        direction="left"
        speed={line2Speed}
      />
      <ScrollingLine
        segments={line3Segments}
        direction="right"
        speed={line3Speed}
      />
    </div>
  )
}

export default Marquee
