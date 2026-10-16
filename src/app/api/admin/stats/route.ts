import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// GET /api/admin/stats - 대시보드 통계
export async function GET(request: Request) {
  const session = await requireAdminAuth();
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    // 한국 시간(KST, UTC+9) 기준 오늘 00:00:00 계산
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);
    const todayKstStr = kstNow.toISOString().split('T')[0];
    const todayStartUtc = new Date(new Date(`${todayKstStr}T00:00:00+09:00`).toISOString());

    // 현재 접속한 관리자의 IP 추출
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const currentAdminIp = rawIp.split(',')[0].trim();
    const excludedIps = ['127.0.0.1', '::1'];
    if (currentAdminIp) excludedIps.push(currentAdminIp);

    const adminVisitFilter = {
      path: { not: { startsWith: '/admin' } },
      ...(excludedIps.length > 0 ? { ip: { notIn: excludedIps } } : {}),
    };

    const [
      totalPosts,
      rehabPosts,
      bankruptcyPosts,
      successStoryPosts,
      totalLeads,
      pendingLeads,
      todayLeads,
      totalConsultations,
      pendingConsultations,
      todayConsultations,
      totalBoardQna,
      pendingBoardQna,
      todayBoardQna,
      totalReviews,
      todayVisits,
      recentLeads,
      recentConsultations,
      recentBoardQna,
    ] = await Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { category: 'REHAB', published: true } }),
      prisma.post.count({ where: { category: 'BANKRUPTCY', published: true } }),
      prisma.post.count({ where: { category: 'SUCCESS_STORY', published: true } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'PENDING' } }),
      prisma.lead.count({ where: { createdAt: { gte: todayStartUtc } } }),
      prisma.consultation.count(),
      prisma.consultation.count({ where: { status: 'PENDING' } }),
      prisma.consultation.count({ where: { createdAt: { gte: todayStartUtc } } }),
      prisma.boardQna.count(),
      prisma.boardQna.count({ where: { status: 'PENDING' } }),
      prisma.boardQna.count({ where: { createdAt: { gte: todayStartUtc } } }),
      prisma.review.count({ where: { isPublic: true } }),
      prisma.analytics.count({ where: { ...adminVisitFilter, createdAt: { gte: todayStartUtc } } }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { 
          id: true, name: true, phone: true, debtAmount: true, 
          preferredType: true, content: true, status: true, 
          createdAt: true, location: true, extraInfo: true, source: true 
        },
      }),
      prisma.consultation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { 
          id: true, name: true, phone: true, type: true, 
          category: true, visitDate: true, visitTime: true, 
          content: true, status: true, createdAt: true, location: true 
        },
      }),
      prisma.boardQna.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: { 
          id: true, author: true, title: true, content: true, 
          status: true, createdAt: true, replyContent: true, isSecret: true 
        },
      }),
    ]);

    const totalPending = pendingLeads + pendingConsultations + pendingBoardQna;

    return NextResponse.json({
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
      },
      summary: {
        totalPending,
        todayTotalInquiries: todayLeads + todayConsultations + todayBoardQna,
      },
      recent: { 
        leads: recentLeads, 
        consultations: recentConsultations, 
        boardQna: recentBoardQna 
      },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: '통계를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
