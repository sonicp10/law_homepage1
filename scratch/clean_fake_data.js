const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Checking for fake data ---');

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: '테스트' } },
        { author: { contains: '테스트' } }
      ]
    }
  });
  console.log(`Fake Posts: ${posts.length}`);

  const leads = await prisma.lead.findMany({
    where: {
      OR: [
        { name: { contains: '테스트' } },
        { source: { contains: 'TEST' } }
      ]
    }
  });
  console.log(`Fake Leads: ${leads.length}`);

  const cons = await prisma.consultation.findMany({
    where: {
      name: { contains: '테스트' }
    }
  });
  console.log(`Fake Consultations: ${cons.length}`);

  const qnas = await prisma.boardQna.findMany({
    where: {
      OR: [
        { title: { contains: '테스트' } },
        { author: { contains: '테스트' } }
      ]
    }
  });
  console.log(`Fake BoardQnas: ${qnas.length}`);

  // Actually delete them
  if (posts.length > 0) {
    const res = await prisma.post.deleteMany({
      where: { id: { in: posts.map(p => p.id) } }
    });
    console.log(`Deleted ${res.count} fake Posts.`);
  }

  if (leads.length > 0) {
    const res = await prisma.lead.deleteMany({
      where: { id: { in: leads.map(l => l.id) } }
    });
    console.log(`Deleted ${res.count} fake Leads.`);
  }

  if (cons.length > 0) {
    const res = await prisma.consultation.deleteMany({
      where: { id: { in: cons.map(c => c.id) } }
    });
    console.log(`Deleted ${res.count} fake Consultations.`);
  }

  if (qnas.length > 0) {
    const res = await prisma.boardQna.deleteMany({
      where: { id: { in: qnas.map(q => q.id) } }
    });
    console.log(`Deleted ${res.count} fake BoardQnas.`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
