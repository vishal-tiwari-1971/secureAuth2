import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

function isValidUpiId(upiId: string) {
  // Simple UPI ID validation: username@bank
  return /^[\w.-]+@[\w.-]+$/.test(upiId);
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const user = verifyJWT(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Parse request body
    const { amount, upiId, device, lat, lng, category } = await req.json();
    if (!amount || !upiId || !category) {
      return NextResponse.json({ error: 'Amount, UPI ID, and category are required' }, { status: 400 });
    }
    if (!isValidUpiId(upiId)) {
      return NextResponse.json({ error: 'Invalid UPI ID format' }, { status: 400 });
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    // Validate category
    const validCategories = [
      'Food & Dining',
      'Shopping',
      'Transportation',
      'Entertainment',
      'Bills',
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Get IP address
    let ip = req.headers.get('x-forwarded-for') || '';
    if (ip === '::1' || ip === '127.0.0.1') ip = '';

    // Lookup location if lat/lng are provided
    let location = 'Unknown';
    if (lat != null && lng != null) {
      try {
        const nominatimRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`, {
          headers: { 'User-Agent': 'CanaraSuraksha/1.0' }
        });
        const nominatim = await nominatimRes.json();
        if (nominatim && nominatim.address) {
          const city = nominatim.address.city || nominatim.address.town || nominatim.address.village || nominatim.address.hamlet || nominatim.address.county || '';
          const country = nominatim.address.country || '';
          location = city && country ? `${city}, ${country}` : country || city || 'Unknown';
        }
      } catch (e) {
        // fallback to IP-based below
      }
    }
    // If still unknown, fallback to IP-based lookup
    if (location === 'Unknown' && ip) {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geo = await geoRes.json();
        if (geo && geo.city && geo.country) {
          location = `${geo.city}, ${geo.country}`;
        }
      } catch (e) {
        // fallback to 'Unknown'
      }
    }

    // Simulate transaction status
    const status = 'completed';

    // Store transaction in DB
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.userId,
        customerId: user.customerId,
        type: 'transfer',
        amount: Number(amount),
        description: `Sent to ${upiId}`,
        recipientId: upiId,
        status,
        ip,
        location,
        device: device || 'Unknown Device',
        lat: lat ?? null,
        lng: lng ?? null,
        category, // <-- add category
      },
    });

    // Create a notification for the user
    await prisma.notification.create({
      data: {
        userId: user.userId,
        type: 'success',
        message: `Transaction of ₹${amount} to ${upiId} completed successfully.`,
        read: false,
      }
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const user = verifyJWT(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Fetch transactions for this customerId, include category
    const transactions = await prisma.transaction.findMany({
      where: { customerId: user.customerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        customerId: true,
        type: true,
        amount: true,
        description: true,
        recipientId: true,
        status: true,
        ip: true,
        location: true,
        device: true,
        lat: true,
        lng: true,
        category: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Fetch transactions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 