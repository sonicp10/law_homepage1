import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lawoffice2024adminsecret'
);

export async function signToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // 토큰 유효기간 1일
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

// API 라우트에서 컨텍스트 기반으로 세션 조회용 함수
export async function getAdminServerSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session_v1')?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch (error) {
    return null; // Next.js 환경 문제나 쿠키가 없을경우
  }
}

export async function requireAdminAuth(permission?: 'canManagePosts' | 'canManageConsultations' | 'canManageAdmins') {
  const session: any = await getAdminServerSession();
  if (!session) return null;
  
  if (session.role === 'SUPERADMIN') return session;
  if (permission && !session.permissions?.[permission]) return null;
  
  return session;
}
