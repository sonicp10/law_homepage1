import { NextResponse } from 'next/server';

export async function GET() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.ADMIN_NOTIFY_EMAIL;

  // 1. 환경변수 확인
  if (!user || !pass || !to) {
    return NextResponse.json({
      success: false,
      step: 'env_check',
      error: '환경변수 누락',
      debug: {
        GMAIL_USER: user ? '✅ 설정됨' : '❌ 없음',
        GMAIL_APP_PASSWORD: pass ? `✅ 설정됨 (길이:${pass.length})` : '❌ 없음',
        ADMIN_NOTIFY_EMAIL: to ? '✅ 설정됨' : '❌ 없음',
      }
    });
  }

  try {
    const nodemailer = (await import('nodemailer')).default;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    // 2. SMTP 연결 테스트
    await transporter.verify();

    // 3. 실제 메일 발송
    const info = await transporter.sendMail({
      from: `"법무사 김형근 사무소" <${user}>`,
      to,
      subject: '[테스트] 이메일 알림 테스트 - 법무사 김형근 사무소',
      html: `
        <div style="font-family:sans-serif;max-width:500px;padding:24px;border:1px solid #e0d5c5;border-radius:12px;">
          <h2 style="color:#0F172A;">✅ 이메일 알림 테스트 성공!</h2>
          <p>이 메일이 정상적으로 수신되었다면 이메일 알림 기능이 올바르게 설정된 것입니다.</p>
          <p style="color:#666;font-size:13px;">발송 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `메일 발송 성공! → ${to}`,
      messageId: info.messageId,
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      step: 'smtp_or_send',
      error: err.message,
      code: err.code,
      command: err.command,
    }, { status: 500 });
  }
}
