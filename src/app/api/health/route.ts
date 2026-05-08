import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', database: 'connected' });
  } catch (error: any) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'error', database: 'disconnected', message: 'DB 연결을 확인하세요.' },
      { status: 500 }
    );
  }
}
