import { NextResponse } from 'next/server'

const USERNAME = 'VikramVarkoor'

// Unauthenticated GitHub REST API calls are capped at 60/hour per source IP,
// which is the serverless function's IP here, shared across every visitor.
// `next: { revalidate }` makes Next cache the upstream fetch for an hour, so
// a busy day still costs GitHub at most a couple of calls, not one per
// visitor. Nothing here is fabricated or summarized, it's the same numbers
// GitHub itself reports.
export async function GET() {
  try {
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'vikram-portfolio' }

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=pushed&per_page=5`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ])

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    const user = await userRes.json()
    const repos = await reposRes.json()

    const latest = Array.isArray(repos) && repos.length > 0 ? repos[0] : null
    const daysAgo = latest
      ? Math.max(0, Math.floor((Date.now() - new Date(latest.pushed_at).getTime()) / 86400000))
      : null

    return NextResponse.json({
      ok: true,
      publicRepos: user.public_repos ?? null,
      followers: user.followers ?? null,
      lastPush: latest
        ? { repo: latest.name, daysAgo, url: latest.html_url, pushedAt: latest.pushed_at }
        : null,
      recentRepos: Array.isArray(repos)
        ? repos.slice(0, 5).map((r: { name: string; html_url: string; language: string | null; pushed_at: string }) => ({
            name: r.name,
            url: r.html_url,
            language: r.language,
            pushedAt: r.pushed_at,
          }))
        : [],
    })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
