import { NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users, userCourses } from '@/db/schema'
import { awardTokensToUser, FALLBACK_COURSES } from '@/server/db/mock-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId, currentPlayheadTime = 0, prevPlayheadTime = 0, maxPlayheadTime = 0, focusStatus, attentionScore = 1.0 } = body

    const isActive = focusStatus === 'active'
    const isPaused = focusStatus === 'paused'
    const playheadDelta = currentPlayheadTime - prevPlayheadTime

    let tokensAwarded = 0
    let telemetryStatus = 'Anti-Cheat Verified [Focus & Playback Active]'
    let monitoringLog = `Edge telemetry sync verified at playhead ${currentPlayheadTime}s.`
    let currentTotalTokens = 0

    // Rule 1: Video Pause Halts Tokens
    if (isPaused) {
      tokensAwarded = 0
      telemetryStatus = 'Anti-Cheat Blocked [Video Playback Paused]'
      monitoringLog = 'Edge engine blocked token credit because video playback is paused (+0 Tokens).'
    }
    // Rule 2: Tab Switch or Low Attention Halts Tokens
    else if (!isActive || attentionScore <= 0.05) {
      tokensAwarded = 0
      telemetryStatus = 'Anti-Cheat Blocked [Tab Switch or Inactive]'
      monitoringLog = '🚨 Edge Anti-Cheat detected tab switch or 0% attention! Token mining suspended.'
    }
    // Rule 3: Skip Detection Threshold (> 120s jump forward or backward, ignoring initial load where prevPlayheadTime === 0)
    else if (prevPlayheadTime > 0 && Math.abs(playheadDelta) > 120) {
      tokensAwarded = 0
      telemetryStatus = '🚨 Anti-Cheat Blocked [Video Skip Detected]'
      monitoringLog = `🚨 Anomaly detected: Playhead jumped ${playheadDelta > 0 ? '+' : ''}${Math.round(playheadDelta)}s (exceeds 120s threshold). 0 tokens awarded.`
    }
    // Valid Active Mining
    else {
      const course = FALLBACK_COURSES.find((c) => c.id === videoId)
      const multiplier = course ? course.multiplier : 1.5
      tokensAwarded = Math.round(15 * multiplier * Math.max(0, Math.min(1.0, attentionScore)))

      try {
        let userId: string | null = null
        try {
          const authData = await auth()
          userId = authData.userId
        } catch (e) {}
        const targetUserId = userId || 'user_1'

        // Check user_courses for exact playhead timestamps & anti-cheat high-water mark
        const [uc] = await db
          .select()
          .from(userCourses)
          .where(and(eq(userCourses.userId, targetUserId), eq(userCourses.courseId, videoId)))
          .limit(1)

        const existingMax = uc ? (uc.maxPlayheadTime || 0) : 0
        let newMax = Math.max(existingMax, Math.round(currentPlayheadTime), Math.round(maxPlayheadTime))

        const prevPlayhead = payload.prevPlayheadTime || 0
        const isSkipping = focusStatus === 'suspended' || (currentPlayheadTime - prevPlayhead > 15 && currentPlayheadTime > existingMax + 15)

        if (isSkipping) {
          newMax = existingMax
          tokensAwarded = 0
          telemetryStatus = 'Anti-Cheat Suspended [Rapid/Long Skipping Malpractice]'
          monitoringLog = `🚨 Anti-Cheat Suspended: Rapid or long skipping detected! Seek back to verified progress (${existingMax}s) to resume mining.`
        } else if (currentPlayheadTime > 0 && currentPlayheadTime <= existingMax && existingMax > 5) {
          tokensAwarded = 0
          telemetryStatus = 'Anti-Cheat Blocked [Re-watching Credited Playback]'
          monitoringLog = `🛡️ Edge Anti-Cheat: Playback (${Math.round(currentPlayheadTime)}s) already verified (High-water mark: ${existingMax}s). +0 Tokens.`
        }

        if (uc) {
          await db
            .update(userCourses)
            .set({
              lastPlayheadTime: Math.round(currentPlayheadTime),
              maxPlayheadTime: newMax,
              progressHours: Number((Math.max(uc.progressHours || 0, newMax / 3600)).toFixed(2))
            })
            .where(and(eq(userCourses.userId, targetUserId), eq(userCourses.courseId, videoId)))
        } else if (videoId) {
          await db
            .insert(userCourses)
            .values({
              userId: targetUserId,
              courseId: videoId,
              lastPlayheadTime: Math.round(currentPlayheadTime),
              maxPlayheadTime: newMax,
              progressHours: Number((newMax / 3600).toFixed(2))
            })
        }

        // Attempt database credit if tokens awarded > 0
        if (tokensAwarded > 0) {
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
                totalTokens: currentTokens + tokensAwarded,
                xp: currentXp + tokensAwarded,
                hoursWatched: Number((currentHours + (5 / 3600)).toFixed(4)),
              })
              .where(eq(users.id, targetUserId))
            currentTotalTokens = currentTokens + tokensAwarded
          }
        }
      } catch (dbErr) {
        // Database query failed or demo mode active
      }

      const updatedUser = awardTokensToUser(tokensAwarded, tokensAwarded > 0 ? 5 / 3600 : 0)
      if (!currentTotalTokens) currentTotalTokens = updatedUser.totalTokens
    }

    return NextResponse.json({
      success: true,
      telemetryStatus,
      tokensAwarded,
      currentTotalTokens,
      monitoringLog,
      serverTime: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Heartbeat tracking error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
