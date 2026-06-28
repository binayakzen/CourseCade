import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { courses, userCourses, users } from '@/db/schema'
import { awardTokensToUser, FALLBACK_COURSES } from '@/server/db/mock-data'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params
    const body = await request.json()
    const hoursWatched = Number(body.hoursWatched) || 0.1

    let userId: string | null = null
    try {
      const authData = await auth()
      userId = authData.userId
    } catch (e) {}
    const targetUserId = userId || 'user_1'

    const course = FALLBACK_COURSES.find((c) => c.id === courseId) || FALLBACK_COURSES[0]
    const earnedTokens = Math.round(hoursWatched * 100 * course.multiplier)

    const updatedUser = awardTokensToUser(earnedTokens, hoursWatched)

    try {
      const [user] = await db.select().from(users).where(eq(users.id, targetUserId)).limit(1)
      if (user) {
        let currentTokens = user.totalTokens
        let currentXp = user.xp
        let currentHours = user.hoursWatched
        if (currentTokens >= 12480) {
          currentTokens -= 12480
          if (currentXp >= 12480) currentXp -= 12480
          if (currentHours >= 86) currentHours = Number((currentHours - 86).toFixed(1))
        }
        await db
          .update(users)
          .set({
            totalTokens: currentTokens + earnedTokens,
            xp: currentXp + earnedTokens,
            hoursWatched: Number((currentHours + hoursWatched).toFixed(4)),
          })
          .where(eq(users.id, targetUserId))
      }
    } catch (dbErr) {
      // DB offline or sleeping
    }

    return NextResponse.json({
      success: true,
      earnedTokens,
      newTotalTokens: updatedUser.totalTokens,
      newXp: updatedUser.xp,
      newHoursWatched: updatedUser.hoursWatched,
    })
  } catch (err) {
    console.error('Progress POST error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
