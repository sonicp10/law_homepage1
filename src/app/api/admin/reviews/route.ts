import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// GET /api/admin/reviews - 관리자용 의뢰인 후기 목록 조회 (공개/비공개 전체)
export async function GET(request: Request) {
  const session = await requireAdminAuth(request, 'canManagePosts');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const isPublicParam = searchParams.get('isPublic'); // '' | 'true' | 'false'

    const where: any = {};
    if (isPublicParam === 'true') where.isPublic = true;
    else if (isPublicParam === 'false') where.isPublic = false;

    if (search) {
      where.OR = [
        { author: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        author: true,
        title: true,
        content: true,
        rating: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ reviews, totalCount: reviews.length });
  } catch (error) {
    console.error('Admin Reviews GET Error:', error);
    return NextResponse.json({ error: '후기 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

// POST /api/admin/reviews - 관리자 직접 후기 등록
export async function POST(request: Request) {
  const session = await requireAdminAuth(request, 'canManagePosts');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { author, title, content, rating, isPublic } = body;

    if (!author || !title || !content) {
      return NextResponse.json({ error: '작성자, 제목, 내용은 필수입니다.' }, { status: 400 });
    }

    const created = await prisma.review.create({
      data: {
        author: author.trim(),
        title: title.trim(),
        content: content.trim(),
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        isPublic: isPublic !== undefined ? Boolean(isPublic) : true,
      },
      select: {
        id: true,
        author: true,
        title: true,
        content: true,
        rating: true,
        isPublic: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, review: created });
  } catch (error) {
    console.error('Admin Review POST Error:', error);
    return NextResponse.json({ error: '후기 등록에 실패했습니다.' }, { status: 500 });
  }
}
