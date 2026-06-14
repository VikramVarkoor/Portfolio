'use client'

import { useEffect, useRef, useState } from 'react'
import { projects, publications, skills, experience } from './data'

const accentMap: Record<string, { dot: string; badge: string; badgeText: string; icon: string }> = {
  blue:   { dot: '#f6ad55', badge: 'rgba(246,173,85,0.12)',  badgeText: '#f6ad55', icon: 'rgba(246,173,85,0.15)' },
  purple: { dot: '#fbd38d', badge: 'rgba(251,211,141,0.12)', badgeText: '#fbd38d', icon: 'rgba(251,211,141,0.15)' },
  teal:   { dot: '#4fd1c5', badge: 'rgba(79,209,197,0.12)',  badgeText: '#4fd1c5', icon: 'rgba(79,209,197,0.15)' },
  amber:  { dot: '#ed8936', badge: 'rgba(237,137,54,0.12)',  badgeText: '#ed8936', icon: 'rgba(237,137,54,0.15)' },
  green:  { dot: '#68d391', badge: 'rgba(104,211,145,0.12)', badgeText: '#68d391', icon: 'rgba(104,211,145,0.15)' },
}

const projectIconMap: Record<string, React.ReactNode> = {
  'Synapse.PL — HEAD System': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#4fd1c5"/>
      <path d="M2 12l10 5 10-5" stroke="#4fd1c5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.75"/>
      <path d="M2 17l10 5 10-5" stroke="#4fd1c5" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  ),
  'Lumen': <span style={{ fontSize: 18 }}>✦</span>,
  'AI Audit Risk Analyzer': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f6ad55">
      <path d="M12 1L3 5v6c0 5.25 3.75 10.15 9 11.25C17.25 21.15 21 16.25 21 11V5L12 1z"/>
    </svg>
  ),
  'Smart Bin': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#68d391" strokeWidth="1.5" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  ),
  'AI HandsFree OS Controller': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4fd1c5" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  'Power Quality Spectral Analyzer': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polyline points="2,12 5,12 7,6 9,18 11,10 13,14 15,12 22,12" stroke="#f6ad55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Smart Grid Theft Detector': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#ed8936"/>
    </svg>
  ),
  'Retail Operations Analytics': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="14" width="4" height="7" rx="1" fill="#f6ad55" opacity="0.5"/>
      <rect x="9" y="9" width="4" height="12" rx="1" fill="#f6ad55" opacity="0.75"/>
      <rect x="15" y="4" width="4" height="17" rx="1" fill="#f6ad55"/>
      <line x1="2" y1="21" x2="22" y2="21" stroke="#f6ad55" strokeWidth="1.2" opacity="0.4"/>
    </svg>
  ),
  'Carbon Emission & CSR Tracker': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#68d391" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22V12M12 12C12 6 7 3 2 3c0 5 3 9 10 9zM12 12c0-6 5-9 10-9 0 5-3 9-10 9z"/>
    </svg>
  ),
  'Smart Meter Analytics': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13" r="8" stroke="#68d391" strokeWidth="1.5"/>
      <path d="M8 13a4 4 0 0 1 8 0" stroke="#68d391" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="13" x2="15" y2="10" stroke="#68d391" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="13" r="1" fill="#68d391"/>
    </svg>
  ),
}

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Section({ label, children, id }: { label: string; children: React.ReactNode; id?: string }) {
  const ref = useFadeUp()
  return (
    <>
      <div className="section-divider" />
      <section id={id} style={{ padding: '52px 32px' }}>
        <div ref={ref} className="fade-up">
          <p style={{ fontSize: 11, color: '#f6ad55', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 28 }}>{label}</p>
          {children}
        </div>
      </section>
    </>
  )
}

