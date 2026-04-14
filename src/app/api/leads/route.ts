import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, phone, debtAmount, content, source, extraInfo } = data;

    if (!name || !phone) {
      return NextResponse.json(
        { error: '이름과 연락처는 필수 입력 사항입니다.' },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        debtAmount: debtAmount || null,
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
