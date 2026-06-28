import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, email, password } = body
    const identifier = email || username

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Username and password are required' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: 'new_user_' + Date.now(),
        username: username || email.split('@')[0],
        email: email,
        xp: 0,
        totalTokens: 1000,
        hoursWatched: 0,
      },
      message: 'Account created successfully! 1,000 free tokens granted.',
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'An error occurred during account creation' },
      { status: 500 }
    )
  }
}
