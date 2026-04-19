import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// GET /api/admin/leads - 리드 목록
export async function GET(request: Request) {
  const session = await requireAdminAuth('canManageConsultations');
  if (!session) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const [items, totalCount] = await Promise.all([
      prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.lead.count(),
    ]);
    return NextResponse.json({ items, totalCount, totalPages: Math.ceil(totalCount / limit) });
  } catch (error) {
    console.error('Leads GET Error:', error);
    return NextResponse.json({ error: '목록을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
