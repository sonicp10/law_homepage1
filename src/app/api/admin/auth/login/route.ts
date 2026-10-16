import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive || !user.password) {
      return NextResponse.json({ error: '등록되지 않은 계정이거나 비활성화된 계정입니다.' }, { status: 401 });
    }

    // Role check to ensure only admins can login
    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: '관리자 권한이 없습니다.' }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    // Sign JWT
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      permissions: {
        canManagePosts: user.canManagePosts,
        canManageConsultations: user.canManageConsultations,
        canManageAdmins: user.canManageAdmins,
      }
    });

    const response = NextResponse.json({ success: true });
    
    // Set HTTP Only cookie
    response.cookies.set('admin_session_v1', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // 관리자 기기 식별 쿠키 (1년간 유지되어 프론트엔드 및 백엔드 트래커에서 유입 통계 수집 차단)
    response.cookies.set('admin_device_excluded', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1년
      path: '/',
    });

    // 현재 관리자 접속 IP 쿠키
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const adminIp = rawIp.split(',')[0].trim();
    if (adminIp) {
      response.cookies.set('admin_last_ip', adminIp, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30일
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
