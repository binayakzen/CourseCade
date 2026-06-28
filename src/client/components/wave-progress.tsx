'use client'

export type WaveProgressProps = {
  percent: number // 0-100
  color?: string
  label?: string
  isDark?: boolean
}

export function WaveProgress({
  percent,
  color = 'var(--neon-green)',
  label,
  isDark = false,
}: WaveProgressProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  const waveHeight = (clamped / 100) * 100

  return (
    <div className="relative w-full h-32 rounded-lg overflow-hidden" style={{
      background: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
    }}>
      {/* Wave animation background */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox={`0 0 1200 120`}
        style={{
          opacity: 0.8,
        }}
      >
        <defs>
          <linearGradient id={`wave-gradient-${clamped}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
          <style>{`
            @keyframes wave-motion {
              0% { transform: translateX(0); }
              100% { transform: translateX(1200px); }
            }
            .wave-path {
              animation: wave-motion 8s linear infinite;
            }
          `}</style>
        </defs>

        {/* First wave */}
        <path
          d={`M0,${120 - waveHeight} Q300,${120 - waveHeight - 15} 600,${120 - waveHeight} T1200,${120 - waveHeight} L1200,120 L0,120 Z`}
          fill={`url(#wave-gradient-${clamped})`}
          className="wave-path"
          opacity="0.7"
        />

        {/* Second wave (phase offset) */}
        <path
          d={`M0,${120 - waveHeight + 5} Q300,${120 - waveHeight - 10} 600,${120 - waveHeight + 5} T1200,${120 - waveHeight + 5} L1200,120 L0,120 Z`}
          fill={`url(#wave-gradient-${clamped})`}
          className="wave-path"
          opacity="0.5"
          style={{
            animationDelay: '-4s',
          }}
        />
      </svg>

      {/* Percentage overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-heading text-2xl font-bold" style={{ color }}>
            {clamped}%
          </div>
          {label && (
            <div className="text-xs font-semibold text-gray-100 mt-1">
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
