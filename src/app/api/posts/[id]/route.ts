import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { isBot } from '@/app/api/admin/analytics/stats/route';

// GET /api/posts/[id] - 단건 조회 + 조회수 증가 (관리자 및 봇/중복 새로고침 제외)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const noIncrement = searchParams.get('noIncrement') === 'true';

    let shouldSkipIncrement = noIncrement;
    const cookieStore = await cookies();

    // 1. 관리자 세션 / 기기 제외 쿠키 체크
    if (cookieStore.get('admin_device_excluded')?.value === 'true') {
      shouldSkipIncrement = true;
    }
    const token = cookieStore.get('admin_session_v1')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) shouldSkipIncrement = true;
    }

    // 2. 관리자 IP 및 크롤러/봇 체크
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const clientIp = rawIp.split(',')[0].trim();
    const adminLastIp = cookieStore.get('admin_last_ip')?.value;
    if (adminLastIp && clientIp && clientIp === adminLastIp) {
      shouldSkipIncrement = true;
    }

    const userAgent = request.headers.get('user-agent') || '';
    if (isBot(userAgent, clientIp)) {
      shouldSkipIncrement = true;
    }

    // 3. 동일 브라우저 쿠키 기반 중복 조회수 증가 방지 (30분 쿨다운)
    const viewedCookie = cookieStore.get('viewed_posts')?.value || '';
    const viewedIds = viewedCookie.split(',').filter(Boolean);
    if (viewedIds.includes(id)) {
      shouldSkipIncrement = true;
    }

    let post;
    if (shouldSkipIncrement) {
      // 관리자, 봇, 또는 최근 이미 열람한 사용자는 조회수 증가 없이 조회만 수행
      post = await prisma.post.findUnique({
        where: { id }
      });
    } else {
      // 순수 신규 열람 시에만 조회수 +1 증가
      post = await prisma.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }
    
    if (!post) {
      return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    const response = NextResponse.json(post);
    if (!shouldSkipIncrement) {
      const updatedViewed = [...viewedIds.filter(v => v !== id), id].slice(-25).join(',');
      response.cookies.set('viewed_posts', updatedViewed, {
        maxAge: 30 * 60, // 30분 동안 동일 글 새로고침 시 조회수 중복 증가 방지
        path: '/',
        sameSite: 'lax',
      });
    }
    return response;
  } catch (error) {
    console.error('Post GET Error:', error);
    return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
  }
}

// PATCH /api/posts/[id] - 수정 (관리자 전용)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManagePosts');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, excerpt, category, thumbnail, tags, author, readTime, published } = body;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(category && { category }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(tags !== undefined && { tags }),
        ...(author !== undefined && { author }),
        ...(readTime !== undefined && { readTime }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('Post PATCH Error:', error);
    return NextResponse.json({ error: '글 수정에 실패했습니다.' }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - 삭제 (관리자 전용)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManagePosts');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Post DELETE Error:', error);
    return NextResponse.json({ error: '글 삭제에 실패했습니다.' }, { status: 500 });
  }
}
