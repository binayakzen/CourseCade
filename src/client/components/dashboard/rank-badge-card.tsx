import type React from 'react'
import { Shield, Sparkles, TrendingUp } from 'lucide-react'
import { RANK_TIERS, type Profile } from '@/lib/api'

export function RankBadgeCard({ profile }: { profile: Profile | null }) {
  // Tint the whole card to the player's current rank color.
  const rankColor = profile ? RANK_TIERS[profile.rankTier]?.color ?? 'var(--neon-gold)' : 'var(--neon-gold)'

  return (
    <div
      className="glass-tint relative flex flex-col justify-between overflow-hidden rounded-2xl p-6"
      style={
        {
          '--tint': `color-mix(in oklch, ${rankColor} 26%, transparent)`,
          '--tint-border': `color-mix(in oklch, ${rankColor} 40%, transparent)`,
        } as React.CSSProperties
      }
    >
      {/* ambient glow in the rank color */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full blur-3xl"
        style={{ background: `color-mix(in oklch, ${rankColor} 24%, transparent)` }}
      />

      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Current Rank
        </span>
        <Sparkles className="size-5" style={{ color: rankColor }} aria-hidden="true" />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div
          className="grid size-16 place-items-center rounded-2xl border"
          style={{
            borderColor: `color-mix(in oklch, ${rankColor} 50%, transparent)`,
            background: `color-mix(in oklch, ${rankColor} 12%, transparent)`,
            boxShadow: `0 0 22px -4px ${rankColor}`,
          }}
        >
          <Shield className="size-8" style={{ color: rankColor }} aria-hidden="true" />
        </div>
        <div>
          <p
            className="font-heading text-3xl font-extrabold uppercase tracking-wide"
            style={{ color: rankColor, textShadow: `0 0 18px color-mix(in oklch, ${rankColor} 55%, transparent)` }}
          >
            {profile?.rank ?? '—'}
          </p>
          <p className="text-sm text-muted-foreground">{profile?.username ?? 'Loading…'}</p>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-border/60 pt-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Total Tokens / XP
          </p>
          <p className="font-mono text-2xl font-bold text-foreground">
            {profile ? profile.totalTokens.toLocaleString() : '—'}
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <TrendingUp className="size-3.5" aria-hidden="true" />
          +12% this week
        </span>
      </div>
    </div>
  )
}
