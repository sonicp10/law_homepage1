const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  
  console.log('🔄 Supabase 데이터베이스 연결 시도 중...');
  
  try {
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ 연결 성공!');
    console.log('📊 DB 버전:', result[0].version);
    
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📝 발견된 테이블 목록:', tableCheck.map(t => t.table_name).join(', '));

  } catch (error) {
    console.error('❌ 연결 실패!');
    console.error('⚠️ 오류 내용:', error.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
