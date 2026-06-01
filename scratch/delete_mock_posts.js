const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.post.deleteMany({
    where: {
      category: {
        in: ['REHAB', 'BANKRUPTCY', 'SUCCESS_STORY']
      }
    }
  });
  console.log(`Deleted ${result.count} posts.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
