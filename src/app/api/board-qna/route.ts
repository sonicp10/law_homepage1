import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const questions = await prisma.boardQna.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(questions);
  } catch (error) {
    console.error('BoardQna GET Error:', error);
    return NextResponse.json({ error: '게시글 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, password, phone, email, location, title, content } = body;

    const newQuestion = await prisma.boardQna.create({
      data: {
        author,
        password,
        phone,
        email,
        location,
        title,
        content,
      },
    });

    return NextResponse.json(newQuestion);
  } catch (error) {
    console.error('BoardQna POST Error:', error);
    return NextResponse.json({ error: '상담 글 저장에 실패했습니다.' }, { status: 500 });
  }
}
