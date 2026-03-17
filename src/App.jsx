import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { IdleManager } from './components/IdleManager'
import { LandingMenu } from './screens/LandingMenu'
import { BookScreen } from './screens/BookScreen'

export default function App() {
  return (
    <BrowserRouter>
      {/* Глобальный таймаут бездействия 60 сек → возврат на "/" (Task 9) */}
      <IdleManager />

      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingMenu />} />
          <Route path="/book" element={<BookScreen />} />
          <Route path="/staff" element={<LandingMenu />} />
          <Route path="/exhibits" element={<LandingMenu />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
