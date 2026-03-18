import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  {
    id: 'book',
    title: 'КНИГА',
    subtitle: 'Интерактивная книга с картами и историческими справками',
    route: '/book',
    active: true,
  },
  {
    id: 'staff',
    title: 'ФОТОАРХИВ',
    subtitle: 'Сотрудники, годы службы, заслуги',
    route: '/staff',
    active: false,
    image: '/assets/images/staff-archive.jpg'
  },
  {
    id: 'exhibits',
    title: 'ЭКСПОНАТЫ',
    subtitle: 'Оружие и вещественные доказательства',
    route: '/exhibits',
    active: false,
    image: '/assets/images/exhibits.jpg'
  },
]

export function LandingMenu() {
  const navigate = useNavigate()
  const [raised, setRaised] = useState(null) // 'staff' | 'exhibits' | null

  function handleCardClick(id) {
    if (raised === id) return // уже поднята
    setRaised(id)
  }

  function handleBookClick() {
    if (raised) {
      // Если карточка поднята — опускаем её обратно
      setRaised(null)
    } else {
      navigate('/book')
    }
  }

  return (
    <div style={styles.root}>

      {/* Текстура стола */}
      <div style={styles.tableTexture} />

      {/* Затемнение фона когда карточка поднята */}
      <AnimatePresence>
        {raised && (
          <motion.div
            key="backdrop"
            style={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setRaised(null)}
          />
        )}
      </AnimatePresence>

      {/* Книга */}
      <motion.button
        style={{
          ...styles.book,
          zIndex: raised ? 5 : 10,
          cursor: raised ? 'pointer' : 'pointer',
        }}
        onClick={handleBookClick}
        initial={{ opacity: 0, y: 50, rotate: -4 }}
        animate={{ 
          opacity: 1, 
          y: raised ? 0 : [0, -10, 0],
          rotate: -4,
          boxShadow: raised
            ? '0 20px 60px rgba(0,0,0,0.5), 0 8px 25px rgba(0,0,0,0.35)'
            : [
              '0 20px 60px rgba(0,0,0,0.5), 0 8px 25px rgba(0,0,0,0.35)',
              '0 30px 80px rgba(0,0,0,0.65), 0 12px 35px rgba(0,0,0,0.45)',
              '0 20px 60px rgba(0,0,0,0.5), 0 8px 25px rgba(0,0,0,0.35)',
            ]
        }}
        transition={{ 
          opacity: { duration: 1.2, delay: 0.5 },
          y: raised
            ? { duration: 0.4 }
            : { duration: 2.5, delay: 1.5, repeat: Infinity, ease: 'easeInOut' },
          boxShadow: raised
            ? { duration: 0.4 }
            : { duration: 2.5, delay: 1.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        whileHover={raised ? {} : { 
          y: -15, 
          rotate: -4,
          boxShadow: '0 35px 90px rgba(0,0,0,0.7), 0 15px 40px rgba(0,0,0,0.5)',
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Текстура бархата обложки */}
        <div style={styles.bookTexture} />
        <div style={styles.bookBorderOuter} />
        <div style={styles.bookBorderInner} />
        <div style={styles.bookContent}>
          <div style={styles.bookLine} />
          <h2 style={styles.bookTitle}>
            ОТДЕЛ ОХРАНЫ ОБЩЕСТВЕННОГО ПОРЯДКА
          </h2>
          <div style={styles.bookLine} />
          <p style={styles.bookSubtitle}>ЕДИНАЯ ДИСЛОКАЦИЯ</p>
        </div>

        {/* Подсказка "нажмите чтобы убрать карточку" */}
        <AnimatePresence>
          {raised && (
            <motion.div
              style={styles.bookHint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              ✕ закрыть
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Фотоархив */}
      <CardItem
        id="staff"
        raised={raised}
        onCardClick={handleCardClick}
        onClose={() => setRaised(null)}
        initialAnim={{ opacity: 0, x: -50, y: -50 }}
        baseStyle={styles.cardTopLeft}
        imageSrc="/assets/images/staff-archive.jpg"
        label="ФОТОАРХИВ СОТРУДНИКОВ"
      />

      {/* Экспонаты */}
      <CardItem
        id="exhibits"
        raised={raised}
        onCardClick={handleCardClick}
        onClose={() => setRaised(null)}
        initialAnim={{ opacity: 0, x: 50, y: 50 }}
        baseStyle={styles.cardBottomRight}
        imageSrc="/assets/images/exhibits.jpg"
        label="ОРУЖИЕ И ЭКСПОНАТЫ"
      />

    </div>
  )
}

// Компонент карточки с анимацией подъёма
function CardItem({ id, raised, onCardClick, onClose, initialAnim, baseStyle, imageSrc, label }) {
  const isRaised = raised === id
  const otherRaised = raised && raised !== id

  return (
    <motion.div
      style={{
        ...styles.imageCard,
        ...baseStyle,
        zIndex: isRaised ? 50 : 1,
        cursor: isRaised ? 'default' : 'pointer',
        pointerEvents: otherRaised ? 'none' : 'auto',
      }}
      initial={initialAnim}
      animate={{
        opacity: otherRaised ? 0.3 : 1,
        x: 0, y: 0,
        scale: isRaised ? 1.04 : 1,
        boxShadow: isRaised
          ? `0 30px 80px rgba(0,0,0,0.75), 0 0 0 3px #C8A84B`
          : '0 8px 25px rgba(0,0,0,0.4)',
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      onClick={() => !isRaised && onCardClick(id)}
      whileHover={!isRaised && !otherRaised ? {
        scale: 1.05,
        boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
        transition: { duration: 0.25 }
      } : {}}
    >
      <img src={imageSrc} alt={label} style={styles.cardImage} />
      <div style={styles.imageOverlay}>
        <AnimatePresence>
          {isRaised ? (
            <motion.button
              key="close"
              style={styles.closeBtn}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { e.stopPropagation(); onClose() }}
            >✕</motion.button>
          ) : (
            <motion.span key="status" style={styles.overlayStatus} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              скоро
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Цвета
const BG_TABLE     = '#a3b5ca'  // светло-голубой фон (из скриншота)
const TEXT_LIGHT   = '#d8dce6'
const BOOK_COVER   = '#9e4f4f'  // красно-коричневая обложка книги
const GOLD         = '#C8A84B'  // золотое тиснение
const GOLD_LIGHT   = '#e8c96a'

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    background: `linear-gradient(160deg, ${BG_TABLE} 0%, #8fa3bd 100%)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    perspective: 1500,
  },
  
  // Текстура стола
  tableTexture: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.02) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(0,0,0,0.05) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },

  // Заголовок вверху
  header: {
    position: 'absolute',
    top: 'clamp(30px, 5vh, 80px)',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    zIndex: 5,
  },
  headerTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(20px, 3vh, 48px)',
    color: TEXT_LIGHT,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    margin: 0,
    opacity: 0.85,
  },
  headerSubtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(11px, 1.3vh, 20px)',
    color: TEXT_LIGHT,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    margin: '8px 0 0',
    opacity: 0.6,
  },

  // Книга, лежащая на столе
  book: {
    position: 'relative',
    width: 'clamp(550px, 65vw, 1200px)',
    height: 'clamp(400px, 48vw, 880px)',
    background: BOOK_COVER,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    boxShadow: `
      0 20px 60px rgba(0,0,0,0.5),
      0 8px 25px rgba(0,0,0,0.35),
      inset 0 1px 0 rgba(255,255,255,0.05)
    `,
    transform: 'rotate(-4deg) translateX(-8%)',
    transformStyle: 'preserve-3d',
    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
    overflow: 'hidden',
    zIndex: 10,
  },

  // Текстура бархата на обложке
  bookTexture: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `repeating-linear-gradient(
      135deg,
      rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px,
      transparent 1px, transparent 8px
    )`,
    pointerEvents: 'none',
  },

  // Двойная золотая рамка
  bookBorderOuter: {
    position: 'absolute',
    inset: 'clamp(12px, 2%, 24px)',
    border: `2px solid ${GOLD}`,
    opacity: 0.7,
    pointerEvents: 'none',
    borderRadius: 2,
  },
  bookBorderInner: {
    position: 'absolute',
    inset: 'clamp(20px, 3%, 36px)',
    border: `1px solid ${GOLD}`,
    opacity: 0.35,
    pointerEvents: 'none',
    borderRadius: 1,
  },

  // Содержимое обложки
  bookContent: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'clamp(24px, 4%, 60px)',
    textAlign: 'center',
    zIndex: 1,
  },

  bookTopLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(10px, 1.1vw, 18px)',
    color: GOLD,
    letterSpacing: '0.35em',
    opacity: 0.75,
    textTransform: 'uppercase',
    marginBottom: 'clamp(16px, 2.5vh, 32px)',
  },

  bookLine: {
    width: '55%',
    height: 1,
    background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
    margin: '0 auto',
  },

  bookTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(14px, 1.4vw, 28px)',
    color: GOLD_LIGHT,
    letterSpacing: '0.12em',
    lineHeight: 1.3,
    textTransform: 'uppercase',
    margin: 'clamp(20px, 3vh, 48px) 0',
    textShadow: `0 2px 20px rgba(200,168,75,0.3)`,
    padding: '0 clamp(30px, 5%, 80px)',
  },

  bookSubtitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(14px, 1.8vw, 36px)',
    color: GOLD,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    margin: 'clamp(20px, 3vh, 48px) 0 0',
    opacity: 0.9,
  },

  bookBottomText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(10px, 1.2vw, 20px)',
    color: GOLD,
    letterSpacing: '0.08em',
    opacity: 0.65,
    lineHeight: 1.6,
    marginTop: 'clamp(16px, 2.5vh, 32px)',
  },

  // Подсказка для клика
  clickHint: {
    position: 'absolute',
    bottom: 'clamp(-40px, -6vh, -60px)',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(12px, 1.4vh, 20px)',
    color: TEXT_LIGHT,
    opacity: 0.5,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    pointerEvents: 'none',
  },

  // Карточка с изображением (базовые стили)
  imageCard: {
    position: 'absolute',
    width: 'clamp(364px, 32.5vw, 585px)',
    height: 'clamp(234px, 20.8vw, 377px)',
    borderRadius: 8,
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
    border: `3px solid ${GOLD}`,
    opacity: 0.85,
    transition: 'opacity 0.3s ease',
    zIndex: 1,
  },

  // Позиция верхнего левого угла (Фотоархив)
  cardTopLeft: {
    top: '10%',
    left: '10%',
  },

  // Позиция правого нижнего угла (Экспонаты)
  cardBottomRight: {
    bottom: '10%',
    right: '10%',
  },

  // Изображение внутри карточки
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  // Оверлей с текстом "скоро"
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 'clamp(16px, 2vh, 24px)',
    pointerEvents: 'none',
  },

  // Статус "скоро"
  overlayStatus: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(14px, 1.6vh, 22px)',
    color: TEXT_LIGHT,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '8px 24px',
    borderRadius: 4,
    border: `1px solid ${GOLD}`,
  },

  // Затемнение фона при поднятой карточке
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    zIndex: 40,
    cursor: 'pointer',
  },

  // Подсказка на книге "закрыть"
  bookHint: {
    position: 'absolute',
    bottom: 'clamp(12px, 2vh, 24px)',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(11px, 1.3vh, 18px)',
    color: GOLD,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    opacity: 0.7,
    pointerEvents: 'none',
    zIndex: 2,
  },

  // Контент поднятой карточки
  raisedContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'clamp(10px, 1.5vh, 20px)',
    width: '100%',
    paddingBottom: 'clamp(20px, 3vh, 40px)',
  },

  raisedLabel: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(18px, 2.5vw, 42px)',
    color: TEXT_LIGHT,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    textShadow: '0 2px 12px rgba(0,0,0,0.9)',
    textAlign: 'center',
  },

  raisedStatus: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(12px, 1.4vw, 22px)',
    color: GOLD,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '6px 20px',
    borderRadius: 4,
    border: `1px solid ${GOLD}`,
  },

  closeBtn: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(18px, 2.5vh, 32px)',
    color: TEXT_LIGHT,
    background: 'rgba(0,0,0,0.6)',
    border: `1px solid rgba(255,255,255,0.4)`,
    borderRadius: '50%',
    width: 'clamp(36px, 4vh, 52px)',
    height: 'clamp(36px, 4vh, 52px)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 'clamp(12px, 2vh, 20px)',
  },

  // Старые стили для справки (можно удалить)
  sideCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
    padding: 'clamp(16px, 2.5vh, 32px) clamp(20px, 3vw, 48px)',
    background: 'rgba(255,255,255,0.06)',
    border: `2px solid ${TEXT_LIGHT}`,
    borderRadius: 8,
    opacity: 0.5,
    minWidth: 'clamp(160px, 18vw, 280px)',
    transition: 'all 0.3s ease',
  },

  sideCardTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(13px, 1.8vh, 24px)',
    color: TEXT_LIGHT,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },

  sideCardStatus: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(10px, 1.2vh, 16px)',
    color: TEXT_LIGHT,
    opacity: 0.7,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },
}
