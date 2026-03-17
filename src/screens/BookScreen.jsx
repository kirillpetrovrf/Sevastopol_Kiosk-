import { useRef, useState, useEffect, forwardRef } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedBookPage } from './AnimatedBookPage'
import { SvgMapPage } from './SvgMapPage'
import { TitlePage } from './TitlePage'
import { BOOK_PAGES } from '../data/bookData'
import '../styles/page.css'

// Обёртка страницы — react-pageflip требует forwardRef
const FlipPage = forwardRef(function FlipPage({ children }, ref) {
  return (
    <div ref={ref} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {children}
    </div>
  )
})

// Обложка (Task 3) — с золотым текстом с главного экрана
function CoverPage() {
  const COVER = '#9e4f4f'   // красно-коричневая обложка книги (совпадает с главной)
  const GOLD  = '#C8A84B'   // золото тиснения
  const GOLD2 = '#e8c96a'   // светлое золото

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: COVER,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(32px, 5vw, 100px)',
    }}>
      {/* Фоновая текстура — имитация бархата */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `repeating-linear-gradient(
          135deg,
          rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px,
          transparent 1px, transparent 8px
        )`,
        pointerEvents: 'none',
      }} />

      {/* Двойная рамка */}
      <div style={{ position: 'absolute', inset: 20, border: `2px solid ${GOLD}`, opacity: 0.7, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 30, border: `1px solid ${GOLD}`, opacity: 0.35, pointerEvents: 'none' }} />

      {/* Горизонтальная линия */}
      <div style={{
        width: '60%',
        height: 1,
        background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
        marginBottom: 'clamp(24px, 4vh, 56px)',
        position: 'relative',
        zIndex: 1,
      }} />

      {/* Главный заголовок */}
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(14px, 1.4vw, 28px)',
        color: GOLD2,
        letterSpacing: '0.12em',
        lineHeight: 1.3,
        textTransform: 'uppercase',
        textAlign: 'center',
        margin: 0,
        textShadow: `0 2px 20px rgba(200,168,75,0.3)`,
        position: 'relative',
        zIndex: 1,
      }}>
        ОТДЕЛ ОХРАНЫ ОБЩЕСТВЕННОГО ПОРЯДКА
      </h1>

      {/* Линия */}
      <div style={{
        width: '60%',
        height: 1,
        background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
        margin: 'clamp(20px, 3vh, 48px) 0',
        position: 'relative',
        zIndex: 1,
      }} />

      {/* Подзаголовок */}
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(14px, 1.8vw, 36px)',
        color: GOLD,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        margin: 0,
        opacity: 0.9,
        position: 'relative',
        zIndex: 1,
      }}>
        ЕДИНАЯ ДИСЛОКАЦИЯ
      </h2>
    </div>
  )
}

function renderPage(page, pageNumber) {
  switch (page.type) {
    case 'cover':      return <CoverPage />
    case 'title_page': return <TitlePage pageNumber={pageNumber} />
    case 'text':       return <AnimatedBookPage page={page} pageNumber={pageNumber} />
    case 'svg_map':    return <SvgMapPage pageNumber={pageNumber} />
    default: return <div style={{ padding: 40, fontFamily: 'var(--font-body)', color: '#2a1a0a' }}>Страница {pageNumber}</div>
  }
}

// Анимация перелистывания страниц — 3D поворот как у настоящей книги
const pageVariants = {
  enter: dir => ({ rotateY: dir > 0 ? 90 : -90, opacity: 0 }),
  center:      { rotateY: 0, opacity: 1 },
  exit:  dir => ({ rotateY: dir > 0 ? -90 : 90, opacity: 0 }),
}
const pageTransition = { type: 'spring', stiffness: 80, damping: 18, duration: 0.7 }

export function BookScreen() {
  const navigate = useNavigate()
  const bookRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  // Обновляем размеры при изменении окна (смена ориентации планшета/монитора)
  useEffect(() => {
    function onResize() { setSize({ w: window.innerWidth, h: window.innerHeight }) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const totalPages = BOOK_PAGES.length

  function goBack() { navigate('/', { replace: true }) }
  function prevPage() { bookRef.current?.pageFlip()?.flipPrev('bottom') }
  function nextPage() { bookRef.current?.pageFlip()?.flipNext('bottom') }

  return (
    <motion.div
      style={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HTMLFlipBook
        ref={bookRef}
        width={size.w}
        height={size.h}
        size="fixed"
        drawShadow={true}
        flippingTime={900}
        usePortrait={true}
        showCover={true}
        swipeDistance={30}
        className="book"
        onFlip={e => setCurrentPage(e.data)}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {BOOK_PAGES.map((page, i) => (
          <FlipPage key={page.id}>
            {renderPage(page, i)}
          </FlipPage>
        ))}
      </HTMLFlipBook>

      {/* Кнопка назад */}
      <button style={styles.backBtn} onClick={goBack} aria-label="Назад">
        ← Назад
      </button>

      {/* Кнопка ◄ */}
      <button
        style={{ ...styles.navBtn, left: 0, opacity: currentPage === 0 ? 0.2 : 0.75 }}
        onClick={prevPage}
        disabled={currentPage === 0}
        aria-label="Предыдущая страница"
      >◄</button>

      {/* Кнопка ► */}
      <button
        style={{ ...styles.navBtn, right: 0, opacity: currentPage >= totalPages - 1 ? 0.2 : 0.75 }}
        onClick={nextPage}
        disabled={currentPage >= totalPages - 1}
        aria-label="Следующая страница"
      >►</button>

      {/* Счётчик */}
      <div style={styles.counter}>{currentPage + 1} / {totalPages}</div>
    </motion.div>
  )
}

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    background: 'var(--color-bg)',
  },
  backBtn: {
    position: 'fixed',
    top: 20,
    left: 20,
    zIndex: 300,
    minHeight: 44,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 20px',
    background: 'rgba(26,22,18,0.85)',
    border: '2px solid var(--color-accent)',
    borderRadius: 8,
    color: 'var(--color-accent)',
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(14px, 1.5vh, 22px)',
    fontWeight: 700,
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
  },
  navBtn: {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 300,
    width: 'clamp(50px, 5vw, 90px)',
    height: 'clamp(100px, 20vh, 220px)',
    background: 'rgba(10,7,4,0.65)',
    border: 'none',
    color: 'var(--color-accent)',
    fontSize: 'clamp(20px, 2.5vh, 40px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(6px)',
    transition: 'opacity 0.2s',
  },
  counter: {
    position: 'fixed',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 300,
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(12px, 1.5vh, 20px)',
    color: 'rgba(210,160,60,0.6)',
    letterSpacing: '0.15em',
    pointerEvents: 'none',
  },
}
