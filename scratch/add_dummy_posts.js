const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Adding dummy posts to test pagination...');
  
  // Add 2 REHAB posts
  for (let i = 1; i <= 2; i++) {
    await prisma.post.create({
      data: {
        title: `[테스트] 개인회생 추가 사례 ${i}`,
        content: '페이지네이션 테스트를 위한 자동 생성 본문입니다.',
        excerpt: '페이지네이션 테스트용 요약입니다.',
        category: 'REHAB',
        published: true,
        author: '시스템 테스트',
      }
    });
  }
  
  // Add 2 BANKRUPTCY posts
  for (let i = 1; i <= 2; i++) {
    await prisma.post.create({
      data: {
        title: `[테스트] 개인파산 추가 사례 ${i}`,
        content: '페이지네이션 테스트를 위한 자동 생성 본문입니다.',
        excerpt: '페이지네이션 테스트용 요약입니다.',
        category: 'BANKRUPTCY',
        published: true,
        author: '시스템 테스트',
      }
    });
  }
  
  console.log('Successfully added 4 dummy posts.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
