import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as z from 'zod';

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

export async function POST(request: Request) {
  try {
    const json = await request.json();
    console.log('API RECEIVED LEAD JSON:', json);
    const validation = leadSchema.safeParse(json);

    if (!validation.success) {
      console.log('API VALIDATION FAILED:', validation.error.format());
      return NextResponse.json(
        { error: '입력 데이터가 유효하지 않습니다.', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, location, debtAmount, preferredType, content, source, extraInfo } = validation.data;

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

    console.log('API LEAD CREATED SUCCESS:', lead.id);
    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error('CRITICAL Lead creation error:', error);
    return NextResponse.json(
      { error: '데이터 저장 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}
