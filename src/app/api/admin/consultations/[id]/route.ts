import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// PATCH /api/admin/consultations/[id] - 상담 상태 변경
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth('canManageConsultations');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  try {
    const { status } = await request.json();

    const updated = await prisma.consultation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Consultation PATCH Error:', error);
    return NextResponse.json({ error: '상태 변경에 실패했습니다.' }, { status: 500 });
  }
}

// GET /api/admin/consultations - 상담 목록 전체 조회
export async function GET(request: Request) {
  const session = await requireAdminAuth('canManageConsultations');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const type = searchParams.get('type');
  const skip = (page - 1) * limit;

  try {
    const where: any = {};
    if (type) where.type = type;

    const [items, totalCount] = await Promise.all([
      prisma.consultation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.consultation.count({ where }),
    ]);

    return NextResponse.json({ items, totalCount, totalPages: Math.ceil(totalCount / limit) });
  } catch (error) {
    console.error('Consultation GET Error:', error);
    return NextResponse.json({ error: '목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
