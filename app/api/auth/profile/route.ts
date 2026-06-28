import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { FALLBACK_USER } from '@/server/db/mock-data'

const RANK_TIERS = [
  { name: 'Stone', threshold: 0 },
  { name: 'Iron', threshold: 500 },
  { name: 'Bronze', threshold: 1500 },
  { name: 'Silver', threshold: 3500 },
  { name: 'Gold', threshold: 6500 },
  { name: 'Platinum', threshold: 11500 },
  { name: 'Diamond', threshold: 19500 },
  { name: 'Legend', threshold: 31500 },
  { name: 'Grand Master', threshold: 49500 },
  { name: 'Immortal', threshold: 74500 },
]

function getRankFromXp(xp: number) {
  let tierIdx = 0
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (xp >= RANK_TIERS[i].threshold) {
      tierIdx = i
    }
  }
  return { rank: RANK_TIERS[tierIdx].name, rankTier: tierIdx }
}

export async function GET() {
  try {
    let userId: string | null = null
    try {
      const authData = await auth()
      userId = authData.userId
    } catch (e) {}
    const targetUserId = userId || 'user_1'

    let user: any = null
    try {
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, targetUserId))
        .limit(1)
      user = dbUser
    } catch (dbErr) {
      // DB unavailable
    }

    if (!user && targetUserId !== 'user_1') {
      try {
        await db.insert(users).values({
          id: targetUserId,
          username: 'Scholar_' + targetUserId.slice(-4),
          rankTier: 0,
          xp: 0,
          totalTokens: 0,
          hoursWatched: 0
        })
        const [newUser] = await db.select().from(users).where(eq(users.id, targetUserId)).limit(1)
        if (newUser) user = newUser
      } catch (e) {}
    }

    if (!user) {
      user = FALLBACK_USER
    }

    if (user) {
      let changed = false
      if (user.totalTokens >= 12480) {
        user.totalTokens -= 12480
        if (user.xp >= 12480) user.xp -= 12480
        if (user.hoursWatched >= 86) user.hoursWatched = Number((user.hoursWatched - 86).toFixed(1))
        changed = true
      }
      if (user.currentStreak === 7 && user.longestStreak === 23) {
        user.currentStreak = 1
        user.longestStreak = 1
        changed = true
      }
      if (changed) {
        try {
          await db.update(users).set({ totalTokens: user.totalTokens, xp: user.xp, hoursWatched: user.hoursWatched, currentStreak: user.currentStreak, longestStreak: user.longestStreak }).where(eq(users.id, user.id))
        } catch {}
      }
    }

    const { rank, rankTier } = getRankFromXp(user.xp)

    return NextResponse.json({
      username: user.username,
      rank,
      rankTier,
      totalTokens: user.totalTokens,
      xp: user.xp,
    })
  } catch (err) {
    console.error('Profile GET error:', err)
    const { rank, rankTier } = getRankFromXp(FALLBACK_USER.xp)
    return NextResponse.json({
      username: FALLBACK_USER.username,
      rank,
      rankTier,
      totalTokens: FALLBACK_USER.totalTokens,
      xp: FALLBACK_USER.xp,
    })
  }
}
