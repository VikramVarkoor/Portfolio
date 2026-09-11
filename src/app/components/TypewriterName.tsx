'use client'

import { useEffect, useState } from 'react'

export default function TypewriterName({ text }: { text: string }) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Note: this effect is expected to run its mount/cleanup/mount cycle
    // once under React Strict Mode in dev, that's fine, it just retypes
    // once. Don't guard against re-running with a ref, doing so leaves the
    // interval permanently cleared with nothing left to restart it.
    setShown('')
    setDone(false)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setShown(text)
      setDone(true)
      return
    }

    let i = 0
    const speed = 78
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(id)
  }, [text])

  return (
    <h1 className="type-h1">
      <span aria-hidden="true">
        {shown}
        <span className={`type-cursor ${done ? 'blink' : ''}`} />
      </span>
      <span className="sr-only">{text}</span>
    </h1>
  )
}
