import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// 한국 표준시 (KST, UTC+9) 처리 헬퍼
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function toKST(date: Date): Date {
  return new Date(date.getTime() + KST_OFFSET_MS);
}

export function getKSTDateString(date: Date = new Date()): string {
  return toKST(date).toISOString().split('T')[0];
}

export function getKSTStartOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000+09:00`);
}

export function getKSTEndOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999+09:00`);
}

// 검색엔진 크롤러 및 봇 필터링 정규식
const BOT_REGEX = /bot|crawler|spider|googlebot|bingbot|yandex|naverbot|bytespider|headlesschrome|headless|phantomjs|python|axios|curl|wget|lighthouse|mediapartners|adsbot|ads-naver|dataprovider/i;

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_REGEX.test(userAgent);
}

// 유입 출처 스마트 분류 함수
function categorizeReferrer(rawRef: string | null): { name: string; category: string; icon: string } {
  if (!rawRef || rawRef.trim() === '' || rawRef === 'Direct') {
    return { name: '직접 유입 (Direct / 북마크)', category: 'DIRECT', icon: '📌' };
  }

  const lower = rawRef.toLowerCase();

  if (lower.includes('search.naver.com') || lower.includes('m.search.naver.com')) {
    return { name: '네이버 검색 (통합검색)', category: 'SEARCH', icon: '🟢' };
  }
  if (lower.includes('blog.naver.com')) {
    return { name: '네이버 블로그', category: 'BLOG', icon: '🟢' };
  }
  if (lower.includes('cafe.naver.com')) {
    return { name: '네이버 카페', category: 'COMMUNITY', icon: '🟢' };
  }
  if (lower.includes('naver.com')) {
    return { name: '네이버 (기타 서비스)', category: 'PORTAL', icon: '🟢' };
  }
  if (lower.includes('google.co') || lower.includes('google.com')) {
    return { name: '구글 검색 (Google)', category: 'SEARCH', icon: '🔵' };
  }
  if (lower.includes('daum.net') || lower.includes('search.daum.net')) {
    return { name: '다음 검색 (Daum)', category: 'SEARCH', icon: '🟡' };
  }
  if (lower.includes('kakao.com')) {
    return { name: '카카오톡 / 카카오 채널', category: 'SNS', icon: '🟡' };
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return { name: '유튜브 (YouTube)', category: 'VIDEO', icon: '🔴' };
  }
  if (lower.includes('instagram.com')) {
    return { name: '인스타그램 (Instagram)', category: 'SNS', icon: '🟣' };
  }
  if (lower.includes('facebook.com')) {
    return { name: '페이스북 (Facebook)', category: 'SNS', icon: '🔵' };
  }
  if (lower.includes('daangn.com')) {
    return { name: '당근마켓 (Daangn)', category: 'LOCAL', icon: '🟠' };
  }

  try {
    const url = new URL(rawRef.startsWith('http') ? rawRef : `https://${rawRef}`);
    return { name: url.hostname, category: 'REFERRAL', icon: '🌐' };
  } catch {
    return { name: rawRef.slice(0, 30), category: 'REFERRAL', icon: '🌐' };
  }
}

