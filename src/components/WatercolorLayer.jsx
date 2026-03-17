import { WatercolorSpot } from './WatercolorSpot'
import { WATERCOLOR_CONFIG } from '../data/bookData'

export function WatercolorLayer({ pageId }) {
  const spots = WATERCOLOR_CONFIG[pageId] ?? []
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {spots.map((s, i) => (
        <WatercolorSpot key={i} {...s} />
      ))}
    </div>
  )
}
