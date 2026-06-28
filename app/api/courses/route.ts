import { NextResponse } from 'next/server'
import { db } from '@/db'
import { courses } from '@/db/schema'
import { FALLBACK_COURSES } from '@/server/db/mock-data'

export async function GET() {
  try {
    let allCourses: any[] = []
    try {
      allCourses = await db.select().from(courses)
    } catch (dbErr) {
      // DB connection failed or sleeping, fallback
    }

    if (!allCourses || allCourses.length === 0) {
      allCourses = FALLBACK_COURSES
    }

    return NextResponse.json(allCourses)
  } catch (err) {
    console.error('Courses GET error:', err)
    return NextResponse.json(FALLBACK_COURSES)
  }
}
