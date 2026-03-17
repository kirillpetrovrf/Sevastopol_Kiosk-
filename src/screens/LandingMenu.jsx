import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Конфигурация плиток меню
const SECTIONS = [
  {
    id: 'book',
    icon: '📖',
    title: 'Книга',
    subtitle: 'Интерактивная книга с картами и историческими справками',
    route: '/book',
    active: true,
  },
  {
    id: 'staff',
    icon: '👤',
    title: 'Фотоархив сотрудников',
    subtitle: 'Годы службы, заслуги, биографии',
    route: '/staff',
    active: false, // скрыт до загрузки данных
  },
  {
    id: 'exhibits',
    icon: '🔫',
    title: 'Экспонаты',
    subtitle: 'Оружие и вещественные доказательства',
    route: '/exhibits',
    active: false, // скрыт до загрузки данных
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const tileVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export function LandingMenu() {
  const navigate = useNavigate()

  function handleTileClick(section) {
    if (section.active) {
      navigate(section.route)
    }
    // для неактивных — ничего (сообщение показывается inline)
  }

  return (
    <div style={styles.root}>
      {/* Заголовок */}
      <motion.header
        style={styles.header}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={styles.headerTitle}>
          МУЗЕЙ ИСТОРИИ ПОЛИЦИИ СЕВАСТОПОЛЯ
        </h1>
        <p style={styles.headerSub}>Интерактивный информационный киоск</p>
      </motion.header>

      {/* Плитки */}
      <motion.div
        style={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {SECTIONS.map(section => (
          <motion.div
            key={section.id}
            variants={tileVariants}
            style={{
              ...styles.tile,
              ...(section.active ? styles.tileActive : styles.tileDisabled),
            }}
            onClick={() => handleTileClick(section)}
            whileTap={section.active ? { scale: 0.96 } : {}}
          >
            <span style={styles.tileIcon}>{section.icon}</span>
            <h2 style={styles.tileTitle}>{section.title}</h2>
            <p style={styles.tileSub}>{section.subtitle}</p>

            {!section.active && (
              <div style={styles.comingSoon}>
                Раздел находится в разработке.<br />Скоро здесь появится материал.
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

const styles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg)',
    padding: '40px 60px',
    gap: 40,
  },
  header: {
    textAlign: 'center',
  },
  headerTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(22px, 2.8vw, 48px)',
    color: 'var(--color-accent)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  headerSub: {
    marginTop: 8,
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(13px, 1.2vw, 20px)',
    color: 'var(--color-text-sec)',
    letterSpacing: '0.12em',
  },
  grid: {
    display: 'flex',
    gap: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 1400,
  },
  tile: {
    flex: '1 1 300px',
    maxWidth: 420,
    minHeight: 280,
    borderRadius: 16,
    padding: '36px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: 14,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  tileActive: {
    background: 'var(--color-card)',
    border: '2px solid var(--color-accent)',
    boxShadow: '0 8px 40px rgba(210,160,60,0.15)',
  },
  tileDisabled: {
    background: 'var(--color-card)',
    border: '2px solid rgba(210,160,60,0.25)',
    opacity: 0.45,
    filter: 'blur(0.3px)',
    cursor: 'default',
  },
  tileIcon: {
    fontSize: 52,
    lineHeight: 1,
  },
  tileTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 'clamp(18px, 1.8vw, 28px)',
    color: 'var(--color-accent)',
  },
  tileSub: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(13px, 1.1vw, 18px)',
    color: 'var(--color-text-sec)',
    lineHeight: 1.5,
  },
  comingSoon: {
    marginTop: 8,
    fontSize: 14,
    color: 'var(--color-text-sec)',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
}
