const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing Lead creation...');
    const lead = await prisma.lead.create({
      data: {
        name: '테스트 유저',
        phone: '010-1234-5678',
        location: null,
        debtAmount: null,
        preferredType: '개인회생',
        content: '테스트 내용입니다.',
        source: 'TEST_SCRIPT',
        extraInfo: null,
      },
    });
    console.log('Success!', lead);
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
