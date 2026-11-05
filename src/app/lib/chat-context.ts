import { projects, skillsData, educationRows, publicationsRows } from '../data'

// Builds the grounding text the chatbot is allowed to answer from. This is
// deliberately just a compact restatement of what's already public on the
// site itself (short descriptions + the lens summaries, not the full
// deep-dive bullet lists), so the bot can never say anything the site
// itself doesn't already say, and the per-request token count stays small.
function badgeText(badge: string) {
  return badge.replace(/^[^\w(]+/u, '').trim()
}

export function buildChatContext(): string {
  const projectBlocks = projects
    .map(p => {
      const extra = p.swSummary || p.hwSummary || ''
      const links = p.links.length ? `Links: ${p.links.map(l => `${l.label} (${l.href})`).join(', ')}` : ''
      return [`### ${p.title}`, p.kicker, p.short, extra, `Tech: ${p.tags.join(', ')}`, links]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n\n')

  const skillsBlock = skillsData.map(s => `${s.cat}: ${s.items}`).join('\n')

  const eduBlock = educationRows
    .map(e => `${e.title} — ${e.venue}, ${e.note}${e.badge ? ' (' + badgeText(e.badge) + ')' : ''}. Status: ${e.status}.`)
    .join('\n')

  const pubBlock = publicationsRows.map(p => `${p.title} — ${p.venue} (${p.status})`).join('\n')

  const about = [
    'Vikram Varkoor.',
    'BSc Electrical Engineering, American University in Dubai (graduated May 2026).',
    'Currently an MSc Artificial Intelligence student at Heriot-Watt University Dubai.',
    'Based in Dubai, UAE.',
    'Technical identity sits at the intersection of FPGA/embedded hardware and AI/software systems.',
    'Open to full-time roles.',
    'Portfolio: vikramvarkoor.vercel.app. GitHub: github.com/VikramVarkoor. LinkedIn: linkedin.com/in/vikram-varkoor.',
  ].join(' ')

  return [
    `ABOUT VIKRAM:\n${about}`,
    `EDUCATION:\n${eduBlock}`,
    `PUBLICATIONS:\n${pubBlock}`,
    `SKILLS:\n${skillsBlock}`,
    `PROJECTS:\n${projectBlocks}`,
  ].join('\n\n')
}
