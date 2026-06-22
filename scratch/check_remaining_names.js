const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const leads = await prisma.lead.findMany({ select: { id: true, name: true, phone: true } });
  console.log('--- Remaining Leads ---');
  console.log(leads);

  const cons = await prisma.consultation.findMany({ select: { id: true, name: true, phone: true } });
  console.log('--- Remaining Consultations ---');
  console.log(cons);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
