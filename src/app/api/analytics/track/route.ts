import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

const analyticsSchema = z.object({
  path: z.string().min(1),
  referrer: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    // 1. 관리자 기기 제외 쿠키 체크
    const isExcludedDevice = cookieStore.get('admin_device_excluded')?.value === 'true';
    if (isExcludedDevice) {
      return NextResponse.json({ success: true, message: 'Admin device visit ignored' });
    }

    // 2. 관리자 세션 JWT 검증
    const token = cookieStore.get('admin_session_v1')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.json({ success: true, message: 'Admin session visit ignored' });
      }
    }

    // 3. 최근 관리자 로그인 IP와 일치 여부 체크
    const adminLastIp = cookieStore.get('admin_last_ip')?.value;
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const clientIp = rawIp.split(',')[0].trim();

    if (adminLastIp && clientIp === adminLastIp) {
      return NextResponse.json({ success: true, message: 'Admin IP visit ignored' });
    }

    const body = await request.json();
    const validation = analyticsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: '유효하지 않은 요청입니다.' }, { status: 400 });
    }

    const { path, referrer, userAgent } = validation.data;

    // 4. 관리자 URL 경로 필터링
    if (path.startsWith('/admin')) {
      return NextResponse.json({ success: true, message: 'Admin route ignored' });
    }

    await prisma.analytics.create({
      data: {
        path,
        referrer: referrer || null,
        userAgent: userAgent || null,
        ip: clientIp !== 'unknown' ? clientIp : null,
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
