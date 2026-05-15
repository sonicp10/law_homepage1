import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetAdminPassword() {
  const email = 'sonicp@naver.com';
  const newPassword = 'zms!@7ghkdth';
  
  console.log(`Checking user with email: ${email}...`);
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('User not found. Creating a new SUPERADMIN...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: '대표 관리자',
        role: 'SUPERADMIN',
        isActive: true,
        canManagePosts: true,
        canManageConsultations: true,
        canManageAdmins: true,
      },
    });
    console.log('New SUPERADMIN account created successfully.');
  } else {
    console.log('User found. Updating password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'SUPERADMIN',
        isActive: true,
        canManagePosts: true,
        canManageConsultations: true,
        canManageAdmins: true,
      },
    });
    console.log('Password and permissions updated successfully.');
  }
}

resetAdminPassword()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
