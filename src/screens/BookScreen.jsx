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
  const [isSpread, setIsSpread] = useState(false)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  // Обновляем размеры при изменении окна (смена ориентации планшета/монитора)
  useEffect(() => {
    function onResize() { setSize({ w: window.innerWidth, h: window.innerHeight }) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const totalPages = BOOK_PAGES.length

  const pageW = isSpread ? Math.floor(size.w / 2) : size.w
  const pageH = size.h

  function goBack() { navigate('/', { replace: true }) }
  function prevPage() { bookRef.current?.pageFlip()?.flipPrev('bottom') }
  function nextPage() { bookRef.current?.pageFlip()?.flipNext('bottom') }

  // Window-level capture listener — pointer events работают для touch, mouse и стилуса
  useEffect(() => {
    let startX = null
    let startY = null

    function onPointerDown(e) {
      startX = e.clientX
      startY = e.clientY
    }
    function onPointerUp(e) {
      if (startX === null) return
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      startX = null

      // Только горизонтальный свайп из центра — тапы по краям обрабатывают кнопки
      const isHorizSwipe = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40
      if (isHorizSwipe) {
        if (dx > 0) bookRef.current?.pageFlip()?.flipPrev('bottom')
        else bookRef.current?.pageFlip()?.flipNext('bottom')
      }
    }

    window.addEventListener('pointerdown', onPointerDown, { capture: true })
    window.addEventListener('pointerup', onPointerUp, { capture: true })
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, { capture: true })
      window.removeEventListener('pointerup', onPointerUp, { capture: true })
    }
  }, [])

  return (
    <motion.div
      style={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HTMLFlipBook
        key={isSpread ? 'spread' : 'single'}
        ref={bookRef}
        width={pageW}
        height={pageH}
        size="fixed"
        drawShadow={true}
        flippingTime={1200}
        usePortrait={!isSpread}
        showCover={true}
        useMouseEvents={false}
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
      {/* Кнопка переключения режима разворота — правый край, дно */}
      <button
        style={{ ...styles.navBtn, right: 0, left: 'auto', zIndex: 250, opacity: 0.28, fontSize: 'clamp(16px, 2vh, 28px)', height: 'clamp(80px, 10vh, 120px)', top: 'auto', bottom: 0 }}
        onClick={() => { setCurrentPage(0); setIsSpread(v => !v) }}
        onPointerEnter={(e) => e.currentTarget.style.opacity = 0.6}
        onPointerLeave={(e) => e.currentTarget.style.opacity = 0.28}
        aria-label={isSpread ? 'Одна страница' : 'Двойной разворот'}
        title={isSpread ? 'Одна страница' : 'Двойной разворот'}
      >{isSpread ? '▭' : '▬'}</button>

      {/* Кнопка Домой — левый край, дно, выше навигационной (zIndex 250 > 200)
           Перекрывает низ кнопки ◄ → тап по домой не листает */}
      <button
        style={styles.homeBtn}
        onClick={goBack}
        onPointerEnter={(e) => e.currentTarget.style.opacity = 0.55}
        onPointerLeave={(e) => e.currentTarget.style.opacity = 0.28}
        aria-label="На главную"
      >⌂</button>

      {/* Кнопка ◄ — полная высота, весь левый край */}
      <button
        style={{ ...styles.navBtn, left: 0, opacity: currentPage === 0 ? 0.08 : 0.28 }}
        onClick={prevPage}
        onPointerEnter={(e) => { if (currentPage > 0) e.currentTarget.style.opacity = 0.55 }}
        onPointerLeave={(e) => { e.currentTarget.style.opacity = currentPage === 0 ? 0.08 : 0.28 }}
        disabled={currentPage === 0}
        aria-label="Предыдущая страница"
      >◄</button>

      {/* Кнопка ► — полная высота, весь правый край */}
      <button
        style={{ ...styles.navBtn, right: 0, opacity: currentPage >= totalPages - 1 ? 0.08 : 0.28 }}
        onClick={nextPage}
        onPointerEnter={(e) => { if (currentPage < totalPages - 1) e.currentTarget.style.opacity = 0.55 }}
        onPointerLeave={(e) => { e.currentTarget.style.opacity = currentPage >= totalPages - 1 ? 0.08 : 0.28 }}
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
  homeBtn: {
    // Левый край, дно — точно в ширину кнопки ◄, z-index выше неё (250 > 200)
    // Тап по домой захватывается этой кнопкой; тап выше — идёт на ◄
    position: 'fixed',
    bottom: 0,
    left: 0,
    zIndex: 250,
    width: 'clamp(70px, 7vw, 120px)',
    height: 'clamp(80px, 10vh, 120px)',
    background: 'rgba(10,7,4,0.55)',
    border: 'none',
    outline: 'none',
    borderRadius: 0,
    color: 'var(--color-accent)',
    fontSize: 'clamp(26px, 3.5vh, 48px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    transition: 'opacity 0.2s',
    opacity: 0.28,
  },
  navBtn: {
    position: 'fixed',
    top: 0,
    zIndex: 200,
    width: 'clamp(70px, 7vw, 120px)',
    height: '100%',
    background: 'rgba(10,7,4,0.55)',
    border: 'none',
    color: 'var(--color-accent)',
    fontSize: 'clamp(32px, 4vh, 60px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    transition: 'opacity 0.2s',
    borderRadius: 0,
  },
  navBtnHover: {
    opacity: '1 !important',
    background: 'rgba(10,7,4,0.9)',
  },
}
