import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { manualTypingPatternService } from '@/lib/manual-typing-pattern'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerId, pattern, text } = body

    console.log('=== TYPING PATTERN VERIFICATION DEBUG ===')
    console.log('Customer ID:', customerId)
    console.log('Pattern received:', pattern)
    console.log('Text received:', text)

    // Validate required fields
    if (!customerId || !pattern || !text) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'Customer ID, pattern, and text are required' },
        { status: 400 }
      )
    }

    // Find user by customer ID
    const user = await prisma.user.findUnique({
      where: { customerId }
    })

    if (!user) {
      console.log('User not found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('User found:', user.id)

    // Check if user has typing patterns (using raw query to avoid Prisma client issues)
    const patterns = await prisma.$queryRaw`
      SELECT * FROM typing_patterns 
      WHERE user_id = ${user.id} 
      ORDER BY created_at DESC 
      LIMIT 1
    `

    console.log('Patterns found:', patterns)

    if (!patterns || (patterns as any[]).length === 0) {
      console.log('No patterns found for user')
      return NextResponse.json(
        { error: 'No typing pattern found for this user' },
        { status: 404 }
      )
    }

    const storedPatternData = (patterns as any[])[0]
    console.log('Stored pattern data:', storedPatternData)

    try {
      const storedPattern = JSON.parse(storedPatternData.pattern)
      console.log('Parsed stored pattern:', storedPattern)

      // Parse the incoming pattern
      const incomingPatternData = JSON.parse(pattern)
      console.log('Incoming pattern data:', incomingPatternData)

      // Create new pattern from verification attempt
      const newPattern = manualTypingPatternService.generatePattern(
        incomingPatternData.keystrokes,
        text
      )
      console.log('Generated new pattern:', newPattern)

      // Compare patterns
      const verificationResult = manualTypingPatternService.comparePatterns(
        storedPattern,
        newPattern
      )
      console.log('Verification result:', verificationResult)

      return NextResponse.json({
        success: verificationResult.isMatch,
        score: verificationResult.score,
        confidence: verificationResult.confidence,
        message: verificationResult.message,
        userId: user.id,
        debug: {
          storedPatternLength: storedPattern.keystrokes?.length,
          newPatternLength: newPattern.keystrokes?.length,
          storedText: storedPattern.text,
          newText: newPattern.text
        }
      })

    } catch (parseError) {
      console.error('Error parsing patterns:', parseError)
      return NextResponse.json(
        { error: 'Error parsing typing patterns' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Manual verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 