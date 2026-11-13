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

    // 4. 검색엔진 크롤러 / 광고 심사 봇 / 스캐너 자동 제외 (한국 포털 봇 및 구글 크롤러 IP 대역 포함)
    const BOT_REGEX = /bot|crawler|spider|googlebot|bingbot|yandex|naverbot|yeti|daumoa|daum|kakaotalk-scrap|facebookexternalhit|facebot|slackbot|telegrambot|discordbot|applebot|petalbot|semrush|ahrefs|mj12bot|dotbot|gptbot|claudebot|perplexity|bytespider|headlesschrome|headless|phantomjs|python|axios|curl|wget|lighthouse|mediapartners|adsbot|ads-naver|dataprovider|googleother|google-inspectiontool|google-safety|apis-google|storebot-google/i;
    const BOT_IP_REGEX = /^(66\.249\.|192\.178\.)/;
    if ((userAgent && BOT_REGEX.test(userAgent)) || (clientIp && BOT_IP_REGEX.test(clientIp))) {
      return NextResponse.json({ success: true, message: 'Bot/crawler visit ignored' });
    }

    // 5. 관리자 URL 및 레거시 스캐너(404) 경로 필터링
    const cleanPath = (path.split('?')[0] || '/').trim().replace(/\/+$/, '') || '/';
    const LEGACY_SCANNER_PATHS = new Set([
      '/index', '/admln', '/frequently', '/inquiry', '/successful_case',
      '/intro-2', '/bank-advan', '/rivive-docu', '/queanw', '/about', '/robots.txt',
    ]);
    if (cleanPath.startsWith('/admin') || LEGACY_SCANNER_PATHS.has(cleanPath)) {
      return NextResponse.json({ success: true, message: 'Ignored route' });
    }

    // 6. 동일 IP에서 5분 이내 동일 페이지 연속 새로고침/중복 호출 방지
    if (clientIp && clientIp !== 'unknown') {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentLogs = await prisma.analytics.findMany({
        where: {
          ip: clientIp,
          createdAt: { gte: fiveMinutesAgo },
        },
        select: { path: true },
        take: 10,
      });
      const isDuplicate = recentLogs.some((log) => {
        const loggedClean = (log.path.split('?')[0] || '/').trim().replace(/\/+$/, '') || '/';
        return loggedClean === cleanPath;
      });
      if (isDuplicate) {
        return NextResponse.json({ success: true, message: 'Duplicate rapid visit ignored' });
      }
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
