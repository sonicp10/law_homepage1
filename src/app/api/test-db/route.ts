import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1. 단순 쿼리 실행 (연결 확인)
    const result: any[] = await prisma.$queryRaw`SELECT version()`;
    
    // 2. 테이블 목록 확인
    const tableCheck: any[] = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;

    return NextResponse.json({
      success: true,
      message: 'Supabase 연결 성공!',
      dbVersion: result[0].version,
      tables: tableCheck.map(t => t.table_name)
    });

  } catch (error: any) {
    console.error('Test API Error:', error);
    return NextResponse.json({
      success: false,
      message: '연결 실패',
      error: error.message
    }, { status: 500 });
  }
}
