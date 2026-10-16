import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// PATCH /api/admin/leads/[id] - 리드 상태 변경
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManageConsultations');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    const updated = await prisma.lead.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Lead PATCH Error:', error);
    return NextResponse.json({ error: '상태 변경에 실패했습니다.' }, { status: 500 });
  }
}

// DELETE /api/admin/leads/[id] - 리드(상담신청) 영구 삭제
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManageConsultations');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    await prisma.lead.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: '상담 신청 데이터가 삭제되었습니다.' });
  } catch (error) {
    console.error('Lead DELETE Error:', error);
    return NextResponse.json({ error: '삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
