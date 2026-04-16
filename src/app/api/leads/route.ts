import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as z from 'zod';

const leadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(9),
  debtAmount: z.string().nullable().optional(),
  preferredType: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  source: z.string().optional(),
  extraInfo: z.any().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validation = leadSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다.', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, debtAmount, preferredType, content, source, extraInfo } = validation.data;

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        debtAmount: debtAmount || null,
        preferredType: preferredType || null,
        content: content || null,
        source: source || 'UNKNOWN',
        extraInfo: extraInfo || null,
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json(
      { error: '데이터 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
