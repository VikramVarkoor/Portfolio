'use client'

import { useEffect, useState } from 'react'
import HeroWave from './components/HeroWave'
import TypewriterName from './components/TypewriterName'
import ProjectModal from './components/ProjectModal'
import Reveal from './components/Reveal'
import { useWipe } from './components/WipeProvider'
import { trackProjectOpen, trackCvDownload, trackModeSwitch } from './lib/analytics'
import {
  projectMap,
  SPOTLIGHT_IDS,
  ARCHIVE_GROUPS,
  CHANNEL_ICONS,
  skillsData,
  educationRows,
  publicationsRows,
} from './data'

const LAST_UPDATED = 'September 2026'

export default function Home() {
  const { wipeNavigate } = useWipe()
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    function checkPendingProject() {
      const id = sessionStorage.getItem('paletteOpenProject')
      if (id && projectMap[id]) {
        setOpenId(id)
        sessionStorage.removeItem('paletteOpenProject')
      }
    }
    checkPendingProject()
    window.addEventListener('palette-open-project', checkPendingProject)

    const scrollTo = sessionStorage.getItem('paletteScrollTo')
    if (scrollTo) {
      sessionStorage.removeItem('paletteScrollTo')
      const t = setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' })
      }, 350)
      return () => { clearTimeout(t); window.removeEventListener('palette-open-project', checkPendingProject) }
    }
    return () => window.removeEventListener('palette-open-project', checkPendingProject)
  }, [])

  return (
    <div id="home-page">
      <section className="home-hero">
        <nav>
          <span>VV</span>
          <div className="links">
            <a
              className="certbtn"
              href="https://www.linkedin.com/in/vikram-varkoor/details/certifications/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Certifications ↗
            </a>
            <a className="cvbtn" href="/Vikram_Varkoor_CV_General.pdf" download onClick={() => trackCvDownload('home')}>
              Download CV
            </a>
            <button onClick={() => { trackModeSwitch('hardware'); wipeNavigate('/hardware', 'hw-wipe') }}>⚙ Hardware Mode</button>
            <button className="sw" onClick={() => { trackModeSwitch('software'); wipeNavigate('/software', 'sw-wipe') }}>&lt;/&gt; Software Mode</button>
          </div>
        </nav>
        <div className="grid" />
        <HeroWave />
        <TypewriterName text="VIKRAM VARKOOR" />
        <div className="sub">
          FPGA-accelerated systems &amp; applied AI. Two IEEE papers. Currently shipping at the intersection of embedded hardware and machine learning.
        </div>
        <div className="status-line">
          <span className="status-dot" /> Currently: MSc AI @ Heriot-Watt Dubai, starting Sept 2026 · Open to full-time roles
        </div>
      </section>

      <section className="home-body">
        <div className="scope-bg" />
        <div className="subnav">
          <a href="#sec-projects">Projects</a>
          <a href="#sec-archive">Archive</a>
          <a href="#sec-skills">Skills</a>
          <a href="#sec-education">Education</a>
          <a href="#sec-publications">Publications</a>
        </div>

        <Reveal>
        <div className="kicker kicker-first" id="sec-projects">Selected Work</div>
        <h2>Spotlight</h2>
        <div className="subhead">
          The strongest, most complete builds. Everything below has its own link too, so nothing here is ever really hidden from a direct CV reference.
        </div>
        <div className="channel-list">
          {SPOTLIGHT_IDS.map((id, i) => {
            const p = projectMap[id]
            return (
              <button key={id} className="channel-row" onClick={() => { trackProjectOpen(id, 'home'); setOpenId(id) }}>
                <div className="chtag">CH0{i + 1}</div>
                <svg
                  className="spark"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4dff9e"
                  strokeWidth={1.4}
                  dangerouslySetInnerHTML={{ __html: CHANNEL_ICONS[id] || '' }}
                />
                <div className="info">
                  <h3>{p.title}</h3>
                  <p>{p.short}</p>
                  <div className="flags">
                    {p.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
                <div className="arrow">→</div>
              </button>
            )
          })}
        </div>
        </Reveal>

        <Reveal>
        <div className="kicker" id="sec-archive">More Builds</div>
        <h2 style={{ marginBottom: 24 }}>Full Archive</h2>
        <div className="dirlisting">
          {ARCHIVE_GROUPS.map(group => (
            <div key={group.label}>
              <div className="dirgroup"># {group.label}</div>
              {group.ids.map(id => {
                const p = projectMap[id]
                const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                return (
                  <button key={id} className="dirrow" onClick={() => { trackProjectOpen(id, 'home'); setOpenId(id) }}>
                    <span className="prefix">&gt;</span>
                    <span className="fname">{slug}.proj</span>
                    <span className="desc">{p.short}</span>
                    <span className="tagflag">
                      {p.tags.slice(0, 2).map(t => '#' + t.replace(/\s+/g, '').toLowerCase()).join(' ')}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        </Reveal>

        <Reveal>
        <div className="kicker" id="sec-skills">Stack</div>
        <h2 style={{ marginBottom: 24 }}>Skills</h2>
        <div className="skillsblock">
          <div className="cmd">whoami --skills</div>
          {skillsData.map(s => (
            <div className="skillsrow" key={s.cat}>
              <span className="cat">{s.cat}</span>
              <span className="items">{s.items}</span>
            </div>
          ))}
        </div>
        </Reveal>

        <Reveal>
        <div className="kicker" id="sec-education">Background</div>
        <h2 style={{ marginBottom: 24 }}>Education</h2>
        <div className="publog edulog">
          {educationRows.map(row => (
            <div className="prow" key={row.title}>
              <span className={`status ${row.statusClass}`}>{row.status}</span>
              <span className="venue">{row.venue}</span>
              <span className="ptitle">{row.title}<span className="edu-note">, {row.note}</span></span>
              {row.badge ? <span className="edu-badge">{row.badge}</span> : <span />}
            </div>
          ))}
        </div>
        </Reveal>

        <Reveal>
        <div className="kicker" id="sec-publications">Research</div>
        <h2 style={{ marginBottom: 24 }}>Publications</h2>
        <div className="publog">
          {publicationsRows.map(row => (
            <div className="prow" key={row.title}>
              <span className={`status ${row.statusClass}`}>{row.status}</span>
              <span className="venue">{row.venue}</span>
              <span className="ptitle">{row.title}</span>
            </div>
          ))}
        </div>
        </Reveal>

        <div className="footer-line">Last updated {LAST_UPDATED}</div>
      </section>

      <ProjectModal projectId={openId} onClose={() => setOpenId(null)} />
    </div>
  )
}