export async function GET(request: Request) {
  // 관리자 권한 확인
  const session = await requireAdminAuth(request);
  if (!session) {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    // 현재 접속한 관리자의 IP 추출
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const currentAdminIp = rawIp.split(',')[0].trim();

    // 관리자 테스트 유입 제외 필터 (관리자 경로 + 관리자 IP)
    const excludedIps = ['127.0.0.1', '::1'];
    if (currentAdminIp) {
      excludedIps.push(currentAdminIp);
    }

    const adminFilter = {
      path: { not: { startsWith: '/admin' } },
      ...(excludedIps.length > 0 ? { ip: { notIn: excludedIps } } : {}),
    };

    let startDate: Date;
    let endDate: Date;

    const todayKstStr = getKSTDateString(new Date());

    if (startParam && endParam) {
      startDate = getKSTStartOfDay(startParam);
      endDate = getKSTEndOfDay(endParam);
    } else {
      endDate = getKSTEndOfDay(todayKstStr);
      switch (period) {
        case 'day': {
          startDate = getKSTStartOfDay(todayKstStr);
          break;
        }
        case 'week': {
          const d = toKST(new Date());
          d.setUTCDate(d.getUTCDate() - 7);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        case 'month': {
          const d = toKST(new Date());
          d.setUTCMonth(d.getUTCMonth() - 1);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        case 'quarter':
        case '3m': {
          const d = toKST(new Date());
          d.setUTCMonth(d.getUTCMonth() - 3);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        case '6m': {
          const d = toKST(new Date());
          d.setUTCMonth(d.getUTCMonth() - 6);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        case '1y': {
          const d = toKST(new Date());
          d.setUTCFullYear(d.getUTCFullYear() - 1);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        default: {
          const d = toKST(new Date());
          d.setUTCMonth(d.getUTCMonth() - 1);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
        }
      }
    }
    // 1-1. 이전 기간 계산용 타임스탬프
    const duration = endDate.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - duration - 1000);
    const prevEndDate = new Date(startDate.getTime() - 1);

    // 1-2. 현재 기간 및 이전 기간 데이터 집계 (단일 병렬 쿼리로 DB 부하 최소화)
    const [currentRawLogs, prevRawLogs, leadCount, consultCount, qnaCount, prevLeadC, prevConsultC, prevQnaC] = await Promise.all([
      prisma.analytics.findMany({
        where: { ...adminFilter, createdAt: { gte: startDate, lte: endDate } },
        select: { id: true, createdAt: true, ip: true, path: true, referrer: true, userAgent: true },
      }),
      prisma.analytics.findMany({
        where: { ...adminFilter, createdAt: { gte: prevStartDate, lte: prevEndDate } },
        select: { id: true, ip: true, userAgent: true },
      }),
      prisma.lead.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      prisma.consultation.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      prisma.boardQna.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      prisma.lead.count({ where: { createdAt: { gte: prevStartDate, lte: prevEndDate } } }),
      prisma.consultation.count({ where: { createdAt: { gte: prevStartDate, lte: prevEndDate } } }),
      prisma.boardQna.count({ where: { createdAt: { gte: prevStartDate, lte: prevEndDate } } }),
    ]);

    // 1-3. 봇/크롤러 허수 트래픽 필터링 (순수 사람 의뢰인 데이터만 정제)
    const currentLogs = currentRawLogs.filter(r => !isBot(r.userAgent));
    const prevLogs = prevRawLogs.filter(r => !isBot(r.userAgent));
    const botVisitsFiltered = currentRawLogs.length - currentLogs.length;

    const totalViews = currentLogs.length;
    const uniqueVisitors = new Set(currentLogs.map(r => r.ip).filter(Boolean)).size;

    const prevViews = prevLogs.length;
    const prevVisitors = new Set(prevLogs.map(r => r.ip).filter(Boolean)).size;

    const totalLeads = leadCount + consultCount + qnaCount;
    const conversionRate = uniqueVisitors > 0 
      ? Number(((totalLeads / uniqueVisitors) * 100).toFixed(1)) 
      : 0;

    const prevLeads = prevLeadC + prevConsultC + prevQnaC;
    const prevConvRate = prevVisitors > 0 ? (prevLeads / prevVisitors) * 100 : 0;

    const calcTrend = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    const trends = {
      viewsTrend: calcTrend(totalViews, prevViews),
      visitorsTrend: calcTrend(uniqueVisitors, prevVisitors),
      leadTrend: calcTrend(totalLeads, prevLeads),
      rateTrend: calcTrend(conversionRate, prevConvRate),
    };

    // 2. 스마트 유입 경로 통계 (순수 사람 기준)
    const smartReferrerMap: { [key: string]: { name: string; count: number; icon: string; category: string } } = {};
    currentLogs.forEach(item => {
      const cat = categorizeReferrer(item.referrer);
      if (!smartReferrerMap[cat.name]) {
        smartReferrerMap[cat.name] = { name: cat.name, count: 0, icon: cat.icon, category: cat.category };
      }
      smartReferrerMap[cat.name].count += 1;
    });

    const referrers = Object.values(smartReferrerMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 3. 인기 페이지 통계 (순수 사람 기준)
    const pageCounts: { [path: string]: number } = {};
    currentLogs.forEach(item => {
      pageCounts[item.path] = (pageCounts[item.path] || 0) + 1;
    });
    const popularPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, _count: { path: count } }))
      .sort((a, b) => b._count.path - a._count.path)
      .slice(0, 10);

    // 4. 날짜별 추이 데이터 (KST 기준)
    const processedTrend: { [key: string]: number } = {};
    currentLogs.forEach(item => {
      const kstTime = toKST(item.createdAt);
      const dateStr = kstTime.toISOString().split('T')[0];
      processedTrend[dateStr] = (processedTrend[dateStr] || 0) + 1;
    });

    const chartData = Object.entries(processedTrend)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 5. 시간대별 분석 (24시간, KST 기준 00:00 ~ 23:00)
    const hourlyBreakdown: { [key: string]: number } = {};
    for (let i = 0; i < 24; i++) {
      hourlyBreakdown[String(i).padStart(2, '0')] = 0;
    }
    currentLogs.forEach(item => {
      const kstTime = toKST(item.createdAt);
      const hour = String(kstTime.getUTCHours()).padStart(2, '0');
      hourlyBreakdown[hour] = (hourlyBreakdown[hour] || 0) + 1;
    });

    const hourlyChart = Object.entries(hourlyBreakdown)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    const sortedHours = [...hourlyChart].sort((a, b) => b.count - a.count);
    const peakHours = sortedHours
      .filter(h => h.count > 0)
      .slice(0, 2)
      .map(h => h.hour);

    // 6. 디바이스/브라우저 분석 (순수 사람 기준)
    const parseDevice = (userAgent: string | null) => {
      if (!userAgent) return '기타 (Unknown)';
      const ua = userAgent.toLowerCase();
      if (/mobile|android|iphone|windows phone/.test(ua)) return '모바일 (Mobile)';
      if (/ipad|tablet|kindle/.test(ua)) return '태블릿 (Tablet)';
      return 'PC 데스크톱 (Desktop)';
    };

    const parseBrowser = (userAgent: string | null) => {
      if (!userAgent) return '기타 (Other)';
      const ua = userAgent;
      if (/kakaotalk/i.test(ua)) return '카카오톡 인앱';
      if (/naver/i.test(ua)) return '네이버 인앱';
      if (/edg/i.test(ua)) return 'Edge';
      if (/chrome/i.test(ua) && !/edg/i.test(ua)) return 'Chrome';
      if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
      if (/firefox/i.test(ua)) return 'Firefox';
      return '기타 브라우저';
    };

    const deviceDistribution: { [key: string]: number } = {};
    const browserDistribution: { [key: string]: number } = {};

    currentLogs.forEach(item => {
      const device = parseDevice(item.userAgent);
      const browser = parseBrowser(item.userAgent);
      deviceDistribution[device] = (deviceDistribution[device] || 0) + 1;
      browserDistribution[browser] = (browserDistribution[browser] || 0) + 1;
    });

    const totalLogs = currentLogs.length || 1;

    const deviceChart = Object.entries(deviceDistribution)
      .map(([device, count]) => ({ 
        device, 
        count, 
        percentage: Number(((count / totalLogs) * 100).toFixed(1)) 
      }))
      .sort((a, b) => b.count - a.count);

    const browserChart = Object.entries(browserDistribution)
      .map(([browser, count]) => ({ 
        browser, 
        count, 
        percentage: Number(((count / totalLogs) * 100).toFixed(1)) 
      }))
      .sort((a, b) => b.count - a.count);

    // 7. 요일별 분석 (KST 기준 요일)
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayAnalytics: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    currentLogs.forEach(item => {
      const kstTime = toKST(item.createdAt);
      const day = kstTime.getUTCDay();
      dayAnalytics[day] = (dayAnalytics[day] || 0) + 1;
    });

    const dayChart = dayNames.map((name, idx) => ({
      day: name,
      count: dayAnalytics[idx] || 0,
    }));

    // 8. 세부 상담 전환 리포트
    const consultationBreakdown = [
      { name: '온라인 자가진단 (Lead)', count: leadCount, percentage: totalLeads > 0 ? Number(((leadCount / totalLeads) * 100).toFixed(1)) : 0, color: '#A67C52' },
      { name: '전화 / 방문 상담 예약', count: consultCount, percentage: totalLeads > 0 ? Number(((consultCount / totalLeads) * 100).toFixed(1)) : 0, color: '#3B82F6' },
      { name: '게시판 1:1 상담 문의', count: qnaCount, percentage: totalLeads > 0 ? Number(((qnaCount / totalLeads) * 100).toFixed(1)) : 0, color: '#10B981' },
    ];

    return NextResponse.json({
      summary: {
        totalViews,
        uniqueVisitors,
        leadCount: totalLeads,
        conversionRate,
        consultationBreakdown,
        trends,
        peakHours,
        botVisitsFiltered,
      },
      referrers,
      popularPages,
      chartData,
      hourlyChart,
      deviceChart,
      browserChart,
      dayChart,
      adminName: session.name || '대표 관리자',
      currentAdminIp: currentAdminIp || '확인됨',
      excludedAdminIps: excludedIps,
    });
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error);
    return NextResponse.json({ error: '통계 데이터를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

// DELETE /api/admin/analytics/stats - 현재 관리자 IP 또는 테스트 방문 로그 영구 정리
export async function DELETE(request: Request) {
  const session = await requireAdminAuth(request);
  if (!session) {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
  }

  try {
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const currentAdminIp = rawIp.split(',')[0].trim();

    const targets: any[] = [
      { path: { startsWith: '/admin' } },
      { ip: '127.0.0.1' },
      { ip: '::1' },
    ];

    if (currentAdminIp) {
      targets.push({ ip: currentAdminIp });
    }

    const deleteResult = await prisma.analytics.deleteMany({
      where: {
        OR: targets,
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      message: `관리자 테스트 방문 로그 ${deleteResult.count}건이 통계 DB에서 완전히 정리되었습니다.`,
    });
  } catch (error) {
    console.error('Failed to cleanup admin test analytics:', error);
    return NextResponse.json({ error: '관리자 테스트 로그 정리에 실패했습니다.' }, { status: 500 });
  }
}
