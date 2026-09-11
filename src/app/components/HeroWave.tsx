'use client'

function buildPoints() {
  const period = 200
  const midY = 90
  const amp = 42
  const pts1: string[] = []
  const pts2: string[] = []
  for (let x = 0; x <= 1600; x += 4) {
    const y1 = midY + amp * Math.sin((x / period) * 2 * Math.PI)
    pts1.push(x + ',' + y1.toFixed(1))
    const y2 = midY + 18 * Math.sin((x / (period / 2)) * 2 * Math.PI + 1.2)
    pts2.push(x + ',' + y2.toFixed(1))
  }
  return { pts1: pts1.join(' '), pts2: pts2.join(' ') }
}

export default function HeroWave() {
  const { pts1, pts2 } = buildPoints()
  return (
    <svg className="wave" viewBox="0 0 1600 130" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts1} fill="none" stroke="#4dff9e" strokeWidth={1.8} />
      <polyline points={pts2} fill="none" stroke="#4dff9e" strokeWidth={1} opacity={0.35} />
    </svg>
  )
}
