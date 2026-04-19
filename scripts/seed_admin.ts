import 'dotenv/config';
import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'sonicp@naver.com';
  const passwordText = 'zms!7ghkdth';
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User ${email} already exists.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(passwordText, 10);

  const admin = await prisma.user.create({
    data: {
      name: '대표 관리자',
      email,
      password: hashedPassword,
      role: 'SUPERADMIN',
      isActive: true,
      canManagePosts: true,
      canManageConsultations: true,
      canManageAdmins: true,
    },
  });

  console.log(`Created super admin: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
