const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Deleting all remaining dummy Leads and Consultations ---');
  const res1 = await prisma.lead.deleteMany();
  console.log(`Deleted ${res1.count} Leads.`);

  const res2 = await prisma.consultation.deleteMany();
  console.log(`Deleted ${res2.count} Consultations.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
