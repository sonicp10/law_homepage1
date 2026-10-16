import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        rating: true,
        author: true,
        createdAt: true,
        // password 필드는 절대 클라이언트에 노출하지 않음
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Reviews GET Error:', error);
    return NextResponse.json({ error: '데이터를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, title, content, rating, password } = body;

    if (!author || !title || !content) {
      return NextResponse.json({ error: '작성자, 제목, 내용을 모두 입력해주세요.' }, { status: 400 });
    }

    let hashedPassword = null;
    if (password && typeof password === 'string' && password.trim().length > 0) {
      hashedPassword = await bcrypt.hash(password.trim(), 10);
    }

    const newReview = await prisma.review.create({
      data: {
        author,
        title,
        content,
        rating: Number(rating) || 5,
        password: hashedPassword,
        isPublic: true,
      },
      select: {
        id: true,
        author: true,
        title: true,
        content: true,
        rating: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Review POST Error:', error);
    return NextResponse.json({ error: '후기 저장에 실패했습니다.' }, { status: 500 });
  }
}
