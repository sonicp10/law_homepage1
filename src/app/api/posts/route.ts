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
    let totalDetailViews = subFiltered.reduce((acc, p) => acc + (p.viewCount || 0), 0);
    let posts: Array<(typeof subFiltered)[number] & { listExposureCount?: number }> = subFiltered.slice(skip, skip + limit);

    // 관리자가 조회할 때는 해당 카테고리 목록 페이지(/s_story/rehab 등)의 누적 방문 조회수 및 게시글별 목록 노출수·Analytics 상세 조회수 동기화 수행
    let listPageViews: { rehabListViews: number; bankruptcyListViews: number; totalListViews: number; totalDetailViews: number } | undefined;
    if (isAdmin) {
      const targetPrefixes =
        category === 'SUCCESS_STORY'
          ? ['/s_story/rehab', '/s_story/bankruptcy', '/s_story', '/']
          : category === 'REHAB'
          ? ['/rehab/posts', '/rehab']
          : category === 'BANKRUPTCY'
          ? ['/bankruptcy/posts', '/bankruptcy']
          : [];

      if (targetPrefixes.length > 0) {
        const orConditions: any[] = targetPrefixes
          .filter(p => p !== '/')
          .map(p => ({ path: { startsWith: p } }));
        if (category === 'SUCCESS_STORY') {
          orConditions.push({ path: '/' }, { path: { startsWith: '/?' } });
        }
        const rawLogs = await prisma.analytics.findMany({
          where: {
            OR: orConditions,
          },
          select: { id: true, ip: true, path: true, userAgent: true, createdAt: true },
        });
        const cleanLogs = deduplicateRapidLogs(
          rawLogs.filter(r => !isBot(r.userAgent, r.ip, r.path))
        );
        const normalize = (p: string) => (p.split('?')[0] || '/').trim().replace(/\/+$/, '') || '/';

        // 1) Analytics 상세 페이지 로그(/s_story/rehab/[id] 등)와 Post.viewCount 간 누락 보정(자동 동기화)
        const detailViewMap = new Map<string, number>();
        for (const log of cleanLogs) {
          const normPath = normalize(log.path);
          const match = normPath.match(/^\/(?:s_story\/(?:rehab|bankruptcy)|(?:rehab|bankruptcy)\/posts)\/([^/?#]+)$/);
          if (match && match[1]) {
            const pid = match[1];
            detailViewMap.set(pid, (detailViewMap.get(pid) || 0) + 1);
          }
        }

        // Analytics 로그 상 실제 상세 열람 횟수가 DB viewCount보다 높은 경우 DB를 즉시 보정
        for (const item of subFiltered) {
          const loggedViews = detailViewMap.get(item.id) || 0;
          if (loggedViews > item.viewCount) {
            item.viewCount = loggedViews;
            prisma.post.update({
              where: { id: item.id },
              data: { viewCount: loggedViews },
            }).catch(() => {});
          }
        }
        totalDetailViews = subFiltered.reduce((acc, p) => acc + (p.viewCount || 0), 0);

        // 2) 게시글별 목록 노출수(List Impressions) 계산: 게시글 작성 시점 이후 해당 목록 페이지(1페이지 상위 6개) 또는 메인 홈(상위 3개)에 노출된 횟수
        const publishedRehabStories = allMatched.filter(p => p.published && !isBankruptcyCase(p));
        const publishedBankruptcyStories = allMatched.filter(p => p.published && isBankruptcyCase(p));
        const publishedAllTop3Ids = new Set(allMatched.filter(p => p.published).slice(0, 3).map(p => p.id));
        const rehabPage1Ids = new Set(publishedRehabStories.slice(0, 6).map(p => p.id));
        const bankruptcyPage1Ids = new Set(publishedBankruptcyStories.slice(0, 6).map(p => p.id));
        const columnPage1Ids = new Set(allMatched.filter(p => p.published).slice(0, 6).map(p => p.id));

        posts = subFiltered.slice(skip, skip + limit).map((post) => {
          let listExposureCount = 0;
          if (post.published) {
            const postCreatedMs = new Date(post.createdAt).getTime();
            if (category === 'SUCCESS_STORY') {
              const isBank = isBankruptcyCase(post);
              const onCategoryPage1 = isBank ? bankruptcyPage1Ids.has(post.id) : rehabPage1Ids.has(post.id);
              const onHomeTop3 = publishedAllTop3Ids.has(post.id);
              const targetListPath = isBank ? '/s_story/bankruptcy' : '/s_story/rehab';
              for (const log of cleanLogs) {
                if (new Date(log.createdAt).getTime() >= postCreatedMs) {
                  const np = normalize(log.path);
                  if (onCategoryPage1 && np === targetListPath) listExposureCount++;
                  else if (onHomeTop3 && np === '/') listExposureCount++;
                }
              }
            } else if (category === 'REHAB' || category === 'BANKRUPTCY') {
              const targetListPath = category === 'REHAB' ? '/rehab/posts' : '/bankruptcy/posts';
              if (columnPage1Ids.has(post.id)) {
                for (const log of cleanLogs) {
                  if (new Date(log.createdAt).getTime() >= postCreatedMs && normalize(log.path) === targetListPath) {
                    listExposureCount++;
                  }
                }
              }
            }
          }
          return { ...post, listExposureCount };
        });

        if (category === 'SUCCESS_STORY') {
          const rehabListViews = cleanLogs.filter(r => normalize(r.path) === '/s_story/rehab').length;
          const bankruptcyListViews = cleanLogs.filter(r => normalize(r.path) === '/s_story/bankruptcy').length;
          listPageViews = {
            rehabListViews,
            bankruptcyListViews,
            totalListViews: rehabListViews + bankruptcyListViews,
            totalDetailViews,
          };
        } else if (category === 'REHAB') {
          const rehabListViews = cleanLogs.filter(r => normalize(r.path) === '/rehab/posts').length;
          listPageViews = { rehabListViews, bankruptcyListViews: 0, totalListViews: rehabListViews, totalDetailViews };
        } else if (category === 'BANKRUPTCY') {
          const bankruptcyListViews = cleanLogs.filter(r => normalize(r.path) === '/bankruptcy/posts').length;
          listPageViews = { rehabListViews: 0, bankruptcyListViews, totalListViews: bankruptcyListViews, totalDetailViews };
        }
      }
    }

    return NextResponse.json({
      posts,
      totalCount,
      totalDetailViews,
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
