const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const z = require('zod');

const leadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(9),
  location: z.string().nullable().optional(),
  debtAmount: z.string().nullable().optional(),
  preferredType: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  source: z.string().optional(),
  extraInfo: z.any().optional(),
});

async function test() {
  const payload = {
    "type": "개인회생",
    "name": "김영밀",
    "phone": "010-1256-9874",
    "content": "",
    "source": "DRAGGABLE_PREMIUM_WIDGET_STEP",
    "preferredType": "개인회생"
  };

  const validation = leadSchema.safeParse(payload);
  console.log('Validation success:', validation.success);
  if (!validation.success) {
    console.log('Validation Error:', validation.error.format());
    return;
  }

  const { name, phone, location, debtAmount, preferredType, content, source, extraInfo } = validation.data;
  console.log('Processed data:', { name, phone, location, debtAmount, preferredType, content, source, extraInfo });

  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        location: location || null,
        debtAmount: debtAmount || null,
        preferredType: preferredType || null,
        content: content || null,
        source: source || 'UNKNOWN',
        extraInfo: extraInfo || null,
      },
    });
    console.log('Lead created successfully:', lead.id);
  } catch (err) {
    console.error('Database Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
