// SVG-рамка страницы: двойная красная линия с угловыми засечками
export function PageFrame({ pageNumber }) {
  return (
    <svg
      className="page-frame"
      viewBox="0 0 780 550"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    >
      {/* Внешняя линия */}
      <rect x="10" y="10" width="760" height="530"
            fill="none" stroke="#8b1a1a" strokeWidth="2"/>
      {/* Внутренняя линия */}
      <rect x="16" y="16" width="748" height="518"
            fill="none" stroke="#8b1a1a" strokeWidth="0.75" opacity="0.6"/>

      {/* Угловые засечки */}
      <line x1="10" y1="30" x2="10" y2="10" stroke="#8b1a1a" strokeWidth="3"/>
      <line x1="10" y1="10" x2="30" y2="10" stroke="#8b1a1a" strokeWidth="3"/>

      <line x1="770" y1="10" x2="750" y2="10" stroke="#8b1a1a" strokeWidth="3"/>
      <line x1="770" y1="10" x2="770" y2="30" stroke="#8b1a1a" strokeWidth="3"/>

      <line x1="10" y1="520" x2="10" y2="540" stroke="#8b1a1a" strokeWidth="3"/>
      <line x1="10" y1="540" x2="30" y2="540" stroke="#8b1a1a" strokeWidth="3"/>

      <line x1="770" y1="540" x2="750" y2="540" stroke="#8b1a1a" strokeWidth="3"/>
      <line x1="770" y1="540" x2="770" y2="520" stroke="#8b1a1a" strokeWidth="3"/>

      {pageNumber != null && (
        <text x="758" y="36" textAnchor="end"
              fontFamily="'Special Elite', monospace"
              fontSize="18" fill="#333" opacity="0.7">
          {pageNumber}
        </text>
      )}
    </svg>
  )
}
