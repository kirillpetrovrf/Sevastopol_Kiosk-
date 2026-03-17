import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const IDLE_TIMEOUT = 60_000

export function IdleManager() {
  const navigate = useNavigate()

  useEffect(() => {
    let timer = setTimeout(returnHome, IDLE_TIMEOUT)

    function reset() {
      clearTimeout(timer)
      timer = setTimeout(returnHome, IDLE_TIMEOUT)
    }

    function returnHome() {
      navigate('/', { replace: true })
    }

    const events = ['touchstart', 'touchmove', 'mousedown', 'mousemove', 'keydown']
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))

    return () => {
      clearTimeout(timer)
      events.forEach(e => window.removeEventListener(e, reset))
    }
  }, [navigate])

  return null
}
