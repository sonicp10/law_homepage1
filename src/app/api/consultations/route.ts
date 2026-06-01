import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { sendAdminNotification } from '@/lib/mailer';

const consultationSchema = z.object({
  type: z.enum(['PHONE', 'VISIT']),
  name: z.string().min(1, '이름을 입력해주세요.'),
  phone: z.string().min(9, '연락처를 정확히 입력해주세요.'),
  location: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  visitDate: z.string().nullable().optional().refine(
    (value) => !value || !Number.isNaN(Date.parse(value)),
    { message: '유효한 방문 일자를 입력해주세요.' }
  ),
  visitTime: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = consultationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: '입력값이 유효하지 않습니다.', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { type, name, phone, location, category, visitDate, visitTime, content } = validation.data;

    const newConsultation = await prisma.consultation.create({
      data: {
        type,
        name,
        phone,
        location: location || null,
        category: category || null,
        visitDate: visitDate ? new Date(visitDate) : null,
        visitTime: visitTime || null,
        content: content || null,
      },
    });

    // 관리자 이메일 알림 (서버리스 환경에서 메일 유실/지연 방지를 위해 await로 대기)
    await sendAdminNotification({
      type: 'CONSULTATION',
      name,
      phone,
      subType: type,
      content: content || undefined,
    });

    return NextResponse.json({ success: true, consultation: newConsultation });
  } catch (error: any) {
    console.error('Consultation POST Error:', error);
    return NextResponse.json({ error: '상담 요청 저장에 실패했습니다.' }, { status: 500 });
  }
}
