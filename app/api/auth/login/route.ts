import { NextResponse } from 'next/server'
import { FALLBACK_USER } from '@/server/db/mock-data'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    // Mock validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Return successful login response
    return NextResponse.json({
      success: true,
      user: {
        id: FALLBACK_USER.id,
        username: email.split('@')[0] || FALLBACK_USER.username,
        email: email,
        xp: FALLBACK_USER.xp,
        totalTokens: FALLBACK_USER.totalTokens,
      },
      message: 'Successfully logged in!',
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
