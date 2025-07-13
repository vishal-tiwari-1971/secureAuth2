import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // Get authentication token
    const token = req.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify JWT to get user ID
    const payload = verifyJWT(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { data, page, sessionId } = body

    // Validate data array
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'Invalid data array' }, { status: 400 })
    }

    console.log('Received cursor data:', data.length, 'positions')
    console.log('First position:', data[0])
    console.log('Last position:', data[data.length - 1])

    // Store all cursor data as a single record with JSON array
    const cursorData = await prisma.cursorData.create({
      data: {
        userId: payload.userId,
        x: data[0].x, // Use first cursor position for x,y
        y: data[0].y,
        timestamp: new Date(),
        sessionId: sessionId || null,
        page: page || 'dashboard',
        action: 'batch', // Indicates this is a batch of cursor movements
        cursorArray: data, // Store all cursor positions as JSON array
      }
    })

    console.log(`Stored batch of ${data.length} cursor events in single record with ID: ${cursorData.id}`)
    console.log('Cursor array stored:', JSON.stringify(data.slice(0, 3), null, 2)) // Show first 3 positions

    return NextResponse.json({ 
      success: true, 
      count: data.length,
      message: `Stored ${data.length} cursor events as batch successfully`,
      recordId: cursorData.id
    })

  } catch (error) {
    console.error('Cursor tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to store cursor data' },
      { status: 500 }
    )
  }
} 