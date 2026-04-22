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
    const [totalViews, uniqueVisitors, leadCount, consultCount, qnaCount] = await Promise.all([
      prisma.analytics.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      prisma.analytics.groupBy({
        by: ['ip'],
        where: { createdAt: { gte: startDate, lte: endDate } },
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
        where: { createdAt: { gte: prevStartDate, lte: prevEndDate } },
      }),
      prisma.analytics.groupBy({
        by: ['ip'],
        where: { createdAt: { gte: prevStartDate, lte: prevEndDate } },
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
      where: { createdAt: { gte: startDate, lte: endDate } },
      _count: { referrer: true },
      orderBy: { _count: { referrer: 'desc' } },
      take: 10,
    });

    // 3. 인기 페이지 통계
    const popularPages = await prisma.analytics.groupBy({
      by: ['path'],
      where: { createdAt: { gte: startDate, lte: endDate } },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    });

    // 4. 추이 데이터 (날짜별 방문자 수)
    const trendData = await prisma.analytics.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate, lte: endDate } },
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
    });
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics stats' }, { status: 500 });
  }
}
