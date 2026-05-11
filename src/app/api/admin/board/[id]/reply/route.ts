import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// PATCH /api/admin/board/[id]/reply - 게시판 답변 등록
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManageConsultations');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const { replyContent } = await request.json();

    const updated = await prisma.boardQna.update({
      where: { id },
      data: {
        replyContent,
        status: 'ANSWERED',
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Board Reply Error:', error);
    return NextResponse.json({ error: '답변 저장에 실패했습니다.' }, { status: 500 });
  }
}
