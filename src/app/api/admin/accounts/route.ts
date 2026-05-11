import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  const session = await requireAdminAuth(request, 'canManageAdmins');
  if (!session) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });

  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPERADMIN'] } },
      select: {
        id: true, email: true, name: true, role: true, 
        isActive: true, memo: true, canManagePosts: true, 
        canManageConsultations: true, canManageAdmins: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: '목록 조회 실패' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminAuth(request, 'canManageAdmins');
  if (!session) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });

  try {
    const body = await request.json();
    const { email, password, name, memo, role, canManagePosts, canManageConsultations } = body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: '이미 존재하는 이메일입니다.' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        memo,
        role: role || 'ADMIN',
        canManagePosts: !!canManagePosts,
        canManageConsultations: !!canManageConsultations,
        canManageAdmins: false, // Only SUPERADMIN can manage admins normally, but if explicitly set we can change
      }
    });

    return NextResponse.json({ success: true, admin });
  } catch (error) {
    return NextResponse.json({ error: '계정 생성 실패' }, { status: 500 });
  }
}
