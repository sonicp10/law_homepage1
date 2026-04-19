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
    const [
      totalPosts,
      rehabPosts,
      bankruptcyPosts,
      totalLeads,
      pendingLeads,
      totalConsultations,
      pendingConsultations,
      totalBoardQna,
      pendingBoardQna,
      totalReviews,
      recentLeads,
      recentConsultations,
      recentBoardQna,
    ] = await Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { category: 'REHAB', published: true } }),
      prisma.post.count({ where: { category: 'BANKRUPTCY', published: true } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'PENDING' } }),
      prisma.consultation.count(),
      prisma.consultation.count({ where: { status: 'PENDING' } }),
      prisma.boardQna.count(),
      prisma.boardQna.count({ where: { status: 'PENDING' } }),
      prisma.review.count({ where: { isPublic: true } }),
      prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, phone: true, preferredType: true, status: true, createdAt: true },
      }),
      prisma.consultation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, phone: true, type: true, category: true, status: true, createdAt: true },
      }),
      prisma.boardQna.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, author: true, title: true, status: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      posts: { total: totalPosts, rehab: rehabPosts, bankruptcy: bankruptcyPosts },
      leads: { total: totalLeads, pending: pendingLeads },
      consultations: { total: totalConsultations, pending: pendingConsultations },
      boardQna: { total: totalBoardQna, pending: pendingBoardQna },
      reviews: { total: totalReviews },
      recent: { leads: recentLeads, consultations: recentConsultations, boardQna: recentBoardQna },
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: '통계를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
