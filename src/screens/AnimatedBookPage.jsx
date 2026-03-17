import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { PageFrame } from '../components/PageFrame'
import { WatercolorLayer } from '../components/WatercolorLayer'

gsap.registerPlugin(TextPlugin)

export function AnimatedBookPage({ page, pageNumber }) {
  const titleRef   = useRef(null)
  const paraRefs   = useRef([])
  const wrapperRef = useRef(null)
  const tlRef      = useRef(null)
  const timerRef   = useRef(null)

  useEffect(() => {
    const startDelay = page.startDelay ?? 0

    // Сбрасываем состояние немедленно (до задержки)
    if (wrapperRef.current) gsap.set(wrapperRef.current, { opacity: 0 })
    if (titleRef.current)   gsap.set(titleRef.current,   { text: '' })
    paraRefs.current.filter(Boolean).forEach(el => gsap.set(el, { text: '' }))

    // Запускаем анимацию через startDelay мс
    // (правая страница ждёт пока закончит левая)
    timerRef.current = setTimeout(() => {
      const paras = paraRefs.current.filter(Boolean)
      const tl = gsap.timeline()
      tlRef.current = tl

      // Страница проявляется
      if (wrapperRef.current) {
        tl.to(wrapperRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      }

      // Заголовок набирается символ за символом
      if (titleRef.current && page.title) {
        tl.to(titleRef.current, {
          duration: page.title.length * 0.07,
          text: { value: page.title, delimiter: '' },
          ease: 'none',
        })
        tl.to({}, { duration: 0.5 })
      }

      // Параграфы — один за другим
      paras.forEach(el => {
        const text = el.dataset.text
        if (!text) return
        tl.to(el, {
          duration: text.length * 0.038,
          text: { value: text, delimiter: '' },
          ease: 'none',
        })
        tl.to({}, { duration: 0.35 })
      })
    }, startDelay)

    return () => {
      clearTimeout(timerRef.current)
      tlRef.current?.kill()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.id])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--color-paper)' }}>
      <WatercolorLayer pageId={page.id} />
      <PageFrame pageNumber={pageNumber} />

      <div
        ref={wrapperRef}
        style={{
          position: 'relative',
          zIndex: 5,
          padding: 'clamp(20px, 3vh, 60px) clamp(24px, 4vw, 80px) clamp(16px, 2vh, 40px)',
          height: '100%',
          overflow: 'hidden',
          opacity: 0,
          boxSizing: 'border-box',
        }}
      >
        <h2 ref={titleRef} className="page__title" />

        {(page.paragraphs ?? []).map((p, i) =>
          p === '' ? (
            <div key={i} style={{ height: 16 }} />
          ) : (
            <p
              key={i}
              ref={el => { paraRefs.current[i] = el }}
              data-text={p}
              className="page__paragraph"
            />
          )
        )}
      </div>
    </div>
  )
}
