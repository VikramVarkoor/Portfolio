'use client'

import { useEffect, useRef } from 'react'

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

// The wave reacts to the cursor (subtle tilt/lift, like a scope trace
// tracking a probe) and to scroll (sinks and fades as the hero leaves
// view). Everything here is a transform/opacity set directly on the node
// via rAF, never React state, so it never fights the CSS that positions
// the wave (that's what broke it on mobile before) and never re-renders
// the page on every mousemove.
export default function HeroWave() {
  const { pts1, pts2 } = buildPoints()
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const node: SVGSVGElement = svgRef.current

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const target = { x: 0, y: 0, scroll: 0 }
    let raf = 0

    function onMove(e: MouseEvent) {
      const hero = node.closest('.home-hero') as HTMLElement | null
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      target.x = (e.clientX - rect.left) / rect.width - 0.5
      target.y = (e.clientY - rect.top) / rect.height - 0.5
    }
    function onScroll() {
      target.scroll = window.scrollY
    }
    function tick() {
      const skew = target.x * 6
      const liftFromCursor = target.y * -10
      const liftFromScroll = Math.min(target.scroll * 0.15, 60)
      const translateY = liftFromCursor + liftFromScroll
      const opacity = Math.max(0.2, 1 - target.scroll / 500)
      node.style.transform = `translateY(${translateY}px) skewY(${skew}deg)`
      node.style.opacity = String(opacity)
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="wave"
      viewBox="0 0 1600 130"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ willChange: 'transform, opacity' }}
    >
      <polyline points={pts1} fill="none" stroke="#4dff9e" strokeWidth={1.8} />
      <polyline points={pts2} fill="none" stroke="#4dff9e" strokeWidth={1} opacity={0.35} />
    </svg>
  )
}
