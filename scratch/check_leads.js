const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log('Recent Leads Data:');
  leads.forEach(lead => {
    console.log('====================================');
    console.log(`ID: ${lead.id}`);
    console.log(`Name: ${lead.name}`);
    console.log(`Phone: ${lead.phone}`);
    console.log(`Debt Amount: ${lead.debtAmount}`);
    console.log(`Content: ${lead.content}`);
    console.log(`Source: ${lead.source}`);
    console.log(`Extra Info:`, JSON.stringify(lead.extraInfo, null, 2));
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
