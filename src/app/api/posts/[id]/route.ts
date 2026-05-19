import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// GET /api/posts/[id] - 단건 조회 + 조회수 증가 (관리자는 제외)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    let isAdmin = false;
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session_v1')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) isAdmin = true;
    }

    let post;
    if (isAdmin) {
      // 관리자는 조회수 증가 없이 조회만 수행
      post = await prisma.post.findUnique({
        where: { id }
      });
    } else {
      // 일반 사용자는 조회수 증가
      post = await prisma.post.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
    }
    
    if (!post) {
      return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
    }
    
    return NextResponse.json(post);
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
