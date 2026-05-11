import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// GET /api/admin/consultations/list - 목록 조회
export async function GET(request: Request) {
  const session = await requireAdminAuth(request, 'canManageConsultations');
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
      prisma.consultation.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.consultation.count({ where }),
    ]);

    return NextResponse.json({ items, totalCount, totalPages: Math.ceil(totalCount / limit) });
  } catch (error) {
    console.error('Consultation list error:', error);
    return NextResponse.json({ error: '목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
