import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const [items, totalCount] = await Promise.all([
      prisma.boardQna.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true, author: true, phone: true, title: true,
          content: true, replyContent: true, status: true, createdAt: true,
        },
      }),
      prisma.boardQna.count(),
    ]);
    return NextResponse.json({ items, totalCount, totalPages: Math.ceil(totalCount / limit) });
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
