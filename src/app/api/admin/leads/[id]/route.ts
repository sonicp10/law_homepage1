import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// PATCH /api/admin/leads/[id] - 리드 상태 변경
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth('canManageConsultations');
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
