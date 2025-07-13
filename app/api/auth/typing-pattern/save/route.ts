import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const token = req.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyJWT(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { pattern, text, type = 'manual' } = body

    // Validate required fields
    if (!pattern || !text) {
      return NextResponse.json(
        { error: 'Pattern and text are required' },
        { status: 400 }
      )
    }

    // Save pattern to database
    const savedPattern = await prisma.typingPattern.create({
      data: {
        userId: decoded.userId,
        pattern: JSON.stringify(pattern), // Store as JSON string
        quality: pattern.quality || 0.5,
        type: type // 'manual' or 'typingdna'
      }
    })

    // Update user to indicate they have a typing pattern
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { hasTypingPattern: true }
    })

    return NextResponse.json(
      { 
        message: 'Typing pattern saved successfully',
        hasTypingPattern: true,
        patternId: savedPattern.id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Save typing pattern error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 