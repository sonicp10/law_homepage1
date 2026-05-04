import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const skip = (page - 1) * limit;

  try {
    const where: any = { published: true };
    if (category) where.category = category as any;
    if (tag) {
      where.tags = { contains: tag, mode: 'insensitive' };
    }

    const [cases, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      cases,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Cases GET Error:', error);
    return NextResponse.json({ error: '사례를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, excerpt, category, thumbnail } = body;

    const newCase = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        category,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800',
        published: true,
      },
    });

    return NextResponse.json(newCase);
  } catch (error) {
    console.error('Case POST Error:', error);
    return NextResponse.json({ error: '성공사례 저장에 실패했습니다.' }, { status: 500 });
  }
}
