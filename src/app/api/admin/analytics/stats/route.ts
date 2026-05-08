import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays, startOfDay, endOfDay, subWeeks, subMonths, subYears, startOfMonth, startOfQuarter } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'day'; // day, week, month, quarter, 3m, 6m, 1y
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
          startDate = startOfDay(new Date());
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
    const prevStartDate = new Date(startDate.getTime() - duration - 1000); // 1초 간격 보정
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

    // 2. 유입 경로 통계
    const referrers = await prisma.analytics.groupBy({
      by: ['referrer'],
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      _count: { referrer: true },
      orderBy: { _count: { referrer: 'desc' } },
      take: 10,
    });

    // 3. 인기 페이지 통계
    const popularPages = await prisma.analytics.groupBy({
      by: ['path'],
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    });

    // 4. 추이 데이터 (날짜별 방문자 수)
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

    // 5. 시간대별 분석 (hourly breakdown)
    const hourlyData = await prisma.analytics.findMany({
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      select: { createdAt: true },
    });

    const hourlyBreakdown: { [key: string]: number } = {};
    hourlyData.forEach(item => {
      const hour = String(item.createdAt.getHours()).padStart(2, '0');
      hourlyBreakdown[hour] = (hourlyBreakdown[hour] || 0) + 1;
    });

    const hourlyChart = Object.entries(hourlyBreakdown)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // 6. 디바이스/브라우저 분석 (userAgent 파싱)
    const deviceAnalytics = await prisma.analytics.findMany({
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      select: { userAgent: true },
    });

    const parseDevice = (userAgent: string | null) => {
      if (!userAgent) return 'Unknown';
      const ua = userAgent.toLowerCase();
      if (/mobile|android|iphone|ipad|windows phone/.test(ua)) return 'Mobile';
      if (/tablet|ipad|kindle/.test(ua)) return 'Tablet';
      return 'Desktop';
    };

    const parseBrowser = (userAgent: string | null) => {
      if (!userAgent) return 'Unknown';
      const ua = userAgent;
      if (/edg/i.test(ua)) return 'Edge';
      if (/chrome/i.test(ua) && !/edg/i.test(ua)) return 'Chrome';
      if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
      if (/firefox/i.test(ua)) return 'Firefox';
      if (/trident/i.test(ua)) return 'IE';
      return 'Other';
    };

    const deviceDistribution: { [key: string]: number } = {};
    const browserDistribution: { [key: string]: number } = {};

    deviceAnalytics.forEach(item => {
      const device = parseDevice(item.userAgent);
      const browser = parseBrowser(item.userAgent);
      deviceDistribution[device] = (deviceDistribution[device] || 0) + 1;
      browserDistribution[browser] = (browserDistribution[browser] || 0) + 1;
    });

    const deviceChart = Object.entries(deviceDistribution)
      .map(([device, count]) => ({ 
        device, 
        count, 
        percentage: Number((count / deviceAnalytics.length * 100).toFixed(1)) 
      }))
      .sort((a, b) => b.count - a.count);

    const browserChart = Object.entries(browserDistribution)
      .map(([browser, count]) => ({ 
        browser, 
        count, 
        percentage: Number((count / deviceAnalytics.length * 100).toFixed(1)) 
      }))
      .sort((a, b) => b.count - a.count);

    // 7. 페이지별 성과 상세 분석 (상단 20개)
    const pagePerformance = await prisma.analytics.groupBy({
      by: ['path'],
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 20,
    });

    const leads = await prisma.lead.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { source: true },
    });

    const consultations = await prisma.consultation.findMany({
      where: { createdAt: { gte: startDate, lte: endDate } },
      select: { id: true },
    });

    const pageWithLeads = pagePerformance.map(page => {
      const pageLeads = leads.filter(l => l.source === page.path).length;
      const convRate = page._count.path > 0 
        ? Number((pageLeads / page._count.path * 100).toFixed(1)) 
        : 0;
      return {
        path: page.path,
        views: page._count.path,
        leads: pageLeads,
        conversionRate: convRate,
      };
    });

    // 8. 리드 소스 귀속 분석 (상담/신청별 유입처)
    const referrerLeads = await prisma.analytics.groupBy({
      by: ['referrer'],
      where: { ...adminPathFilter, createdAt: { gte: startDate, lte: endDate } },
      _count: { referrer: true },
      orderBy: { _count: { referrer: 'desc' } },
      take: 10,
    });

    const leadsByReferrer = referrerLeads.map(ref => {
      const refLeads = leads.filter(l => l.source === ref.referrer).length;
      const convRate = ref._count.referrer > 0 
        ? Number((refLeads / ref._count.referrer * 100).toFixed(1)) 
        : 0;
      return {
        referrer: ref.referrer || 'Direct',
        views: ref._count.referrer,
        leads: refLeads,
        conversionRate: convRate,
      };
    });

    // 9. 요일별 분석
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayAnalytics: { [key: number]: number } = {};

    trendData.forEach(item => {
      const day = item.createdAt.getDay();
      dayAnalytics[day] = (dayAnalytics[day] || 0) + item._count.id;
    });

    const dayChart = dayNames.map((name, idx) => ({
      day: name,
      count: dayAnalytics[idx] || 0,
    }));

    return NextResponse.json({
      summary: {
        totalViews,
        uniqueVisitors,
        leadCount: totalLeads,
        conversionRate,
        trends
      },
      referrers,
      popularPages,
      chartData,
      // ===== Advanced Analytics =====
      hourlyChart,
      deviceChart,
      browserChart,
      dayChart,
      pageWithLeads,
      leadsByReferrer,
    });
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics stats' }, { status: 500 });
  }
}
