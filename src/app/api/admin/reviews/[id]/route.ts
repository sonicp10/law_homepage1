import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// PATCH /api/admin/reviews/[id] - 관리자 후기 수정 및 공개 여부 전환
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManagePosts');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { author, title, content, rating, isPublic } = body;

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(author !== undefined && { author: author.trim() }),
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(rating !== undefined && { rating: Math.min(5, Math.max(1, Number(rating) || 5)) }),
        ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
      },
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

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error('Admin Review PATCH Error:', error);
    return NextResponse.json({ error: '후기 수정에 실패했습니다.' }, { status: 500 });
  }
}

// DELETE /api/admin/reviews/[id] - 관리자 후기 영구 삭제
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManagePosts');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Review DELETE Error:', error);
    return NextResponse.json({ error: '후기 삭제에 실패했습니다.' }, { status: 500 });
  }
}
