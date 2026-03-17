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

  // Кастомные edge-зоны — детектируем свайп за края страницы
  const dragStart = useRef(null)

  function onEdgePointerDown(e, direction) {
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const y = e.touches ? e.touches[0].clientY : e.clientY
    dragStart.current = { x, y, direction }
  }

  function onRootPointerUp(e) {
    if (!dragStart.current) return
    const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY
    const dx = x - dragStart.current.x
    const dy = Math.abs(y - dragStart.current.y)
    const { direction } = dragStart.current
    dragStart.current = null
    if (dy > 100) return
    if (Math.abs(dx) < 20) return
    if (direction === 'left') {
      prevPage()
    } else {
      nextPage()
    }
  }

  return (
    <motion.div
      style={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onMouseUp={onRootPointerUp}
      onTouchEnd={onRootPointerUp}
    >
      <HTMLFlipBook
        ref={bookRef}
        width={size.w}
        height={size.h}
        size="fixed"
        drawShadow={true}
        flippingTime={500}
        usePortrait={true}
        showCover={true}
        swipeDistance={999999}
        useMouseEvents={false}
        clickEventForward={false}
        mobileScrollSupport={false}
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

      {/* Зона свайпа — левый край */}
      <div
        style={styles.edgeLeft}
        onMouseDown={(e) => onEdgePointerDown(e, 'left')}
        onTouchStart={(e) => onEdgePointerDown(e, 'left')}
      />

      {/* Зона свайпа — правый край */}
      <div
        style={styles.edgeRight}
        onMouseDown={(e) => onEdgePointerDown(e, 'right')}
        onTouchStart={(e) => onEdgePointerDown(e, 'right')}
      />

      {/* Кнопка Домой */}
      <button 
        style={{ ...styles.homeBtn, opacity: 0.35 }}
        onClick={goBack}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 0.5}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.35}
        aria-label="На главную"
      >⌂</button>

      {/* Кнопка ◄ */}
      <button
        style={{ ...styles.navBtn, left: 8, opacity: currentPage === 0 ? 0.15 : 0.35 }}
        onClick={prevPage}
        onMouseEnter={(e) => e.currentTarget.style.opacity = currentPage === 0 ? 0.15 : 0.5}
        onMouseLeave={(e) => e.currentTarget.style.opacity = currentPage === 0 ? 0.15 : 0.35}
        disabled={currentPage === 0}
        aria-label="Предыдущая страница"
      >◄</button>

      {/* Кнопка ► */}
      <button
        style={{ ...styles.navBtn, right: 8, opacity: currentPage >= totalPages - 1 ? 0.15 : 0.35 }}
        onClick={nextPage}
        onMouseEnter={(e) => e.currentTarget.style.opacity = currentPage >= totalPages - 1 ? 0.15 : 0.5}
        onMouseLeave={(e) => e.currentTarget.style.opacity = currentPage >= totalPages - 1 ? 0.15 : 0.35}
        disabled={currentPage >= totalPages - 1}
        aria-label="Следующая страница"
      >►</button>
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
  // Зоны на краях для свайпа (как у настоящей книги)
  edgeLeft: {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '15%',
    height: '100%',
    zIndex: 200,
    cursor: 'grab',
  },
  edgeRight: {
    position: 'fixed',
    right: 0,
    top: 0,
    width: '15%',
    height: '100%',
    zIndex: 200,
    cursor: 'grab',
  },
  homeBtn: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 300,
    width: 'clamp(60px, 6vw, 100px)',
    height: 'clamp(60px, 6vw, 100px)',
    background: 'rgba(10,7,4,0.75)',
    border: 'none',
    borderRadius: '50%',
    color: 'var(--color-accent)',
    fontSize: 'clamp(28px, 3.5vh, 50px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(6px)',
    transition: 'all 0.2s',
  },
  navBtn: {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 300,
    width: 'clamp(80px, 8vw, 140px)',
    height: 'clamp(200px, 35vh, 400px)',
    background: 'rgba(10,7,4,0.75)',
    border: 'none',
    color: 'var(--color-accent)',
    fontSize: 'clamp(32px, 4vh, 60px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(6px)',
    transition: 'all 0.2s',
    borderRadius: 8,
  },
  navBtnHover: {
    opacity: '1 !important',
    background: 'rgba(10,7,4,0.9)',
  },
}
