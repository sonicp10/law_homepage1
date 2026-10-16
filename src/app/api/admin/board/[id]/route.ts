import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// DELETE /api/admin/board/[id] - 관리자 게시판 상담 글 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManageConsultations');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    await prisma.boardQna.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: '상담 글이 삭제되었습니다.' });
  } catch (error) {
    console.error('Board delete error:', error);
    return NextResponse.json({ error: '게시글 삭제에 실패했습니다.' }, { status: 500 });
  }
}
