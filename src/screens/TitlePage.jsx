import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { PageFrame } from '../components/PageFrame'
import { WatercolorLayer } from '../components/WatercolorLayer'

gsap.registerPlugin(TextPlugin)

export function TitlePage({ pageNumber }) {
  const wrapperRef = useRef(null)
  const titleRef = useRef(null)
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const line3Ref = useRef(null)
  const line4Ref = useRef(null)
  const line5Ref = useRef(null)
  const line6Ref = useRef(null)
  const line7Ref = useRef(null)
  const line8Ref = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => {
    // Сбрасываем состояние
    if (wrapperRef.current) gsap.set(wrapperRef.current, { opacity: 0 })
    if (titleRef.current) gsap.set(titleRef.current, { text: '' })
    const refs = [line1Ref, line2Ref, line3Ref, line4Ref, line5Ref, line6Ref, line7Ref, line8Ref]
    refs.forEach(ref => {
      if (ref.current) gsap.set(ref.current, { text: '' })
    })

    // Запускаем анимацию
    const tl = gsap.timeline()
    tlRef.current = tl

    // Страница проявляется
    if (wrapperRef.current) {
      tl.to(wrapperRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    }

    // Заголовок
    const titleText = 'ПРИНЦИПИАЛЬНАЯ СХЕМА'
    if (titleRef.current) {
      tl.to(titleRef.current, {
        duration: titleText.length * 0.07,
        text: { value: titleText, delimiter: '' },
        ease: 'none',
      })
      tl.to({}, { duration: 0.5 })
    }

    // Текст с буквицами
    const lines = [
      'омплексного использования сил и средств',
      'о охране общественного порядка',
      ' городе Севастополе (единая дислокация).',
      '= УТВЕРЖДАЮ =',
      'ачальник УВД г. Севастополя',
      '.А. Белобородов',
      '— СЕКРЕТНО —',
      'кз. № 1',
    ]

    refs.forEach((ref, i) => {
      if (ref.current && lines[i]) {
        tl.to(ref.current, {
          duration: lines[i].length * 0.038,
          text: { value: lines[i], delimiter: '' },
          ease: 'none',
        })
        tl.to({}, { duration: 0.35 })
      }
    })

    return () => {
      tlRef.current?.kill()
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--color-paper)' }}>
      <WatercolorLayer pageId="title-page" />
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
        {/* Заголовок */}
        <h2 ref={titleRef} className="page__title" style={{ textAlign: 'center', marginBottom: 'clamp(24px, 3vh, 48px)' }} />

        {/* Текст с буквицами */}
        <div style={{ marginBottom: 'clamp(20px, 2.5vh, 40px)' }}>
          <p className="page__paragraph" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '1.8em', fontWeight: 'bold', float: 'left', marginRight: 4, lineHeight: 0.9 }}>К</span>
            <span ref={line1Ref} />
          </p>
          <p className="page__paragraph" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '1.8em', fontWeight: 'bold', float: 'left', marginRight: 4, lineHeight: 0.9 }}>П</span>
            <span ref={line2Ref} />
          </p>
          <p className="page__paragraph" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '1.8em', fontWeight: 'bold', float: 'left', marginRight: 4, lineHeight: 0.9 }}>В</span>
            <span ref={line3Ref} />
          </p>
        </div>

        {/* УТВЕРЖДАЮ */}
        <p ref={line4Ref} className="page__paragraph" style={{ textAlign: 'center', marginTop: 'clamp(16px, 2vh, 32px)', marginBottom: 'clamp(16px, 2vh, 32px)' }} />

        {/* Начальник */}
        <div style={{ marginBottom: 'clamp(20px, 2.5vh, 40px)' }}>
          <p className="page__paragraph" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '1.8em', fontWeight: 'bold', float: 'left', marginRight: 4, lineHeight: 0.9 }}>Н</span>
            <span ref={line5Ref} />
          </p>
          <p className="page__paragraph" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '1.3em', fontWeight: 'bold', marginRight: 4 }}>В</span>
            <span ref={line6Ref} />
          </p>
        </div>

        {/* СЕКРЕТНО */}
        <p ref={line7Ref} className="page__paragraph" style={{ textAlign: 'center', marginTop: 'clamp(16px, 2vh, 32px)', marginBottom: 'clamp(12px, 1.5vh, 24px)' }} />

        {/* Экземпляр */}
        <p className="page__paragraph" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '1.8em', fontWeight: 'bold', float: 'left', marginRight: 4, lineHeight: 0.9 }}>Э</span>
          <span ref={line8Ref} />
        </p>
      </div>
    </div>
  )
}
