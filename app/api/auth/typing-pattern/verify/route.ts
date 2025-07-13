import { NextRequest, NextResponse } from 'next/server'
import { typingDNAService } from '@/lib/typingdna'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerId, pattern, quality, text } = body

    // Validate required fields
    if (!customerId || !pattern || !text) {
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has typing patterns
    const hasPattern = await typingDNAService.hasTypingPattern(user.id)
    if (!hasPattern) {
      return NextResponse.json(
        { error: 'No typing pattern found for this user' },
        { status: 404 }
      )
    }

    // Verify typing pattern
    const result = await typingDNAService.verifyPattern(user.id, {
      pattern,
      quality: quality || 0.5,
      text
    })

    return NextResponse.json({
      success: result.success,
      score: result.score,
      confidence: result.confidence,
      message: result.message,
      userId: user.id
    })

  } catch (error) {
    console.error('Verify typing pattern error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 