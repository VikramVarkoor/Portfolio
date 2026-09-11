import { ImageResponse } from 'next/og'

export const alt = 'Vikram Varkoor, Portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const points: string[] = []
  const midY = 60
  const amp = 34
  const period = 160
  for (let x = 0; x <= 1200; x += 6) {
    const y = midY + amp * Math.sin((x / period) * 2 * Math.PI)
    points.push(`${x},${y.toFixed(1)}`)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#06090a',
          padding: '80px 90px',
          position: 'relative',
        }}
      >
        <svg
          width="1200"
          height="120"
          viewBox="0 0 1200 120"
          style={{ position: 'absolute', bottom: 90, left: 0, opacity: 0.85 }}
        >
          <polyline points={points.join(' ')} fill="none" stroke="#4dff9e" strokeWidth={4} />
        </svg>
        <div style={{ display: 'flex', fontSize: 26, color: '#4dff9e', letterSpacing: 4, marginBottom: 22, fontFamily: 'monospace' }}>
          VV
        </div>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 700, color: '#baffc9', letterSpacing: -1 }}>
          VIKRAM VARKOOR
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: '#7ed9a3', marginTop: 26, maxWidth: 900 }}>
          FPGA-accelerated systems &amp; applied AI. IEEE Published. Production deployed.
        </div>
      </div>
    ),
    { ...size }
  )
}
