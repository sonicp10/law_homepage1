import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendAdminNotification } from '@/lib/mailer';
import { requireAdminAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// 이름 마스킹 함수 (예: 김철수 -> 김*수, 홍길 -> 홍*)
function maskName(name: string): string {
  if (!name) return '익명';
  if (name.length <= 1) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

// 전화번호 마스킹 함수 (예: 010-1234-5678 -> 010-****-5678)
function maskPhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/(\d{2,3})-?(\d{3,4})-?(\d{4})/, '$1-****-$3');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const adminSession = await requireAdminAuth(request, 'canManageConsultations');
    const isAdmin = !!adminSession;

    const [items, totalCount] = await Promise.all([
      prisma.boardQna.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          author: true,
          phone: true,
          email: true,
          location: true,
          title: true,
          content: true,
          replyContent: true,
          status: true,
          isSecret: true,
          createdAt: true,
        },
      }),
      prisma.boardQna.count(),
    ]);

    // 일반 방문자에게는 민감 개인정보 마스킹 및 비밀글 본문 보호
    const sanitizedItems = items.map((item) => {
      if (isAdmin) {
        return item; // 관리자는 원본 전체 열람 가능
      }

      const isSecret = item.isSecret ?? true;

      return {
        id: item.id,
        author: maskName(item.author),
        phone: maskPhone(item.phone),
        title: item.title,
        status: item.status,
        createdAt: item.createdAt,
        isSecret: isSecret,
        content: isSecret ? '비밀글로 작성된 상담 문의입니다.' : item.content,
        replyContent: isSecret
          ? (item.replyContent ? '비공개 답변이 등록되었습니다.' : null)
          : item.replyContent,
      };
    });

    return NextResponse.json({
      items: sanitizedItems,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('BoardQna GET Error:', error);
    return NextResponse.json({ error: '게시글 조회에 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, password, phone, email, location, title, content, isSecret } = body;

    if (!author || !password || !phone || !title || !content) {
      return NextResponse.json({ error: '필수 입력 항목이 누락되었습니다.' }, { status: 400 });
    }

    // 비밀번호 bcrypt 해싱 후 저장
    const hashedPassword = await bcrypt.hash(password, 10);

    const newQuestion = await prisma.boardQna.create({
      data: {
        author,
        password: hashedPassword,
        phone,
        email: email || null,
        location: location || null,
        title,
        content,
        isSecret: isSecret !== undefined ? !!isSecret : true,
      },
      select: {
        id: true,
        author: true,
        title: true,
        status: true,
        isSecret: true,
        createdAt: true,
      },
    });

    // 관리자 이메일 알림 (서버리스 환경에서 메일 유실 방지를 위해 await로 대기)
    await sendAdminNotification({
      type: 'BOARD_QNA',
      name: author,
      phone,
      title: title || undefined,
      content: content || undefined,
    });

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (error) {
    console.error('BoardQna POST Error:', error);
    return NextResponse.json({ error: '상담 글 저장에 실패했습니다.' }, { status: 500 });
  }
}
