import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PageFrame } from '../components/PageFrame'
import { WatercolorLayer } from '../components/WatercolorLayer'
import { DISTRICTS, MAP_MARKERS } from '../data/bookData'

export function SvgMapPage({ pageNumber }) {
  const [activeMarker, setActiveMarker] = useState(null)
  const [hoveredDistrict, setHoveredDistrict] = useState(null)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#c8dff0' }}>
      {/* Реальное фото исторической карты — фоновый слой */}
      <img
        src={`${import.meta.env.BASE_URL}assets/images/map-real.jpg`}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      <PageFrame pageNumber={pageNumber} />

      {/* SVG-карта — поверх фото, фон прозрачный */}
      <svg
        viewBox="0 0 880 600"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 5,
        }}
      >
        {/* Фон убран — показываем реальную фотографию карты */}

        {/* Патрульные участки */}
        {DISTRICTS.map(d => (
          <path
            key={d.id}
            d={d.path}
            fill={hoveredDistrict === d.id ? d.colorHover : d.colorNormal}
            stroke="rgba(50,30,10,0.5)"
            strokeWidth="1.5"
            style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
            onMouseEnter={() => setHoveredDistrict(d.id)}
            onMouseLeave={() => setHoveredDistrict(null)}
            onTouchStart={(e) => {
              e.stopPropagation()
              setHoveredDistrict(d.id)
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              setTimeout(() => setHoveredDistrict(null), 800)
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <title>{d.name}</title>
          </path>
        ))}

        {/* Подписи участков */}
        {DISTRICTS.map(d => {
          // Берём грубый центр пути из первой точки M x,y
          const match = d.path.match(/M\s*([\d.]+),([\d.]+)/)
          if (!match) return null
          const points = [...d.path.matchAll(/([\d.]+),([\d.]+)/g)]
          if (points.length < 2) return null
          const xs = points.map(p => parseFloat(p[1]))
          const ys = points.map(p => parseFloat(p[2]))
          const cx = (Math.max(...xs) + Math.min(...xs)) / 2
          const cy = (Math.max(...ys) + Math.min(...ys)) / 2
          const num = d.name.replace(/[^0-9]/g, '')
          return (
            <text key={`lbl-${d.id}`}
                  x={cx} y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fontFamily="'Special Elite', monospace"
                  fill="rgba(40,20,5,0.75)"
                  pointerEvents="none">
              №{num}
            </text>
          )
        })}

        {/* Подписи географических объектов убраны — они есть на реальном фото */}

        {/* Маркеры с пульсацией */}
        {MAP_MARKERS.map(m => {
          const mx = (m.svgX / 100) * 880
          const my = (m.svgY / 100) * 600
          return (
            <g
              key={m.id}
              transform={`translate(${mx},${my})`}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                setActiveMarker(m)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => {
                e.stopPropagation()
                setActiveMarker(m)
              }}
            >
              {/* Кольцо пульсации — аними через CSS класс */}
              <circle r="24" fill="#D2A03C" className="marker-pulse" opacity="0.85" />
              <circle r="11" fill="white" />
              <circle r="6" fill="#8b1a1a" />
            </g>
          )
        })}

        {/* Заголовок карты */}
        <text x="440" y="22" textAnchor="middle"
              fontSize="15" fontFamily="'Playfair Display', serif"
              fill="#2a1a0a" opacity="0.8">
          Схема патрульных участков г. Севастополя
        </text>
      </svg>

      {/* Модальное окно маркера — через портал, поверх всей книги */}
      {createPortal(
        <AnimatePresence>
          {activeMarker && (
            <>
              {/* Backdrop — клик вне модалки закрывает её */}
              <motion.div
                style={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setActiveMarker(null)}
                onTouchEnd={(e) => { e.stopPropagation(); setActiveMarker(null) }}
              />
              <motion.div
                style={styles.modal}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
            {activeMarker.photoFile ? (
              <img
                src={`/data/content/book/markers/${activeMarker.photoFile}`}
                alt={activeMarker.label}
                style={styles.modalPhoto}
              />
            ) : (
              <div style={styles.modalPhotoPlaceholder}>
                <span style={{ fontSize: 48, opacity: 0.4 }}>📷</span>
                <span style={{ color: 'var(--color-text-sec)', fontSize: 14 }}>Фото появится после загрузки контента</span>
              </div>
            )}

            <div style={styles.modalBody}>
              <h3 style={styles.modalTitle}>{activeMarker.label}</h3>
              <p style={styles.modalText}>{activeMarker.description}</p>
            </div>

            <button
              style={styles.modalClose}
              onClick={(e) => {
                e.stopPropagation()
                setActiveMarker(null)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              aria-label="Закрыть"
            >
              ✕
            </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 990,
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 460,
    maxWidth: '88%',
    background: 'var(--color-card)',
    border: '2px solid var(--color-accent)',
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 1000,
    boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
  },
  modalPhoto: {
    width: '100%',
    height: 240,
    objectFit: 'cover',
  },
  modalPhotoPlaceholder: {
    width: '100%',
    height: 180,
    background: '#1a1612',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalBody: {
    padding: '18px 22px 22px',
  },
  modalTitle: {
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-accent)',
    fontSize: 20,
    marginBottom: 10,
  },
  modalText: {
    color: 'var(--color-text)',
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: 'var(--font-body)',
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 44,
    height: 44,
    background: 'rgba(0,0,0,0.55)',
    color: 'white',
    borderRadius: '50%',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    zIndex: 101,
  },
}
