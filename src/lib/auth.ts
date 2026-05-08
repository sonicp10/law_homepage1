import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lawoffice2024adminsecret'
);

const envAdminSecret = process.env.ADMIN_SECRET;
const fallbackAdminSession = {
  id: 'system-admin',
  role: 'SUPERADMIN',
  name: 'System Admin',
  permissions: {
    canManagePosts: true,
    canManageConsultations: true,
    canManageAdmins: true,
  },
};

export async function signToken(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
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

export async function getAdminServerSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session_v1')?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}

export async function requireAdminAuth(request?: Request, permission?: 'canManagePosts' | 'canManageConsultations' | 'canManageAdmins') {
  if (request && envAdminSecret) {
    const headerSecret = request.headers.get('x-admin-secret');
    if (headerSecret === envAdminSecret) {
      return fallbackAdminSession;
    }
  }

  const session: any = await getAdminServerSession();
  if (!session) return null;

  if (session.role === 'SUPERADMIN') return session;
  if (permission && !session.permissions?.[permission]) return null;

  return session;
}
