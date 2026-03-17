import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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

  return (
    <div style={styles.root}>

      {/* Текстура стола */}
      <div style={styles.tableTexture} />

      {/* Заголовок музея вверху */}
      {/* Книга, лежащая на столе */}
      <motion.button
        style={styles.book}
        onClick={() => navigate('/book')}
        initial={{ opacity: 0, y: 50, rotate: -4 }}
        animate={{ 
          opacity: 1, 
          y: [0, -10, 0],
          rotate: -4,
          boxShadow: [
            '0 20px 60px rgba(0,0,0,0.5), 0 8px 25px rgba(0,0,0,0.35)',
            '0 30px 80px rgba(0,0,0,0.65), 0 12px 35px rgba(0,0,0,0.45)',
            '0 20px 60px rgba(0,0,0,0.5), 0 8px 25px rgba(0,0,0,0.35)',
          ]
        }}
        transition={{ 
          opacity: { duration: 1.2, delay: 0.5 },
          y: { 
            duration: 2.5, 
            delay: 1.5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          },
          boxShadow: { 
            duration: 2.5, 
            delay: 1.5, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          },
        }}
        whileHover={{ 
          y: -15, 
          rotate: -4,
          boxShadow: '0 35px 90px rgba(0,0,0,0.7), 0 15px 40px rgba(0,0,0,0.5)',
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Текстура бархата обложки */}
        <div style={styles.bookTexture} />

        {/* Двойная рамка */}
        <div style={styles.bookBorderOuter} />
        <div style={styles.bookBorderInner} />

        {/* Содержимое обложки */}
        <div style={styles.bookContent}>
          <div style={styles.bookLine} />

          <h2 style={styles.bookTitle}>
            ОТДЕЛ ОХРАНЫ<br />
            ОБЩЕСТВЕННОГО ПОРЯДКА
          </h2>

          <div style={styles.bookLine} />

          <p style={styles.bookSubtitle}>
            ЕДИНАЯ ДИСЛОКАЦИЯ
          </p>
        </div>
      </motion.button>

      {/* Фотоархив - верхний левый угол */}
      <motion.div 
        style={{...styles.imageCard, ...styles.cardTopLeft}}
        initial={{ opacity: 0, x: -50, y: -50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
          transition: { duration: 0.3 }
        }}
      >
        <img 
          src="/assets/images/staff-archive.jpg" 
          alt="ФОТОАРХИВ"
          style={styles.cardImage}
        />
        <div style={styles.imageOverlay}>
          <span style={styles.overlayStatus}>скоро</span>
        </div>
      </motion.div>

      {/* Экспонаты - правый нижний угол */}
      <motion.div 
        style={{...styles.imageCard, ...styles.cardBottomRight}}
        initial={{ opacity: 0, x: 50, y: 50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
          transition: { duration: 0.3 }
        }}
      >
        <img 
          src="/assets/images/exhibits.jpg" 
          alt="ЭКСПОНАТЫ"
          style={styles.cardImage}
        />
        <div style={styles.imageOverlay}>
          <span style={styles.overlayStatus}>скоро</span>
        </div>
      </motion.div>

    </div>
  )
}

// Цвета
const BG_TABLE     = '#4a5165'  // серо-синий стол
const TEXT_LIGHT   = '#d8dce6'
const BOOK_COVER   = '#6b1a1a'  // бордовая обложка книги
const GOLD         = '#C8A84B'  // золотое тиснение
const GOLD_LIGHT   = '#e8c96a'

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    background: `linear-gradient(160deg, ${BG_TABLE} 0%, #3d4254 100%)`,
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
    fontSize: 'clamp(24px, 3.5vw, 64px)',
    color: GOLD_LIGHT,
    letterSpacing: '0.08em',
    lineHeight: 1.3,
    textTransform: 'uppercase',
    margin: 'clamp(20px, 3vh, 48px) 0',
    textShadow: `0 2px 20px rgba(200,168,75,0.3)`,
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
    width: 'clamp(280px, 25vw, 450px)',
    height: 'clamp(180px, 16vw, 290px)',
    borderRadius: 8,
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
    border: `3px solid ${GOLD}`,
    opacity: 0.85,
    transition: 'all 0.3s ease',
    zIndex: 5,
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