export default function Home() {
  const [copied, setCopied] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const copyEmail = () => {
    navigator.clipboard.writeText('vvikram0301@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const heroRef = useFadeUp()

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: 32 }}
        >
          <video
            src={lightbox}
            controls
            autoPlay
            style={{ width: '95vw', height: '95vh', objectFit: 'contain', borderRadius: 12, border: '0.5px solid rgba(246,173,85,0.2)' }}
            onClick={e => e.stopPropagation()}
          />
          <div style={{ position: 'absolute', top: 24, right: 32, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>click anywhere to close</div>
        </div>
      )}

      <div className="orb orb-blue" />
      <div className="orb orb-purple" />

      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 32px', borderBottom: '0.5px solid rgba(246,173,85,0.1)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,13,10,0.85)', backdropFilter: 'blur(16px)',
      }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: '#f6ad55', letterSpacing: 0.5 }}>VV</span>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Projects', 'About', 'Publications', 'Contact'].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f6ad55')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              {s}
            </a>
          ))}
        </div>
      </nav>

      <section style={{ padding: '80px 32px 60px', textAlign: 'center' }}>
        <div ref={heroRef} className="fade-up">
          <div style={{
            display: 'inline-block', padding: '5px 16px',
            background: 'rgba(246,173,85,0.1)', border: '0.5px solid rgba(246,173,85,0.25)',
            borderRadius: 999, fontSize: 12, color: '#f6ad55', marginBottom: 28,
          }}>
            Open to Opportunities · Dubai, UAE
          </div>
          <h1 style={{ fontSize: 'clamp(42px, 8vw, 64px)', fontWeight: 500, color: '#f5f0e8', lineHeight: 1.05, letterSpacing: -2, marginBottom: 18 }}>
            Vikram{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 60%, #c05621 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent',
            }}>
              Varkoor
            </span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.8 }}>
            EE Graduate building AI pipelines, data systems, and hardware platforms.<br />
            IEEE Published. Production deployed.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#projects" style={{
              padding: '11px 24px', background: 'rgba(246,173,85,0.12)',
              border: '0.5px solid rgba(246,173,85,0.35)', borderRadius: 10,
              fontSize: 14, color: '#f6ad55', textDecoration: 'none', cursor: 'pointer',
            }}>
              View Projects
            </a>
            <a href="/Vikram_Varkoor_Resume.pdf" download style={{
              padding: '11px 24px', background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 10,
              fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none',
            }}>
              Download Resume
            </a>
            <a href="https://github.com/VikramVarkoor" target="_blank" rel="noreferrer" style={{
              padding: '11px 24px', background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 10,
              fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none',
            }}>
              GitHub
            </a>
          </div>
        </div>
      </section>

      <Section label="Selected Projects" id="projects">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {projects.map((p, i) => {
            const a = accentMap[p.accent] || accentMap.blue
            return (
              <div key={i} className="glass" style={{ padding: 22 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: a.icon, border: `0.5px solid ${a.dot}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  {projectIconMap[p.title] ?? <span style={{ fontSize: 18 }}>⚡</span>}
                </div>
                <p style={{ fontSize: 15, fontWeight: 500, color: '#f5f0e8', marginBottom: 6 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>{p.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" style={{
                      fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none',
                      padding: '4px 10px', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 6,
                    }}>GitHub</a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer" style={{
                      fontSize: 12, color: a.badgeText, textDecoration: 'none',
                      padding: '4px 10px', border: `0.5px solid ${a.dot}33`,
                      background: a.badge, borderRadius: 6,
                    }}>Live ↗</a>
                  )}
                  {(p as any).video && (
                    <button onClick={() => setLightbox((p as any).video)} style={{
                      fontSize: 12, color: '#f6ad55', cursor: 'pointer',
                      padding: '4px 10px', border: '0.5px solid rgba(246,173,85,0.3)',
                      background: 'rgba(246,173,85,0.08)', borderRadius: 6,
                    }}>Preview ▶</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section label="About" id="about">
        <div className="glass" style={{ padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <img src="/avatar.jpg" alt="Vikram Varkoor" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid rgba(246,173,85,0.3)', objectFit: 'cover', flexShrink: 0 }} />
              <p style={{ fontSize: 22, fontWeight: 500, color: '#f5f0e8', margin: 0 }}>Vikram Varkoor</p>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 24 }}>
              EE graduate from AUD. I build things that sit at the intersection of hardware and software -- AI pipelines,
              data systems, embedded platforms. Two IEEE publications, one production app, and a genuine interest in making
              complex systems work elegantly.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.75 }}>
              Based in Dubai. Immediately available. Available for engineering and AI roles across hardware and software.
            </p>
            <div style={{ marginTop: 28 }}>
              {experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#f5f0e8' }}>{e.role}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#f6ad55', marginBottom: 10 }}>{e.company} · {e.hours}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {e.bullets.map((b, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: '#f6ad55', fontSize: 10, marginTop: 3, flexShrink: 0 }}>✦</span>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {[
                ['degree', 'BSc Electrical Engineering'],
                ['university', 'American University in Dubai'],
                ['internship', 'Syncrow IoT · 422 hrs'],
                ['publications', '2 × IEEE'],
                ['status', 'available now'],
              ].map(([label, val]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: 'rgba(246,173,85,0.04)',
                  borderRadius: 10, border: '0.5px solid rgba(246,173,85,0.08)',
                }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: val === 'available now' ? '#68d391' : '#f5f0e8' }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {skills.map(s => (
                <div key={s.category}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>{s.category}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {s.items.map(item => <span key={item} className="tag">{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section label="Publications" id="publications">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {publications.map((pub, i) => {
            const a = accentMap[pub.accent] || accentMap.purple
            return (
              <div key={i} className="glass" style={{ padding: '20px 22px' }}>
                <div style={{
                  display: 'inline-block', padding: '3px 12px',
                  background: a.badge, border: `0.5px solid ${a.dot}44`,
                  borderRadius: 999, fontSize: 11, color: a.badgeText, marginBottom: 12,
                }}>
                  {pub.badge}
                </div>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#f5f0e8', lineHeight: 1.55, marginBottom: 6 }}>{pub.title}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{pub.venue}</p>
              </div>
            )
          })}
        </div>
      </Section>

      <Section label="Contact" id="contact">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { label: 'email', val: 'vvikram0301@gmail.com', dot: '#f6ad55', action: copyEmail, display: copied ? 'copied!' : 'vvikram0301@gmail.com' },
            { label: 'github', val: 'https://github.com/VikramVarkoor', dot: '#ed8936', display: 'github.com/VikramVarkoor' },
            { label: 'linkedin', val: 'https://www.linkedin.com/in/vikram-varkoor/', dot: '#68d391', display: 'linkedin.com/in/vikram-varkoor' },
          ].map((c, i) => (
            <div
              key={i}
              className="glass"
              style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
              onClick={c.action ? c.action : () => window.open(c.val, '_blank')}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{c.label}</p>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#f5f0e8' }}>{c.display}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <footer style={{ padding: '32px', textAlign: 'center', borderTop: '0.5px solid rgba(246,173,85,0.08)' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>built by vikram varkoor · 2026</p>
      </footer>
    </main>
  )
}
