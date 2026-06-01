import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('zms!@7ghkdth', 10);
  
  // Update sonicp@naver.com
  const updated1 = await prisma.user.update({
    where: { email: 'sonicp@naver.com' },
    data: { password: hashedPassword },
  });
  console.log("Updated user password for:", updated1.email);

  // Update sonicp20@gmail.com
  const updated2 = await prisma.user.update({
    where: { email: 'sonicp20@gmail.com' },
    data: { password: hashedPassword },
  });
  console.log("Updated user password for:", updated2.email);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
