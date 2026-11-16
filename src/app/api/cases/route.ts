import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const skip = (page - 1) * limit;

  try {
    const where: any = { published: true };
    if (category) where.category = category as any;

    const allCases = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
        published: true,
        createdAt: true,
      },
    });

    // 성공사례(SUCCESS_STORY)의 '개인회생' vs '개인파산' 세부 분류를 배타적으로 판별
    // (태그에 '개인회생, 개인파산'을 함께 적어도 첫 번째 태그 또는 제목 기준에 따라 한쪽에만 정확히 노출)
    const isBankruptcyCase = (item: { title: string; tags: string | null }) => {
      const firstTag = (item.tags || '').split(',')[0]?.trim() || '';
      if (firstTag.includes('파산') && !firstTag.includes('회생')) return true;
      if (firstTag.includes('회생')) return false;
      if (item.title.includes('파산') && !item.title.includes('회생')) return true;
      if (item.title.includes('회생')) return false;
      if (item.tags?.includes('파산') && !item.tags?.includes('회생')) return true;
      return false;
    };

    const filteredCases = tag
      ? allCases.filter((item) => {
          if (tag === '개인파산' || tag === '파산') return isBankruptcyCase(item);
          if (tag === '개인회생' || tag === '회생') return !isBankruptcyCase(item);
          return (item.tags || '').toLowerCase().includes(tag.toLowerCase());
        })
      : allCases;

    const totalCount = filteredCases.length;
    const cases = filteredCases.slice(skip, skip + limit);

    return NextResponse.json({
      cases,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Cases GET Error:', error);
    return NextResponse.json({ error: '사례를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminAuth(request, 'canManagePosts');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, excerpt, category, thumbnail } = body;

    const newCase = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        category,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800',
        published: true,
      },
    });

    return NextResponse.json(newCase);
  } catch (error) {
    console.error('Case POST Error:', error);
    return NextResponse.json({ error: '성공사례 저장에 실패했습니다.' }, { status: 500 });
  }
}
