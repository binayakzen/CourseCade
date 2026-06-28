import { Check, Lock } from 'lucide-react'
import { RANK_TIERS, type Profile } from '@/lib/api'
import { cn } from '@/lib/utils'

export function RankTimeline({
  profile,
  celebrateTier = null,
}: {
  profile: Profile | null
  celebrateTier?: number | null
}) {
  const tokens = profile?.totalTokens ?? 0
  let calculatedTier = 0
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (tokens >= RANK_TIERS[i].threshold) calculatedTier = i
  }
  const currentTier = calculatedTier
  const nextTier = RANK_TIERS[currentTier + 1]
  const tokensToNext = nextTier ? Math.max(0, nextTier.threshold - tokens) : 0

  // Calculate smooth sync fill percentage across the timeline
  let fillPct = 0
  if (!nextTier) {
    fillPct = 100
  } else {
    const tierSpan = nextTier.threshold - RANK_TIERS[currentTier].threshold
    const progressInTier = tokens - RANK_TIERS[currentTier].threshold
    const tierProgressPct = tierSpan > 0 ? Math.min(1, Math.max(0, progressInTier / tierSpan)) : 0
    fillPct = ((currentTier + tierProgressPct) / (RANK_TIERS.length - 1)) * 100
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/60 flex flex-col justify-between h-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
        <h2 className="font-sans text-sm font-black uppercase tracking-wider text-gray-900">
          Rank Trajectory Timeline
        </h2>
        {nextTier ? (
          <p className="font-mono text-xs font-bold text-gray-500">
            <span className="font-black text-[#65a30d] bg-[#ecfccb] px-2 py-0.5 rounded-full">
              {tokensToNext.toLocaleString()} tokens
            </span>{' '}
            to unlock <span className="font-black text-gray-900 underline decoration-[#a3e635] decoration-2">{nextTier.name}</span>
          </p>
        ) : (
          <p className="font-mono text-xs font-black text-[#65a30d]">Max Immortal Rank Reached!</p>
        )}
      </div>

      <div className="relative my-auto overflow-x-auto pb-4 pt-2 px-1 scrollbar-thin">
        {/* base line */}
        <div className="absolute left-6 right-6 top-6 h-1.5 -translate-y-1/2 rounded-full bg-gray-100" />
        {/* progress line */}
        <div
          className="absolute left-6 top-6 h-1.5 -translate-y-1/2 rounded-full transition-all duration-700 bg-[#111827]"
          style={{ width: `calc(${fillPct}% - 12px)` }}
        />

        <ol className="relative flex items-start justify-between min-w-[640px] gap-2">
          {RANK_TIERS.map((tier, i) => {
            const reached = i < currentTier
            const current = i === currentTier
            const active = reached || current
            const justRanked = celebrateTier === i
            return (
              <li key={tier.name} className="relative flex flex-col items-center flex-1 text-center group cursor-default">
                {justRanked && (
                  <span
                    aria-hidden="true"
                    className="animate-ping absolute left-1/2 top-4 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a3e635] opacity-75"
                  />
                )}
                <span
                  className={cn(
                    'grid size-8 place-items-center rounded-full border-2 transition-all z-10 shadow-sm',
                    reached ? 'bg-[#111827] border-[#111827] text-white' :
                    current ? 'bg-[#a3e635] border-black text-black scale-110 shadow-md ring-4 ring-[#ecfccb]' :
                    'bg-white border-gray-200 text-gray-300'
                  )}
                >
                  {reached ? (
                    <Check className="size-4 stroke-[3]" aria-hidden="true" />
                  ) : current ? (
                    <span className="size-2.5 rounded-full bg-black animate-pulse" />
                  ) : (
                    <Lock className="size-3.5" aria-hidden="true" />
                  )}
                </span>
                <span
                  className={cn(
                    'font-sans text-[11px] font-black uppercase tracking-tight mt-2.5 whitespace-nowrap transition-colors',
                    current ? 'text-black font-black scale-105' :
                    reached ? 'text-gray-800' : 'text-gray-400'
                  )}
                >
                  {tier.name}
                </span>
                <span className="font-mono text-[9px] font-bold text-gray-400 mt-0.5">
                  {tier.threshold === 0 ? 'START' : `${(tier.threshold / 1000).toFixed(1)}k`}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
