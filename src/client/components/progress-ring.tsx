'use client'

import { type ReactNode, useId } from 'react'

type ProgressRingProps = {
  value: number // 0-100
  size?: number
  stroke?: number
  color?: string // any CSS color
  children?: ReactNode
}

export function ProgressRing({
  value,
  size = 120,
  stroke = 9,
  color = 'var(--neon-cyan)',
  children,
}: ProgressRingProps) {
  // Unique, CSS-safe id so each ring's glow filter is isolated.
  const glowId = `ring-glow-${useId().replace(/:/g, '')}`
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}% complete`}
    >
      {/* overflow-visible lets the glow spill out; the glow lives inside the
          SVG via an SVG filter (not a CSS `filter`), which avoids creating an
          isolated rectangular layer that would clip the card's backdrop-blur
          into a visible square. */}
      <svg width={size} height={size} className="-rotate-90 overflow-visible">
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter={`url(#${glowId})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {children}
      </div>
    </div>
  )
}
