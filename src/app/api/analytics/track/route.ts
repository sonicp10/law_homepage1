import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const analyticsSchema = z.object({
  path: z.string().min(1),
  referrer: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = analyticsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: '유효하지 않은 요청입니다.' }, { status: 400 });
    }

    const { path, referrer, userAgent } = validation.data;
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const ip = rawIp.split(',')[0].trim();

    await prisma.analytics.create({
      data: {
        path,
        referrer: referrer || null,
        userAgent: userAgent || null,
        ip: ip || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: '방문 기록 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}


