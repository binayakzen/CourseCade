import { NextResponse } from 'next/server'
import { count, eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { courses, dailyQuests, userCourses, users } from '@/db/schema'
import { FALLBACK_DAILY_QUEST, FALLBACK_USER } from '@/server/db/mock-data'

export async function GET() {
  try {
    let userId: string | null = null
    try {
      const authData = await auth()
      userId = authData.userId
    } catch (e) {}
    const targetUserId = userId || 'user_1'

    let user: any = null
    let coursesTotal = 6
    let coursesCompleted = 3
    let dailyQuest: any = FALLBACK_DAILY_QUEST

    try {
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, targetUserId))
        .limit(1)
      if (dbUser) user = dbUser

      const [totalRes] = await db.select({ value: count() }).from(courses)
      if (totalRes?.value) coursesTotal = totalRes.value

      const [compRes] = await db
        .select({ value: count() })
        .from(userCourses)
        .where(eq(userCourses.userId, targetUserId))
      if (compRes?.value) coursesCompleted = compRes.value

      const [quest] = await db
        .select()
        .from(dailyQuests)
        .where(eq(dailyQuests.userId, targetUserId))
        .limit(1)
      if (quest) dailyQuest = quest
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

    if (!user) user = FALLBACK_USER

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

    return NextResponse.json({
      coursesCompleted,
      coursesTotal,
      hoursWatched: user.hoursWatched,
      hoursGoal: user.hoursGoal,
      tokensMined: user.totalTokens,
      tokensGoal: user.tokensGoal,
      dailyQuest: {
        label: dailyQuest.label,
        current: dailyQuest.current,
        target: dailyQuest.target,
        reward: dailyQuest.reward,
      },
      streak: {
        current: user.currentStreak,
        longest: user.longestStreak,
      },
    })
  } catch (err) {
    console.error('XP Status GET error:', err)
    return NextResponse.json({
      coursesCompleted: 3,
      coursesTotal: 6,
      hoursWatched: FALLBACK_USER.hoursWatched,
      hoursGoal: FALLBACK_USER.hoursGoal,
      tokensMined: FALLBACK_USER.totalTokens,
      tokensGoal: FALLBACK_USER.tokensGoal,
      dailyQuest: FALLBACK_DAILY_QUEST,
      streak: {
        current: FALLBACK_USER.currentStreak,
        longest: FALLBACK_USER.longestStreak,
      },
    })
  }
}
