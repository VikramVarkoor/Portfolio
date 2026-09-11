import { track } from '@vercel/analytics'

// Thin wrappers around Vercel Analytics custom events. These are aggregate
// counts only, Vercel Analytics never attaches a name, email, or any other
// identifying info to an event, there's no "who clicked this" here, just
// "how many times did this happen."
export function trackProjectOpen(projectId: string, source: 'home' | 'hardware' | 'software' | 'palette') {
  track('project_opened', { projectId, source })
}

export function trackCvDownload(source: 'home' | 'palette') {
  track('cv_downloaded', { source })
}

export function trackModeSwitch(mode: 'hardware' | 'software' | 'home') {
  track('mode_switched', { mode })
}
