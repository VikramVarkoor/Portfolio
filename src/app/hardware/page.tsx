'use client'

import { useState } from 'react'
import Gears from '../components/Gears'
import ProjectModal from '../components/ProjectModal'
import LensDeepDive from '../components/LensDeepDive'
import { useWipe } from '../components/WipeProvider'
import { projectMap, HARDWARE_LENS_IDS } from '../data'
import { trackProjectOpen, trackModeSwitch } from '../lib/analytics'

const SPEC_TAGS: Record<string, string> = {
  synapse: 'U01 · FPGA',
  powerquality: 'U02 · DSP',
  smartbin: 'U03 · COMPUTER VISION',
  syncrow: 'U04 · FIELD WORK',
}

export default function HardwarePage() {
  const { wipeNavigate } = useWipe()
  const [openId, setOpenId] = useState<string | null>(null)
  const [deepId, setDeepId] = useState<string | null>(null)

  return (
    <div id="hardware" className="lens-page">
      <div className="texture" />
      <Gears side="right" />
      <Gears side="left" />
      <div className="lens-nav">
        <span>VIKRAM VARKOOR</span>
        <button className="back" onClick={() => { trackModeSwitch('home'); wipeNavigate('/', 'home-wipe') }}>← back to overview</button>
      </div>
      <div className="lens-content">
        <div className="lens-kicker">Hardware Lens</div>
        <div className="lens-h1">How I build at the silicon level</div>
        <div className="lens-sub">
          Timing constraints, signal paths, and the physical limits of the boards these actually run on. The application layer sitting on top is one click away.
        </div>
        <div className="specsheet">
          {HARDWARE_LENS_IDS.map(id => {
            const p = projectMap[id]
            return (
              <div className="specrow" key={id}>
                <div className="corner l" />
                <div className="corner r" />
                <div className="tag">{SPEC_TAGS[id]}</div>
                <h3>{p.title}</h3>
                <ul className="spec-bullets">
                  {(p.hwBullets || []).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <div className="specs">
                  {p.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}
                </div>
                <div className="linkrow-lens">
                  <button className="fulllink" onClick={() => { trackProjectOpen(id, 'hardware'); setOpenId(id) }}>
                    full breakdown
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                  {p.hwDeepDive && (
                    <button className="deeplink" onClick={() => { trackProjectOpen(id, 'hardware'); setDeepId(id) }}>
                      hardware deep-dive
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <ProjectModal projectId={openId} onClose={() => setOpenId(null)} />
      {deepId && projectMap[deepId]?.hwDeepDive && (
        <LensDeepDive
          kicker={SPEC_TAGS[deepId]}
          title={projectMap[deepId].title}
          bodyHtml={projectMap[deepId].hwDeepDive as string}
          theme="hardware"
          onClose={() => setDeepId(null)}
        />
      )}
    </div>
  )
}
