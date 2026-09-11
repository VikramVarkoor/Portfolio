'use client'

import { useEffect } from 'react'

interface Props {
  kicker: string
  title: string
  bodyHtml: string
  theme: 'hardware' | 'software'
  onClose: () => void
}

export default function LensDeepDive({ kicker, title, bodyHtml, theme, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`modal-box deepdive ${theme === 'hardware' ? 'dd-hw' : 'dd-sw'}`}>
        <button className="close" onClick={onClose} aria-label="Close">✕</button>
        <div className="mkicker">{kicker}</div>
        <h2>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>
    </div>
  )
}
