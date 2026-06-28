import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, username, password } = body
    const identifier = email || username

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Username or Email and password are required' },
        { status: 400 }
      )
    }

    const cleanUsername = identifier.includes('@') ? identifier.split('@')[0] : identifier

    return NextResponse.json({
      success: true,
      user: {
        id: 'user_' + cleanUsername,
        username: cleanUsername,
        email: identifier.includes('@') ? identifier : `${cleanUsername}@coursecade.com`,
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
