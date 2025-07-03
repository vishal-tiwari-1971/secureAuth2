import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  console.log('Received cursor data:', data);
  return NextResponse.json({ ok: true, received: Array.isArray(data) ? data.length : 0 });
} 