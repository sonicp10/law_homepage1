import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/posts - 법률 칼럼 목록 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category'); // 'REHAB' | 'BANKRUPTCY'
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const skip = (page - 1) * limit;

  try {
    const where: any = { published: true };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          excerpt: true,
          thumbnail: true,
          category: true,
          tags: true,
          author: true,
          readTime: true,
          viewCount: true,
          createdAt: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Posts GET Error:', error);
    return NextResponse.json({ error: '글 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

// POST /api/posts - 관리자 글 작성
export async function POST(request: Request) {
  // 간단한 관리자 인증 (헤더 기반)
  const adminSecret = request.headers.get('x-admin-secret');
  if (adminSecret !== 'lawoffice2024admin') {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, excerpt, category, thumbnail, tags, author, readTime } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: '제목, 본문, 카테고리는 필수입니다.' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.slice(0, 120) + '...',
        category,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
        tags: tags || null,
        author: author || '법무사 김형근',
        readTime: readTime || 5,
        published: true,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Post POST Error:', error);
    return NextResponse.json({ error: '글 저장에 실패했습니다.' }, { status: 500 });
  }
}
