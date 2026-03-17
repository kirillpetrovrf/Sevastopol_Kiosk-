// Акварельное пятно — полностью в коде, SVG feTurbulence, без PNG-файлов
export function WatercolorSpot({ x, y, rx, ry, color, opacity, rotate, seed }) {
  const filterId = `wc-${seed}`
  return (
    <svg
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: rx * 2,
        height: ry * 2,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        zIndex: 1,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: 'center',
        overflow: 'visible',
      }}
      viewBox={`0 0 ${rx * 2} ${ry * 2}`}
    >
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="4"
            seed={seed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="6" result="blurred"/>
          <feColorMatrix
            in="blurred"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 2.5 -0.4"
          />
        </filter>
      </defs>
      <ellipse
        cx={rx} cy={ry}
        rx={rx * 0.85} ry={ry * 0.85}
        fill={color}
        opacity={opacity}
        filter={`url(#${filterId})`}
      />
    </svg>
  )
}
