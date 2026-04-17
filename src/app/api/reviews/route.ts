import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
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

    const newReview = await prisma.review.create({
      data: {
        author,
        title,
        content,
        rating: Number(rating) || 5,
        password,
      },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Review POST Error:', error);
    return NextResponse.json({ error: '후기 저장에 실패했습니다.' }, { status: 500 });
  }
}
