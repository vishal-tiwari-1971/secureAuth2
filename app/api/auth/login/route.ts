import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateJWT, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerId, password } = body

    // Validate required fields
    if (!customerId || !password) {
      return NextResponse.json(
        { error: 'Customer ID and password are required' },
        { status: 400 }
      )
    }

    // Validate customer ID format
    if (!/^\d{10}$/.test(customerId)) {
      return NextResponse.json(
        { error: 'Customer ID must be exactly 10 digits' },
        { status: 400 }
      )
    }

    // Authenticate user
    const user = await authenticateUser(customerId, password)

    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      customerId: user.customerId,
      email: user.email
    })

    // Create session in database
    await createSession(user.id, token)

    // Set HTTP-only cookie
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          customerId: user.customerId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      { status: 200 }
    )

    // Set secure cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid customer ID or password')) {
        return NextResponse.json(
          { error: 'Invalid customer ID or password' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 