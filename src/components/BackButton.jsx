import { useNavigate } from 'react-router-dom'

const styles = {
  button: {
    position: 'fixed',
    top: 28,
    left: 28,
    zIndex: 200,
    minWidth: 'var(--btn-min)',
    minHeight: 'var(--btn-min)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 24px',
    background: 'rgba(26,22,18,0.82)',
    border: '2px solid var(--color-accent)',
    borderRadius: 12,
    color: 'var(--color-accent)',
    fontFamily: 'var(--font-heading)',
    fontSize: 22,
    fontWeight: 700,
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.2s',
    touchAction: 'manipulation',
  },
}

export function BackButton({ to = '/' }) {
  const navigate = useNavigate()

  return (
    <button
      style={styles.button}
      onClick={() => navigate(to, { replace: true })}
      aria-label="Назад"
    >
      ← Назад
    </button>
  )
}
