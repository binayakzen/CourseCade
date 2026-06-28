'use client'

import { useEffect, useMemo, useState } from 'react'
import { Rocket, Sparkles } from 'lucide-react'

type RankUpCelebrationProps = {
  show: boolean
  rankName: string
  color: string
  onDone: () => void
}

const CONFETTI_COLORS = [
  'var(--neon-cyan)',
  'var(--neon-gold)',
  'var(--neon-purple)',
  'var(--neon-green)',
  'var(--neon-pink)',
  'var(--neon-blue)',
]

export function RankUpCelebration({
  show,
  rankName,
  color,
  onDone,
}: RankUpCelebrationProps) {
  const [mounted, setMounted] = useState(false)

  // Pre-compute confetti pieces so they don't reshuffle every render.
  const confetti = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.6,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rounded: Math.random() > 0.5,
      })),
    [],
  )

  useEffect(() => {
    if (!show) return
    setMounted(true)
    // Auto-dismiss after the full sequence has played.
    const timer = setTimeout(() => {
      setMounted(false)
      onDone()
    }, 3600)
    return () => clearTimeout(timer)
  }, [show, onDone])

  if (!show && !mounted) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      role="alertdialog"
      aria-label={`Congratulations, you reached ${rankName} rank`}
    >
      {/* dim + radial flash backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          background: `radial-gradient(60% 60% at 50% 55%, color-mix(in oklch, ${color} 25%, transparent), oklch(0.1 0.02 265 / 82%))`,
        }}
        aria-hidden="true"
      />

      {/* confetti */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="animate-confetti absolute top-0 block"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 1.4,
              background: c.color,
              borderRadius: c.rounded ? '9999px' : '2px',
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              boxShadow: `0 0 8px ${c.color}`,
            }}
          />
        ))}
      </div>

      {/* rocket flying up */}
      <div
        className="animate-rocket-launch pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="animate-rocket-wobble relative">
          <div
            className="grid size-20 place-items-center rounded-full"
            style={{
              background: `color-mix(in oklch, ${color} 22%, transparent)`,
              boxShadow: `0 0 40px 8px ${color}`,
            }}
          >
            <Rocket
              className="size-12 -rotate-45"
              style={{ color }}
              strokeWidth={2.2}
            />
          </div>
          {/* exhaust smoke */}
          <span className="animate-smoke absolute -bottom-2 left-1/2 size-6 -translate-x-1/2 rounded-full bg-neon-orange/70 blur-sm" />
          <span
            className="animate-smoke absolute -bottom-1 left-1/2 size-4 -translate-x-1/2 rounded-full bg-neon-gold/70 blur-sm"
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </div>

      {/* congratulations card */}
      <div className="animate-congrats-pop relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
          <Sparkles className="size-4" style={{ color }} aria-hidden="true" />
          Rank Up
          <Sparkles className="size-4" style={{ color }} aria-hidden="true" />
        </span>
        <h2 className="font-heading text-4xl font-extrabold uppercase tracking-wide text-foreground sm:text-5xl">
          Congratulations!
        </h2>
        <p className="text-base text-muted-foreground">
          You&apos;ve climbed to
        </p>
        <span
          className="font-heading text-3xl font-extrabold uppercase tracking-widest sm:text-4xl"
          style={{ color, textShadow: `0 0 24px ${color}` }}
        >
          {rankName}
        </span>
      </div>
    </div>
  )
}
