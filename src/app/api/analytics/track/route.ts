import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, referrer, userAgent } = body;

    console.log('[Analytics] Tracking visit:', { path, referrer });

    // IP 주소 추출
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!prisma.analytics) {
      throw new Error('Prisma Analytics model is not defined. Please run prisma generate.');
    }

    await prisma.analytics.create({
      data: {
        path,
        referrer,
        userAgent,
        ip: ip.split(',')[0],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    if (error.stack) {
      console.error(error.stack);
    }
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}


