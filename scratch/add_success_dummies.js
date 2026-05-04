const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Adding more SUCCESS_STORY items with tags...');
  
  // Add 3 SUCCESS_STORY with '개인회생' tag
  for (let i = 1; i <= 3; i++) {
    await prisma.post.create({
      data: {
        title: `[성공] 개인회생 추가 테스트 사례 ${i}`,
        content: '성공사례 페이지네이션 테스트를 위한 본문입니다.',
        excerpt: '성공사례 페이지네이션 테스트용 요약입니다.',
        category: 'SUCCESS_STORY',
        tags: '개인회생,테스트',
        published: true,
      }
    });
  }
  
  // Add 3 SUCCESS_STORY with '개인파산' tag
  for (let i = 1; i <= 3; i++) {
    await prisma.post.create({
      data: {
        title: `[성공] 개인파산 추가 테스트 사례 ${i}`,
        content: '성공사례 페이지네이션 테스트를 위한 본문입니다.',
        excerpt: '성공사례 페이지네이션 테스트용 요약입니다.',
        category: 'SUCCESS_STORY',
        tags: '개인파산,테스트',
        published: true,
      }
    });
  }
  
  console.log('Successfully added 6 SUCCESS_STORY items.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
