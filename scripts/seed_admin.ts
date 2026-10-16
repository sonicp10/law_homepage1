import 'dotenv/config';
import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL || process.env.ADMIN_EMAIL;
  const passwordText = process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!email || !passwordText) {
    console.error('오류: ADMIN_SEED_EMAIL 및 ADMIN_SEED_PASSWORD 환경변수를 설정해주세요.');
    process.exit(1);
  }
  
  const existing = await prisma.user.findUnique({ where: { email } });
  const hashedPassword = await bcrypt.hash(passwordText, 10);
  
  if (existing) {
    console.log(`User ${email} already exists. Updating password...`);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    console.log('Password updated successfully.');
    return;
  }


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
