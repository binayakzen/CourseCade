import { NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { courses, userCourses } from '@/db/schema'
import { FALLBACK_COURSES } from '@/server/db/mock-data'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    let course: any = null

    try {
      const [dbCourse] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, id))
        .limit(1)
      course = dbCourse
    } catch (dbErr) {
      // DB unavailable
    }

    if (!course) {
      course = FALLBACK_COURSES.find((c) => c.id === id) || FALLBACK_COURSES[0]
    }

    let lastPlayheadTime = 0
    let maxPlayheadTime = 0

    try {
      let userId: string | null = null
      try {
        const authData = await auth()
        userId = authData.userId
      } catch (e) {}
      const targetUserId = userId || 'user_1'

      const [uc] = await db
        .select()
        .from(userCourses)
        .where(and(eq(userCourses.userId, targetUserId), eq(userCourses.courseId, id)))
        .limit(1)

      if (uc) {
        lastPlayheadTime = uc.lastPlayheadTime || 0
        maxPlayheadTime = uc.maxPlayheadTime || 0
      }
    } catch (e) {}

    return NextResponse.json({ ...course, lastPlayheadTime, maxPlayheadTime })
  } catch (err) {
    console.error('Single Course GET error:', err)
    return NextResponse.json(FALLBACK_COURSES[0])
  }
}
