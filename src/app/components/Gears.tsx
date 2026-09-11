function gearPath(cx: number, cy: number, teeth: number, outerR: number, innerR: number) {
  // Fixed decimal precision keeps this string byte-identical between the
  // server render and the client hydration pass. Math.cos/sin can otherwise
  // land on a trailing-digit-different float depending on the JS engine,
  // which trips a hydration mismatch on an otherwise-static path.
  const pts: string[] = []
  const step = (Math.PI * 2) / (teeth * 2)
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const a = i * step
    const x = (cx + r * Math.cos(a)).toFixed(2)
    const y = (cy + r * Math.sin(a)).toFixed(2)
    pts.push(x + ',' + y)
  }
  return 'M' + pts.join('L') + 'Z'
}

export default function Gears({ side = 'right' }: { side?: 'right' | 'left' }) {
  return (
    <svg className={`gearwrap gearwrap-${side}`} viewBox="0 0 320 320" aria-hidden="true">
      <g className="gear-a">
        <path d={gearPath(220, 200, 10, 72, 58)} fill="none" stroke="#d4af37" strokeWidth={2} />
        <circle cx={220} cy={200} r={14} fill="none" stroke="#d4af37" strokeWidth={1.5} />
      </g>
      <g className="gear-b">
        <path d={gearPath(110, 90, 8, 44, 34)} fill="none" stroke="#d4af37" strokeWidth={1.5} />
        <circle cx={110} cy={90} r={9} fill="none" stroke="#d4af37" strokeWidth={1.2} />
      </g>
    </svg>
  )
}
