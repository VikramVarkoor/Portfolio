'use client'

import { useEffect, useRef, useState } from 'react'
import { trackChatOpened, trackChatMessage } from '../lib/analytics'

type Msg = { role: 'user' | 'assistant'; text: string; source?: string; isError?: boolean }

const SUGGESTIONS = [
  'What is the Forecast Harness project?',
  "What's his strongest skill area?",
  'Is he open to roles outside Dubai?',
  'What is he studying right now?',
]

const SOURCE_TAG = /\s*\[source:\s*([^\]]+)\]\s*$/i

function splitSource(raw: string): { text: string; source?: string } {
  const m = raw.match(SOURCE_TAG)
  if (!m) return { text: raw }
  return { text: raw.slice(0, m.index).trim(), source: m[1].trim() }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const openedOnce = useRef(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  function toggleOpen() {
    setOpen(o => {
      const next = !o
      if (next && !openedOnce.current) {
        openedOnce.current = true
        trackChatOpened()
      }
      return next
    })
  }

  async function send(text: string) {
    const clean = text.trim()
    if (!clean || loading) return
    trackChatMessage()
    const nextMessages: Msg[] = [...messages, { role: 'user', text: clean }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          history: nextMessages.slice(-9, -1).map(m => ({ role: m.role, text: m.text })),
        }),
      })
      const data = await res.json()
      if (data.ok) {
        const { text: reply, source } = splitSource(data.reply)
        setMessages(m => [...m, { role: 'assistant', text: reply, source }])
      } else {
        const fallback =
          data.error === 'not_configured'
            ? "This isn't wired up yet, ask Vikram directly for now."
            : data.error === 'rate_limited'
            ? "That's a lot of questions at once, give it a minute and try again."
            : "Couldn't get an answer just now, try again in a bit."
        setMessages(m => [...m, { role: 'assistant', text: fallback, isError: true }])
      }
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Connection hiccup, try again in a bit.', isError: true }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        className="chat-toggle"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Ask a question about Vikram'}
      >
        <span className="status-dot" /> {open ? 'Close' : 'Ask AI'}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label="Ask about Vikram">
          <div className="chat-head">
            <span className="chat-head-title">ask-vikram.sh</span>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>

          <div className="chat-body" ref={listRef}>
            {messages.length === 0 && (
              <div className="chat-empty">
                <p>Ask anything about his projects, skills, or background. Answers are grounded in what&apos;s actually on this site.</p>
                <div className="chat-chips">
                  {SUGGESTIONS.map(s => (
                    <button key={s} className="chat-chip" onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}${m.isError ? ' err' : ''}`}>
                <div className="chat-bubble">{m.text}</div>
                {m.source && <div className="chat-source">source: {m.source}</div>}
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="chat-bubble chat-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <form
            className="chat-inputrow"
            onSubmit={e => { e.preventDefault(); send(input) }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about a project, skill, or his background…"
              aria-label="Your question"
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send">→</button>
          </form>
        </div>
      )}
    </>
  )
}
