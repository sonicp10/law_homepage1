const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Checking remaining data ---');
  console.log(`Posts: ${await prisma.post.count()}`);
  console.log(`Leads: ${await prisma.lead.count()}`);
  console.log(`Consultations: ${await prisma.consultation.count()}`);
  console.log(`BoardQnas: ${await prisma.boardQna.count()}`);
  console.log(`Reviews: ${await prisma.review.count()}`);
  console.log(`CaseStatus: ${await prisma.caseStatus.count()}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
