import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/posts/[id] - 단건 조회 + 조회수 증가
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error('Post GET Error:', error);
    return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
  }
}

// PATCH /api/posts/[id] - 수정 (관리자 전용)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminSecret = request.headers.get('x-admin-secret');
  if (adminSecret !== 'lawoffice2024admin') {
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
  const adminSecret = request.headers.get('x-admin-secret');
  if (adminSecret !== 'lawoffice2024admin') {
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
