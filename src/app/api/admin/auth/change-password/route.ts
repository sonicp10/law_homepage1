import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdminAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session: any = await requireAdminAuth(request);
    if (!session) {
      return NextResponse.json({ error: '인증이 필요합니다. 다시 로그인해주세요.' }, { status: 401 });
    }

    if (session.id === 'system-admin') {
      return NextResponse.json(
        { error: '시스템 환경변수 관리자 계정은 데이터베이스에서 비밀번호를 변경할 수 없습니다.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '새 비밀번호는 최소 6자 이상이어야 합니다.' }, { status: 400 });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.' }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      return NextResponse.json({ error: '새 비밀번호는 현재 비밀번호와 달라야 합니다.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: '사용자 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    const isValidCurrent = await bcrypt.compare(currentPassword, user.password);
    if (!isValidCurrent) {
      return NextResponse.json({ error: '현재 비밀번호가 일치하지 않습니다.' }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.id },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다. 다음 로그인 시 새 비밀번호를 사용해주세요.',
    });
  } catch (error) {
    console.error('Change Password Error:', error);
    return NextResponse.json({ error: '비밀번호 변경 처리 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
