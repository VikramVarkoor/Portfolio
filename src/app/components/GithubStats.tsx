'use client'

import { useEffect, useState } from 'react'

const USERNAME = 'VikramVarkoor'

type Stats = {
  ok: boolean
  publicRepos: number | null
  followers: number | null
  lastPush: { repo: string; daysAgo: number; url: string; pushedAt: string } | null
  recentRepos: { name: string; url: string; language: string | null; pushedAt: string }[]
}

export default function GithubStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/github-stats')
      .then(r => r.json())
      .then(d => { if (!cancelled) { if (d.ok) setStats(d); else setFailed(true) } })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="ghstats">
      <div className="cmd">git log --oneline -1 --all</div>

      {failed && (
        <div className="ghstats-fallback">
          Live stats didn&apos;t load. <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer">View GitHub ↗</a>
        </div>
      )}

      {!failed && (
        <div className="ghstats-row">
          <img
            className="ghchart"
            src={`https://ghchart.rshah.org/4dff9e/${USERNAME}`}
            alt={`${USERNAME}'s GitHub contribution graph`}
            loading="lazy"
          />
          <div className="ghstats-meta">
            {stats ? (
              <>
                <div className="ghstats-line">
                  <span className="status-dot" />
                  {stats.lastPush
                    ? <>last push {stats.lastPush.daysAgo === 0 ? 'today' : `${stats.lastPush.daysAgo}d ago`} to <a href={stats.lastPush.url} target="_blank" rel="noopener noreferrer">{stats.lastPush.repo}</a></>
                    : 'no recent push data'}
                </div>
                <div className="ghstats-line dim">
                  {stats.publicRepos ?? '—'} public repos · {stats.followers ?? '—'} followers
                </div>
              </>
            ) : (
              <div className="ghstats-line dim">fetching live data…</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
