'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useWipe } from './WipeProvider'
import { projects } from '../data'
import { trackModeSwitch, trackCvDownload, trackProjectOpen } from '../lib/analytics'

interface Cmd {
  id: string
  label: string
  hint: string
  group: string
  run: () => void
}

export default function CommandPalette() {
  const pathname = usePathname()
  const { wipeNavigate } = useWipe()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => { setOpen(false); setQuery(''); setActive(0) }, [])

  const goHomeSection = useCallback((sectionId: string) => {
    if (pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      sessionStorage.setItem('paletteScrollTo', sectionId)
      wipeNavigate('/', 'home-wipe')
    }
    close()
  }, [pathname, wipeNavigate, close])

  const openProject = useCallback((id: string) => {
    sessionStorage.setItem('paletteOpenProject', id)
    trackProjectOpen(id, 'palette')
    if (pathname === '/') {
      window.dispatchEvent(new Event('palette-open-project'))
    } else {
      wipeNavigate('/', 'home-wipe')
    }
    close()
  }, [pathname, wipeNavigate, close])

  const staticCmds: Cmd[] = useMemo(() => {
    const list: Cmd[] = []
    if (pathname !== '/') {
      list.push({ id: 'home', label: 'Back to home overview', hint: 'navigate', group: 'Go to', run: () => { trackModeSwitch('home'); wipeNavigate('/', 'home-wipe'); close() } })
    }
    if (pathname !== '/hardware') {
      list.push({ id: 'hw-mode', label: 'Switch to Hardware Mode', hint: 'navigate', group: 'Go to', run: () => { trackModeSwitch('hardware'); wipeNavigate('/hardware', 'hw-wipe'); close() } })
    }
    if (pathname !== '/software') {
      list.push({ id: 'sw-mode', label: 'Switch to Software Mode', hint: 'navigate', group: 'Go to', run: () => { trackModeSwitch('software'); wipeNavigate('/software', 'sw-wipe'); close() } })
    }
    list.push(
      { id: 'sec-projects', label: 'Jump to Spotlight projects', hint: 'section', group: 'Go to', run: () => goHomeSection('sec-projects') },
      { id: 'sec-archive', label: 'Jump to Full Archive', hint: 'section', group: 'Go to', run: () => goHomeSection('sec-archive') },
      { id: 'sec-skills', label: 'Jump to Skills', hint: 'section', group: 'Go to', run: () => goHomeSection('sec-skills') },
      { id: 'sec-education', label: 'Jump to Education', hint: 'section', group: 'Go to', run: () => goHomeSection('sec-education') },
      { id: 'sec-publications', label: 'Jump to Publications', hint: 'section', group: 'Go to', run: () => goHomeSection('sec-publications') },
      { id: 'cv', label: 'Download CV', hint: 'PDF', group: 'Action', run: () => {
        trackCvDownload('palette')
        const a = document.createElement('a')
        a.href = '/Vikram_Varkoor_CV_General.pdf'
        a.download = ''
        a.click()
        close()
      } },
    )
    return list
  }, [pathname, wipeNavigate, close, goHomeSection])

  const projectCmds: Cmd[] = useMemo(() => projects.map(p => ({
    id: `proj-${p.id}`,
    label: p.title,
    hint: p.tags[0] || 'project',
    group: 'Projects',
    run: () => openProject(p.id),
  })), [openProject])

  const all = useMemo(() => [...staticCmds, ...projectCmds], [staticCmds, projectCmds])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter(c => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q) || c.group.toLowerCase().includes(q))
  }, [all, query])

  useEffect(() => { setActive(0) }, [query, open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === 'k'
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault()
        setOpen(o => !o)
        return
      }
      if (!open) return
      if (e.key === 'Escape') { e.preventDefault(); close() }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
      if (e.key === 'Enter') { e.preventDefault(); filtered[active]?.run() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, active, close])

  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const t = setTimeout(() => inputRef.current?.focus(), 10)
      return () => { document.body.style.overflow = prevOverflow; clearTimeout(t) }
    }
  }, [open])

  let lastGroup = ''

  return (
    <>
      <button className="palette-hint" onClick={() => setOpen(true)} aria-label="Open command palette">
        <kbd>⌘</kbd><kbd>K</kbd>
      </button>
      {open && (
        <div className="palette-overlay" onClick={(e) => { if (e.target === e.currentTarget) close() }}>
          <div className="palette-box">
            <div className="palette-inputrow">
              <span className="palette-caret">›</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section, mode, or project..."
                autoComplete="off"
                spellCheck={false}
              />
              <kbd>esc</kbd>
            </div>
            <div className="palette-list">
              {filtered.length === 0 && <div className="palette-empty">No matches.</div>}
              {filtered.map((c, i) => {
                const showGroup = c.group !== lastGroup
                lastGroup = c.group
                return (
                  <div key={c.id}>
                    {showGroup && <div className="palette-group">{c.group}</div>}
                    <button
                      className={`palette-item ${i === active ? 'active' : ''}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => c.run()}
                    >
                      <span>{c.label}</span>
                      <span className="palette-tag">{c.hint}</span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
