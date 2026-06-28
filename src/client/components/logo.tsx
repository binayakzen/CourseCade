import { Gamepad2, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Combined neon logo mark: Gamepad2 overlapped with GraduationCap */}
      <div className="relative grid size-10 place-items-center rounded-xl border border-primary/40 bg-card glow-cyan">
        <Gamepad2
          className="size-6 text-primary text-glow-cyan"
          strokeWidth={2.25}
          aria-hidden="true"
        />
        <GraduationCap
          className="absolute -right-1 -top-1 size-4 text-neon-gold text-glow-gold"
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </div>
      <span className="font-heading text-xl font-extrabold uppercase tracking-[0.18em] text-foreground">
        Course<span className="text-primary text-glow-cyan">cade</span>
      </span>
    </div>
  )
}
