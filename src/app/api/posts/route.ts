import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth, verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { isBot, deduplicateRapidLogs } from '@/app/api/admin/analytics/stats/route';

// GET /api/posts - 법률 칼럼 목록 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category'); // 'REHAB' | 'BANKRUPTCY' | 'SUCCESS_STORY'
  const publishedParam = searchParams.get('published'); // '' | 'true' | 'false'
  const subType = searchParams.get('subType'); // '' | 'REHAB' | 'BANKRUPTCY'
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const skip = (page - 1) * limit;
  try {
    let isAdmin = false;
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session_v1')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) isAdmin = true;
    }

    const where: any = {};
    if (!isAdmin) {
      where.published = true;
    } else if (publishedParam === 'true') {
      where.published = true;
    } else if (publishedParam === 'false') {
      where.published = false;
    }
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }

    const allMatched = await prisma.post.findMany({
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

    const isBankruptcyCase = (item: { title: string; tags: string | null }) => {
      const firstTag = (item.tags || '').split(',')[0]?.trim() || '';
      if (firstTag.includes('파산') && !firstTag.includes('회생')) return true;
      if (firstTag.includes('회생')) return false;
      if (item.title.includes('파산') && !item.title.includes('회생')) return true;
      if (item.title.includes('회생')) return false;
      if (item.tags?.includes('파산') && !item.tags?.includes('회생')) return true;
      return false;
    };

    const subFiltered =
      category === 'SUCCESS_STORY' && (subType === 'REHAB' || subType === 'BANKRUPTCY')
        ? allMatched.filter((p) => (subType === 'BANKRUPTCY' ? isBankruptcyCase(p) : !isBankruptcyCase(p)))
        : allMatched;

    const totalCount = subFiltered.length;
    const posts = subFiltered.slice(skip, skip + limit);

    // 관리자가 조회할 때는 해당 카테고리 목록 페이지(/s_story/rehab 등)의 누적 방문 조회수도 함께 반환
    let listPageViews: { rehabListViews: number; bankruptcyListViews: number; totalListViews: number } | undefined;
    if (isAdmin) {
      const targetPrefixes =
        category === 'SUCCESS_STORY'
          ? ['/s_story/rehab', '/s_story/bankruptcy', '/s_story']
          : category === 'REHAB'
          ? ['/rehab/posts', '/rehab']
          : category === 'BANKRUPTCY'
          ? ['/bankruptcy/posts', '/bankruptcy']
          : [];

      if (targetPrefixes.length > 0) {
        const rawLogs = await prisma.analytics.findMany({
          where: {
            OR: targetPrefixes.map(p => ({ path: { startsWith: p } })),
          },
          select: { id: true, ip: true, path: true, userAgent: true, createdAt: true },
        });
        const cleanLogs = deduplicateRapidLogs(
          rawLogs.filter(r => !isBot(r.userAgent, r.ip, r.path))
        );
        const normalize = (p: string) => (p.split('?')[0] || '/').trim().replace(/\/+$/, '') || '/';
        if (category === 'SUCCESS_STORY') {
          const rehabListViews = cleanLogs.filter(r => normalize(r.path) === '/s_story/rehab').length;
          const bankruptcyListViews = cleanLogs.filter(r => normalize(r.path) === '/s_story/bankruptcy').length;
          listPageViews = {
            rehabListViews,
            bankruptcyListViews,
            totalListViews: rehabListViews + bankruptcyListViews,
          };
        } else if (category === 'REHAB') {
          const rehabListViews = cleanLogs.filter(r => normalize(r.path) === '/rehab/posts').length;
          listPageViews = { rehabListViews, bankruptcyListViews: 0, totalListViews: rehabListViews };
        } else if (category === 'BANKRUPTCY') {
          const bankruptcyListViews = cleanLogs.filter(r => normalize(r.path) === '/bankruptcy/posts').length;
          listPageViews = { rehabListViews: 0, bankruptcyListViews, totalListViews: bankruptcyListViews };
        }
      }
    }

    return NextResponse.json({
      posts,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      ...(listPageViews && { listPageViews }),
    });
  } catch (error) {
    console.error('Posts GET Error:', error);
    return NextResponse.json({ error: '글 목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

// POST /api/posts - 관리자 글 작성
export async function POST(request: Request) {
  // 간단한 관리자 인증 (헤더 기반)
  const session = await requireAdminAuth(request, 'canManagePosts');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, excerpt, category, thumbnail, tags, author, readTime } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: '제목, 본문, 카테고리는 필수입니다.' }, { status: 400 });
    }

    const normalizedContent = (content || '').replace(/<p(\s[^>]*)?>\s*<\/p>/gi, '<p$1><br /></p>');
    const normalizedExcerpt = (excerpt || content.replace(/<[^>]+>/g, '').slice(0, 120) + '...').replace(/\*\*/g, '').trim();

    const post = await prisma.post.create({
      data: {
        title,
        content: normalizedContent,
        excerpt: normalizedExcerpt,
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
