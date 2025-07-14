import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'TypingDNA service is not implemented or supported in this deployment.' },
    { status: 501 }
  )
} 