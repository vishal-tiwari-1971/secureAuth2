import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, generateJWT, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerId, password, typingPattern, retryAttempt = 0 } = body

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

    // Verify typing pattern if provided and user has one
    if (typingPattern && typingPattern.pattern && typingPattern.text) {
      try {
        // Use the manual verification endpoint
        const verificationResponse = await fetch(`${req.nextUrl.origin}/api/auth/typing-pattern/verify-manual`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId,
            pattern: typingPattern.pattern,
            text: typingPattern.text
          })
        })

        const verificationResult = await verificationResponse.json()

        if (!verificationResult.success || verificationResult.score < 0.5) {
          console.log('Typing pattern verification failed:', verificationResult)
          
          // Check if user has retry attempts left
          const maxRetries = 3
          const attemptsLeft = maxRetries - (retryAttempt + 1);
          
          console.log('Typing pattern retry debug:', {
            retryAttempt,
            maxRetries,
            attemptsLeft,
            willRetry: attemptsLeft >= 0
          })
          
          if (attemptsLeft >= 0) {
            return NextResponse.json(
              { 
                error: 'Typing pattern verification failed. Please try typing more consistently.',
                retryAttempt: retryAttempt + 1,
                attemptsLeft,
                canRetry: true,
                score: verificationResult.score,
                message: `Score: ${(verificationResult.score * 100).toFixed(1)}%. Try typing more consistently.`
              },
              { status: 401 }
            )
          } else {
            return NextResponse.json(
              { 
                error: 'Typing pattern verification failed after multiple attempts. Please try again later.',
                canRetry: false,
                score: verificationResult.score
              },
              { status: 401 }
            )
          }
        }

        console.log('Typing pattern verification successful:', verificationResult)
      } catch (verificationError) {
        console.error('Verification error:', verificationError)
        // Continue with login even if verification fails
      }
    }

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
          name: user.name
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