import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';
import { startOfDay, endOfDay, subWeeks, subMonths, subYears, startOfQuarter } from 'date-fns';

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
  // 관리자 권한 확인 (보안 강화)
  const session = await requireAdminAuth(request);
  if (!session) {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // day, week, month, quarter, 3m, 6m, 1y
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    let startDate: Date;
    let endDate: Date;

    if (startParam && endParam) {
      startDate = startOfDay(new Date(startParam));
      endDate = endOfDay(new Date(endParam));
    } else {
      endDate = endOfDay(new Date());
      switch (period) {
        case 'day':
          startDate = startOfDay(new Date());
          break;
        case 'week':
          startDate = subWeeks(startOfDay(new Date()), 1);
          break;
        case 'month':
          startDate = subMonths(startOfDay(new Date()), 1);
          break;
        case 'quarter':
          startDate = startOfQuarter(new Date());
          break;
        case '3m':
          startDate = subMonths(startOfDay(new Date()), 3);
          break;
        case '6m':
          startDate = subMonths(startOfDay(new Date()), 6);
          break;
        case '1y':
          startDate = subYears(startOfDay(new Date()), 1);
          break;
        default:
          startDate = subMonths(startOfDay(new Date()), 1);
      }
    }

    // 1. 현재 기간 데이터 집계
    const adminPathFilter = { path: { not: { startsWith: '/admin' } } };

    const [totalViews, uniqueVisitors, leadCount, consultCount, qnaCount] = await Promise.all([
      prisma.analytics.count({
        where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      }),
      prisma.analytics.groupBy({
        by: ['ip'],
        where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      }).then(res => res.length),
      prisma.lead.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      prisma.consultation.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      prisma.boardQna.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
    ]);

    const totalLeads = leadCount + consultCount + qnaCount;
    const conversionRate = uniqueVisitors > 0 
      ? Number(((totalLeads / uniqueVisitors) * 100).toFixed(1)) 
      : 0;

    // 1-1. 이전 기간 데이터 집계 (증감률 계산용)
    const duration = endDate.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - duration - 1000);
    const prevEndDate = new Date(startDate.getTime() - 1);

    const [prevViews, prevVisitors, prevLeadC, prevConsultC, prevQnaC] = await Promise.all([
      prisma.analytics.count({
        where: { ...adminPathFilter, createdAt: { gte: prevStartDate, lte: prevEndDate } },
      }),
      prisma.analytics.groupBy({
        by: ['ip'],
        where: { ...adminPathFilter, createdAt: { gte: prevStartDate, lte: prevEndDate } },
      }).then(res => res.length),
      prisma.lead.count({
        where: { createdAt: { gte: prevStartDate, lte: prevEndDate } },
      }),
      prisma.consultation.count({
        where: { createdAt: { gte: prevStartDate, lte: prevEndDate } },
      }),
      prisma.boardQna.count({
        where: { createdAt: { gte: prevStartDate, lte: prevEndDate } },
      }),
    ]);

    const prevLeads = prevLeadC + prevConsultC + prevQnaC;
    const prevConvRate = prevVisitors > 0 ? (prevLeads / prevVisitors) * 100 : 0;

    // 증감률 계산 함수 (백분율)
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

    // 2. 스마트 유입 경로 통계 (분류 및 집계)
    const rawReferrers = await prisma.analytics.findMany({
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      select: { referrer: true },
    });

    const smartReferrerMap: { [key: string]: { name: string; count: number; icon: string; category: string } } = {};
    rawReferrers.forEach(item => {
      const cat = categorizeReferrer(item.referrer);
      if (!smartReferrerMap[cat.name]) {
        smartReferrerMap[cat.name] = { name: cat.name, count: 0, icon: cat.icon, category: cat.category };
      }
      smartReferrerMap[cat.name].count += 1;
    });

    const referrers = Object.values(smartReferrerMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 3. 인기 페이지 통계
    const popularPages = await prisma.analytics.groupBy({
      by: ['path'],
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    });

    // 4. 날짜별 추이 데이터
    const trendData = await prisma.analytics.groupBy({
      by: ['createdAt'],
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      _count: { id: true },
    });

    const processedTrend: { [key: string]: number } = {};
    trendData.forEach(item => {
      const dateStr = item.createdAt.toISOString().split('T')[0];
      processedTrend[dateStr] = (processedTrend[dateStr] || 0) + item._count.id;
    });

    const chartData = Object.entries(processedTrend)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 5. 시간대별 분석 (24시간)
    const hourlyData = await prisma.analytics.findMany({
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      select: { createdAt: true },
    });

    const hourlyBreakdown: { [key: string]: number } = {};
    for (let i = 0; i < 24; i++) {
      hourlyBreakdown[String(i).padStart(2, '0')] = 0;
    }
    hourlyData.forEach(item => {
      const hour = String(item.createdAt.getHours()).padStart(2, '0');
      hourlyBreakdown[hour] = (hourlyBreakdown[hour] || 0) + 1;
    });

    const hourlyChart = Object.entries(hourlyBreakdown)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // 피크 시간대(Peak Hours) 계산 (가장 방문이 많은 상위 2개 시간대)
    const sortedHours = [...hourlyChart].sort((a, b) => b.count - a.count);
    const peakHours = sortedHours.slice(0, 2).map(h => h.hour);

    // 6. 디바이스/브라우저 분석 (userAgent)
    const deviceAnalytics = await prisma.analytics.findMany({
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      select: { userAgent: true },
    });

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

    deviceAnalytics.forEach(item => {
      const device = parseDevice(item.userAgent);
      const browser = parseBrowser(item.userAgent);
      deviceDistribution[device] = (deviceDistribution[device] || 0) + 1;
      browserDistribution[browser] = (browserDistribution[browser] || 0) + 1;
    });

    const totalLogs = deviceAnalytics.length || 1;

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

    // 7. 요일별 분석
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayAnalytics: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    trendData.forEach(item => {
      const day = item.createdAt.getDay();
      dayAnalytics[day] = (dayAnalytics[day] || 0) + item._count.id;
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
      },
      referrers,
      popularPages,
      chartData,
      hourlyChart,
      deviceChart,
      browserChart,
      dayChart,
      adminName: session.name || '김형근 대표 법무사',
    });
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error);
    return NextResponse.json({ error: '통계 데이터를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
