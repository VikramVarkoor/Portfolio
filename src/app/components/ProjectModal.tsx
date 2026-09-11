'use client'

import { useEffect } from 'react'
import { projectMap } from '../data'

export default function ProjectModal({ projectId, onClose }: { projectId: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!projectId) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)

    // Lock background scroll while the modal is open. Without this, once
    // the modal's own scroll area hits its end, the scroll gesture "falls
    // through" and keeps scrolling the page underneath it.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [projectId, onClose])

  if (!projectId) return null
  const p = projectMap[projectId]
  if (!p) return null

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-box">
        <button className="close" onClick={onClose} aria-label="Close">✕</button>
        <div className="mkicker">{p.kicker}</div>
        <h2>{p.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: p.body }} />
        <div className="tags">
          {p.tags.map(t => <span key={t}>{t}</span>)}
        </div>
        {p.links.length > 0 && (
          <div className="linkrow">
            {p.links.map((l, i) => <a key={i} href={l.href}>{l.label}</a>)}
          </div>
        )}
      </div>
    </div>
  )
}
