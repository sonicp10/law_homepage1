const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const counts = await prisma.post.groupBy({
    by: ['category'],
    _count: {
      id: true
    }
  });
  console.log(JSON.stringify(counts, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
