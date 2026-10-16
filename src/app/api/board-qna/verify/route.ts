import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { id, password } = await request.json();

    if (!id || !password) {
      return NextResponse.json({ error: '게시글 번호와 비밀번호를 모두 입력해 주세요.' }, { status: 400 });
    }

    const item = await prisma.boardQna.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json({ error: '해당 상담글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 비밀번호 검증 (bcrypt 해시 비교, 과거 평문 호환)
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, item.password);
    } catch {
      isMatch = false;
    }

    if (!isMatch && item.password === password) {
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.' }, { status: 401 });
    }

    // 검증 완료: 비밀글 원본 내용 및 법무사 답변 반환
    return NextResponse.json({
      success: true,
      item: {
        id: item.id,
        title: item.title,
        author: item.author,
        location: item.location,
        content: item.content,
        replyContent: item.replyContent,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
    });
  } catch (error) {
    console.error('BoardQna Verify Error:', error);
    return NextResponse.json({ error: '상담글 열람 검증 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
