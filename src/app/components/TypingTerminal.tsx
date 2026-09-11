'use client'

import { useEffect, useRef, useState } from 'react'

export interface TermLine {
  prefix?: string
  text: string
  cls?: string
}

export default function TypingTerminal({ lines }: { lines: TermLine[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) { setStarted(true); setLineIdx(lines.length); return }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [lines.length])

  useEffect(() => {
    if (!started || lineIdx >= lines.length) return
    const current = lines[lineIdx].text
    if (charIdx >= current.length) {
      const t = setTimeout(() => { setLineIdx(l => l + 1); setCharIdx(0) }, 220)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCharIdx(c => c + 1), 18 + Math.random() * 22)
    return () => clearTimeout(t)
  }, [started, lineIdx, charIdx, lines])

  const done = lineIdx >= lines.length

  return (
    <div className="body" ref={ref}>
      {lines.slice(0, done ? lines.length : lineIdx + 1).map((l, i) => {
        const isCurrent = i === lineIdx && !done
        const shown = isCurrent ? l.text.slice(0, charIdx) : l.text
        return (
          <div key={i} className={l.cls}>
            {l.prefix && <span className="prompt">{l.prefix}</span>}
            {shown}
            {isCurrent && <span className="term-caret" />}
          </div>
        )
      })}
    </div>
  )
}
