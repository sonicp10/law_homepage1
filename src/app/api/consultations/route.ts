import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, phone, location, category, visitDate, visitTime, content } = body;

    const newConsultation = await prisma.consultation.create({
      data: {
        type,
        name,
        phone,
        location,
        category,
        visitDate: visitDate ? new Date(visitDate) : null,
        visitTime,
        content,
      },
    });

    return NextResponse.json(newConsultation);
  } catch (error) {
    console.error('Consultation POST Error:', error);
    return NextResponse.json({ error: '상담 요청 저장에 실패했습니다.' }, { status: 500 });
  }
}
