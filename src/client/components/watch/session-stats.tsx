import { Coins, Eye, EyeOff, Gauge } from 'lucide-react'
import { cn } from '@/lib/utils'

type SessionStatsProps = {
  liveTokens: number
  playbackSpeed: number
  focused: boolean
  isPlaying?: boolean
}

export function SessionStats({
  liveTokens,
  playbackSpeed,
  focused,
  isPlaying = true,
}: SessionStatsProps) {
  const isMiningActive = focused && isPlaying

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-6">
      <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground">
        Session Stats
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Live tokens */}
        <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/40 p-4">
          <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Coins className="size-3.5 text-neon-gold" aria-hidden="true" />
            Live Tokens
          </span>
          <span className="font-heading text-2xl font-bold text-neon-gold text-glow-gold">
            +{liveTokens}
          </span>
          <span className="text-[11px] text-muted-foreground">this session</span>
        </div>

        {/* Playback speed */}
        <div className="flex flex-col gap-1 rounded-xl border border-border/60 bg-card/40 p-4">
          <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Gauge className="size-3.5 text-primary" aria-hidden="true" />
            Playback Speed
          </span>
          <span className="font-heading text-2xl font-bold text-foreground">
            {playbackSpeed.toFixed(2)}x
          </span>
          <span className="text-[11px] text-muted-foreground">
            tokens scale with speed
          </span>
        </div>

        {/* Focus status */}
        <div
          className={cn(
            'flex flex-col gap-1 rounded-xl border p-4 transition-colors',
            isMiningActive
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : !focused
              ? 'border-destructive/40 bg-destructive/5'
              : 'border-amber-500/40 bg-amber-500/5',
          )}
        >
          <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {isMiningActive ? (
              <Eye className="size-3.5 text-emerald-400" aria-hidden="true" />
            ) : (
              <EyeOff className={cn('size-3.5', !focused ? 'text-destructive' : 'text-amber-400')} aria-hidden="true" />
            )}
            Focus Status
          </span>
          <span className="flex items-center gap-2">
            <span className="relative flex size-3">
              {isMiningActive && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={cn(
                  'relative inline-flex size-3 rounded-full',
                  isMiningActive ? 'bg-emerald-400' : !focused ? 'bg-destructive' : 'bg-amber-400',
                )}
              />
            </span>
            <span
              className={cn(
                'font-heading text-lg font-bold',
                isMiningActive ? 'text-emerald-400' : !focused ? 'text-destructive' : 'text-amber-400',
              )}
            >
              {isMiningActive ? 'Active' : !focused ? 'Hidden' : 'Paused'}
            </span>
          </span>
          <span className="text-[11px] text-muted-foreground">
            {isMiningActive ? 'Earning tokens' : !focused ? 'Tab inactive' : 'Video paused'}
          </span>
        </div>
      </div>
    </div>
  )
}
