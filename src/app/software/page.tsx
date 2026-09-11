'use client'

import { useState } from 'react'
import ProjectModal from '../components/ProjectModal'
import LensDeepDive from '../components/LensDeepDive'
import TypingTerminal from '../components/TypingTerminal'
import { useWipe } from '../components/WipeProvider'
import { projectMap, SOFTWARE_LENS_IDS } from '../data'
import { trackProjectOpen, trackModeSwitch } from '../lib/analytics'

function CodeLine({ n, children }: { n: string; children: React.ReactNode }) {
  return <>
    <span className="ln">{n}</span>{children}<br />
  </>
}

export default function SoftwarePage() {
  const { wipeNavigate } = useWipe()
  const [openId, setOpenId] = useState<string | null>(null)
  const [deepId, setDeepId] = useState<string | null>(null)

  let lineNo = 1
  const nextLine = () => String(lineNo++).padStart(2, '0')

  return (
    <div id="software" className="lens-page">
      <div className="scanglow" />
      <div className="minimap">
        {Array.from({ length: 70 }).map((_, i) => (
          <i key={i} style={{ width: `${20 + ((i * 37) % 80)}%` }} />
        ))}
      </div>
      <span className="float-token" style={{ top: 140, left: '6%', animationDelay: '0s' }}>export</span>
      <span className="float-token" style={{ top: 340, left: '88%', animationDelay: '1.2s' }}>async () =&gt;</span>
      <span className="float-token" style={{ top: 520, left: '9%', animationDelay: '2.1s' }}>{'{ status: 200 }'}</span>
      <span className="float-token" style={{ top: 700, left: '85%', animationDelay: '0.6s' }}>import {'{ useEffect }'}</span>
      <span className="float-token" style={{ top: 880, left: '7%', animationDelay: '3s' }}>return () =&gt; {'{}'}</span>
      <span className="float-token" style={{ top: 1040, left: '87%', animationDelay: '1.8s' }}>.then(res =&gt; res.json())</span>
      <span className="float-token" style={{ top: 220, left: '90%', animationDelay: '2.6s' }}>useState(null)</span>
      <span className="float-token" style={{ top: 960, left: '5%', animationDelay: '0.9s' }}>await fetch(url)</span>

      <div className="lens-nav">
        <span>VIKRAM VARKOOR</span>
        <button className="back" onClick={() => { trackModeSwitch('home'); wipeNavigate('/', 'home-wipe') }}>← back to overview</button>
      </div>
      <div className="lens-content">
      <div className="lens-kicker">Software Lens</div>
      <div className="lens-h1">&lt;how I ship product/&gt;</div>
      <div className="lens-sub">
        {'// APIs, state management, and the systems wrapped around the models. '}
        <span style={{ color: '#8fb0ff' }}>the silicon underneath is one click away.</span>
      </div>

      <div className="editor">
        <div className="chrome">
          <div className="dot r" /><div className="dot y" /><div className="dot g" />
          <div className="filename">software-mode.ts</div>
        </div>
        <div className="code">
          <CodeLine n={nextLine()}><span className="com">// software-facing crop</span></CodeLine>
          <CodeLine n={nextLine()}><span className="kw">const</span> <span className="prop">projects</span> <span className="punc">= [</span></CodeLine>
          {SOFTWARE_LENS_IDS.map((id, idx) => {
            const p = projectMap[id]
            const stack = p.tags.slice(0, 3)
            const bullets = p.swBullets || []
            const isLast = idx === SOFTWARE_LENS_IDS.length - 1
            return (
              <span key={id}>
                <CodeLine n={nextLine()}>{'  '}<span className="punc">{'{'}</span></CodeLine>
                <CodeLine n={nextLine()}>{'    '}<span className="prop">name</span><span className="punc">:</span> <span className="str">&quot;{p.title}&quot;</span><span className="punc">,</span></CodeLine>
                <CodeLine n={nextLine()}>
                  {'    '}<span className="prop">stack</span><span className="punc">:</span> <span className="punc">[</span>
                  {stack.map((t, i) => (
                    <span key={t}>
                      <span className="str">&quot;{t}&quot;</span>{i < stack.length - 1 ? <span className="punc">, </span> : null}
                    </span>
                  ))}
                  <span className="punc">],</span>
                </CodeLine>
                <CodeLine n={nextLine()}>{'    '}<span className="prop">summary</span><span className="punc">:</span> <span className="punc">[</span></CodeLine>
                {bullets.map((b, i) => (
                  <CodeLine key={i} n={nextLine()}>
                    {'      '}<span className="str">&quot;{b}&quot;</span><span className="punc">,</span>
                  </CodeLine>
                ))}
                <CodeLine n={nextLine()}>{'    '}<span className="punc">],</span></CodeLine>
                <CodeLine n={nextLine()}>
                  {'  '}<span className="punc">{isLast ? '}' : '},'}</span>{' '}
                  <span className="com">
                    <button className="codelink" onClick={() => { trackProjectOpen(id, 'software'); setOpenId(id) }}>
                      {'// full breakdown '}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </button>
                  </span>
                </CodeLine>
                {p.swDeepDive && (
                  <CodeLine n={nextLine()}>
                    {'  '}
                    <span className="com">
                      <button className="codelink" onClick={() => { trackProjectOpen(id, 'software'); setDeepId(id) }}>
                        {'// software deep-dive '}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </button>
                    </span>
                  </CodeLine>
                )}
              </span>
            )
          })}
          <span className="ln">{nextLine()}</span><span className="punc">]</span><span className="cursor-blink" />
        </div>
      </div>

      <div className="terminal">
        <div className="chrome">
          <div className="dot r" /><div className="dot y" /><div className="dot g" />
          <div className="filename">zsh - deploy</div>
        </div>
        <TypingTerminal
          lines={[
            { prefix: '$ ', text: 'npm run build' },
            { text: '✓ Compiled successfully in 4.2s', cls: 'out' },
            { text: '✓ Type-check passed', cls: 'out' },
            { prefix: '$ ', text: 'vercel --prod' },
            { text: '✓ Deployed to production', cls: 'ok' },
          ]}
        />
      </div>
      </div>

      <ProjectModal projectId={openId} onClose={() => setOpenId(null)} />
      {deepId && projectMap[deepId]?.swDeepDive && (
        <LensDeepDive
          kicker="Software Lens"
          title={projectMap[deepId].title}
          bodyHtml={projectMap[deepId].swDeepDive as string}
          theme="software"
          onClose={() => setDeepId(null)}
        />
      )}
    </div>
  )
}
