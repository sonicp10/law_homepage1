import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManageAdmins');
  if (!session) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });

  try {
    const body = await request.json();
    const { password, name, memo, isActive, role, canManagePosts, canManageConsultations } = body;

    const data: any = {
      ...(name !== undefined && { name }),
      ...(memo !== undefined && { memo }),
      ...(isActive !== undefined && { isActive }),
      ...(role !== undefined && { role }),
      ...(canManagePosts !== undefined && { canManagePosts }),
      ...(canManageConsultations !== undefined && { canManageConsultations }),
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, admin: updated });
  } catch (error) {
    return NextResponse.json({ error: '계정 수정 실패' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdminAuth(request, 'canManageAdmins');
  if (!session) return NextResponse.json({ error: '권한이 없습니다.' }, { status: 401 });

  try {
    // 본인 계정 삭제 방지
    if (session.id === id) {
      return NextResponse.json({ error: '본인 계정은 삭제할 수 없습니다.' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '계정 삭제 실패' }, { status: 500 });
  }
}
