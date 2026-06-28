import type { LucideIcon } from 'lucide-react'
import { WaveProgress } from '@/components/wave-progress'

type StatRingCardProps = {
  label: string
  icon: LucideIcon
  value: string
  sub: string
  percent: number
  color?: string
}

export function StatRingCard({
  label,
  icon: Icon,
  value,
  sub,
  percent,
  color = 'var(--neon-green)',
}: StatRingCardProps) {
  return (
    <div
      className="relative flex flex-col gap-0 overflow-hidden rounded-2xl backdrop-blur-md border border-white/20 shadow-lg h-40"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Wave progress area - takes most of space */}
      <div className="flex-1 relative">
        <WaveProgress percent={percent} color={color} isDark={true} />
      </div>

      {/* Label and info footer */}
      <div className="px-4 py-3 border-t border-white/10" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-white truncate">
              {label}
            </p>
            <p className="text-[10px] text-gray-300 mt-0.5">{sub}</p>
          </div>
          <Icon className="size-3.5 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
