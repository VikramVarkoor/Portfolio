'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type WipeVariant = 'hw-wipe' | 'sw-wipe' | 'home-wipe'
type Phase = 'idle' | 'covering' | 'covered' | 'revealing'

interface WipeContextValue {
  wipeNavigate: (href: string, variant: WipeVariant) => void
}

const WipeContext = createContext<WipeContextValue | null>(null)

export function useWipe() {
  const ctx = useContext(WipeContext)
  if (!ctx) throw new Error('useWipe must be used within WipeProvider')
  return ctx
}

export default function WipeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('idle')
  const [variant, setVariant] = useState<WipeVariant>('home-wipe')
  const pendingHref = useRef<string | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  const wipeNavigate = useCallback((href: string, v: WipeVariant) => {
    if (href === pathname) return
    clearTimers()
    setVariant(v)
    setPhase('covering')
    pendingHref.current = href

    // Kick off the real navigation once the overlay is essentially opaque,
    // so the new route mounts while it's fully hidden rather than on a guess.
    const t1 = setTimeout(() => {
      router.push(href)
      setPhase('covered')
    }, 260)

    // Safety net: if the target route is slow to compile/hydrate (cold dev
    // chunk, slow network), don't leave the overlay stuck up forever.
    const t2 = setTimeout(() => {
      setPhase(p => (p === 'covered' ? 'revealing' : p))
    }, 2200)

    timers.current = [t1, t2]
  }, [pathname, router, clearTimers])

  // Only start revealing once the route has actually changed to the target,
  // so we never fade out onto the stale page mid-swap.
  useEffect(() => {
    if (phase === 'covered' && pendingHref.current === pathname) {
      clearTimers()
      const hold = setTimeout(() => setPhase('revealing'), 140)
      timers.current = [hold]
    }
  }, [pathname, phase, clearTimers])

  useEffect(() => {
    if (phase !== 'revealing') return
    const t = setTimeout(() => {
      setPhase('idle')
      pendingHref.current = null
    }, 480)
    return () => clearTimeout(t)
  }, [phase])

  const cls = ['wipe', variant, phase].filter(Boolean).join(' ')

  return (
    <WipeContext.Provider value={{ wipeNavigate }}>
      {children}
      <div className={cls} aria-hidden="true" />
    </WipeContext.Provider>
  )
}
