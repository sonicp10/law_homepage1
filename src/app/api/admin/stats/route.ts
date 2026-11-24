import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';
import { isBot, deduplicateRapidLogs } from '@/app/api/admin/analytics/stats/route';

// 5초 인메모리 캐시: 대시보드 진입/새로고침 시 불필요한 연속 DB 풀스캔 방지 및 즉각 응답
let cachedStatsData: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 5000;

// GET /api/admin/stats - 대시보드 통계
export async function GET(request: Request) {
  const session = await requireAdminAuth(request);
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  // URL 파라미터로 ?force=true 가 전달되면 캐시 강제 무효화
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get('force') === 'true';

  const nowTime = Date.now();
  if (!forceRefresh && cachedStatsData && (nowTime - cachedStatsData.timestamp < CACHE_TTL_MS)) {
    return NextResponse.json(cachedStatsData.data, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    // 한국 시간(KST, UTC+9) 기준 오늘 00:00:00 계산 및 방문 예약일(visitDate) 범위 설정
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);
    const todayKstStr = kstNow.toISOString().split('T')[0];
    const todayStartUtc = new Date(new Date(`${todayKstStr}T00:00:00+09:00`).toISOString());
    // visitDate는 프론트엔드 날짜 문자열("YYYY-MM-DD")을 new Date()로 저장하므로 UTC 00:00 또는 KST 00:00 모두 포괄하도록 범위 지정
    const visitDayStart = new Date(`${todayKstStr}T00:00:00.000Z`);
    const visitDayEnd = new Date(`${todayKstStr}T23:59:59.999Z`);

    // 현재 접속한 관리자의 IP 추출
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const currentAdminIp = rawIp.split(',')[0].trim();
    const excludedIps = ['127.0.0.1', '::1'];
    if (currentAdminIp) excludedIps.push(currentAdminIp);

    const adminVisitFilter = {
      path: { not: { startsWith: '/admin' } },
      ...(excludedIps.length > 0 ? { ip: { notIn: excludedIps } } : {}),
    };

    // 쿼리 압축: groupBy를 활용하여 DB 커넥션 왕복 횟수를 18회에서 핵심 파이프라인으로 대폭 축소
    const [
      postGroups,
      leadGroups,
      todayLeads,
      consultGroups,
      todayConsultations,
      boardGroups,
      todayBoardQna,
      totalReviews,
      todayRawVisits,
      recentLeads,
      recentConsultations,
      recentBoardQna,
      todayVisitSchedules,
    ] = await Promise.all([
      // 1. 게시글 카테고리별 집계 (REHAB, BANKRUPTCY, SUCCESS_STORY, 전체)
      prisma.post.groupBy({
        by: ['category'],
        where: { published: true },
        _count: { id: true },
      }),
      // 2. 빠른 상담(리드) 상태별 집계
      prisma.lead.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      // 3. 오늘 등록된 리드
      prisma.lead.count({ where: { createdAt: { gte: todayStartUtc } } }),
      // 4. 전화/방문 상담 상태별 집계
      prisma.consultation.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      // 5. 오늘 등록된 상담
      prisma.consultation.count({ where: { createdAt: { gte: todayStartUtc } } }),
      // 6. 게시판 문의 상태별 집계
      prisma.boardQna.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      // 7. 오늘 등록된 게시판 문의
      prisma.boardQna.count({ where: { createdAt: { gte: todayStartUtc } } }),
      // 8. 공개 의뢰인 후기 총합
      prisma.review.count({ where: { isPublic: true } }),
      // 9. 오늘 방문 로그 (최대 1000건 제한으로 대용량 스캔 방지)
      prisma.analytics.findMany({
        where: { ...adminVisitFilter, createdAt: { gte: todayStartUtc } },
        select: { id: true, createdAt: true, ip: true, path: true, userAgent: true },
        take: 1000,
        orderBy: { createdAt: 'desc' },
      }),
      // 10. 최근 빠른 상담 6건
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { 
          id: true, name: true, phone: true, debtAmount: true, 
          preferredType: true, content: true, status: true, 
          createdAt: true, location: true, extraInfo: true, source: true 
        },
      }),
      // 11. 최근 전화/방문 상담 6건
      prisma.consultation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { 
          id: true, name: true, phone: true, type: true, 
          category: true, visitDate: true, visitTime: true, 
          content: true, status: true, createdAt: true, location: true 
        },
      }),
      // 12. 최근 게시판 문의 6건
      prisma.boardQna.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { 
          id: true, author: true, title: true, content: true, 
          status: true, createdAt: true, replyContent: true, isSecret: true 
        },
      }),
      // 13. 오늘 방문 예정된 방문상담 전체 조회 (최근 신청 6건 외에 며칠 전 미리 예약한 오늘 방문 건 누락 방지)
      prisma.consultation.findMany({
        where: {
          type: 'VISIT',
          visitDate: {
            gte: visitDayStart,
            lte: visitDayEnd,
          },
        },
        orderBy: { visitTime: 'asc' },
        select: {
          id: true, name: true, phone: true, type: true,
          category: true, visitDate: true, visitTime: true,
          content: true, status: true, createdAt: true, location: true,
        },
      }),
    ]);

    // 게시글 집계 계산
    let totalPosts = 0;
    let rehabPosts = 0;
    let bankruptcyPosts = 0;
    let successStoryPosts = 0;
    postGroups.forEach((g) => {
      totalPosts += g._count.id;
      if (g.category === 'REHAB') rehabPosts = g._count.id;
      else if (g.category === 'BANKRUPTCY') bankruptcyPosts = g._count.id;
      else if (g.category === 'SUCCESS_STORY') successStoryPosts = g._count.id;
    });

    // 리드 집계 계산
    let totalLeads = 0;
    let pendingLeads = 0;
    leadGroups.forEach((g) => {
      totalLeads += g._count.id;
      if (g.status === 'PENDING') pendingLeads = g._count.id;
    });

    // 상담 집계 계산
    let totalConsultations = 0;
    let pendingConsultations = 0;
    consultGroups.forEach((g) => {
      totalConsultations += g._count.id;
      if (g.status === 'PENDING') pendingConsultations = g._count.id;
    });

    // 게시판 문의 집계 계산
    let totalBoardQna = 0;
    let pendingBoardQna = 0;
    boardGroups.forEach((g) => {
      totalBoardQna += g._count.id;
      if (g.status === 'PENDING') pendingBoardQna = g._count.id;
    });

    const totalPending = pendingLeads + pendingConsultations + pendingBoardQna;

    // 방문 통계 필터링 (봇 제외 + 5분 이내 중복 새로고침 제거)
    const todayHumanLogs = deduplicateRapidLogs(
      todayRawVisits.filter((r) => !isBot(r.userAgent, r.ip, r.path))
    );
    const todayPageViews = todayHumanLogs.length;
    const todayUniqueVisitors = new Set(todayHumanLogs.map((r) => r.ip).filter(Boolean)).size;
    const todayVisits = todayUniqueVisitors;

    const responsePayload = {
      posts: { 
        total: totalPosts, 
        rehab: rehabPosts, 
        bankruptcy: bankruptcyPosts,
        successStory: successStoryPosts,
      },
      leads: { 
        total: totalLeads, 
        pending: pendingLeads,
        today: todayLeads,
      },
      consultations: { 
        total: totalConsultations, 
        pending: pendingConsultations,
        today: todayConsultations,
      },
      boardQna: { 
        total: totalBoardQna, 
        pending: pendingBoardQna,
        today: todayBoardQna,
      },
      reviews: { total: totalReviews },
      analytics: {
        todayVisits,
        todayUniqueVisitors,
        todayPageViews,
      },
      summary: {
        totalPending,
        todayTotalInquiries: todayLeads + todayConsultations + todayBoardQna,
      },
      recent: { 
        leads: recentLeads, 
        consultations: recentConsultations, 
        boardQna: recentBoardQna,
        todayVisitors: todayVisitSchedules,
      },
    };

    // 캐시 저장 (5초)
    cachedStatsData = {
      data: responsePayload,
      timestamp: Date.now(),
    };

    return NextResponse.json(responsePayload, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: '통계를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
