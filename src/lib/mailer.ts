import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

type NotifyType = 'CONSULTATION' | 'BOARD_QNA' | 'DIAGNOSIS';

interface NotifyPayload {
  type: NotifyType;
  name: string;
  phone: string;
  subType?: string;   // 전화상담 / 방문상담 등
  title?: string;     // 게시판 제목
  content?: string;   // 내용 요약
  debtAmount?: string; // 채무액
  source?: string;    // 유입 경로
}

function getSubjectAndBody(payload: NotifyPayload): { subject: string; html: string } {
  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  const baseInfo = `
    <table style="width:100%;border-collapse:collapse;font-size:15px;">
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;width:120px;">신청 시각</td><td style="padding:8px;border:1px solid #ddd;">${now}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">성함</td><td style="padding:8px;border:1px solid #ddd;">${payload.name}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">연락처</td><td style="padding:8px;border:1px solid #ddd;">${payload.phone}</td></tr>
  `;

  if (payload.type === 'CONSULTATION') {
    const subject = `[상담신청 알림] ${payload.subType === 'VISIT' ? '방문상담' : '전화상담'} - ${payload.name} 고객`;
    const html = `
      <div style="font-family:'Noto Sans KR',sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0d5c5;border-radius:12px;overflow:hidden;">
        <div style="background:#0F172A;padding:24px;text-align:center;">
          <h2 style="color:#C5A059;margin:0;font-size:20px;">⚖️ 법무사 김형근 사무소</h2>
          <p style="color:#fff;margin:8px 0 0;font-size:14px;">[ ${payload.subType === 'VISIT' ? '📅 방문 상담' : '📞 전화 상담'} 신청 알림 ]</p>
        </div>
        <div style="padding:24px;background:#fff;">
          <p style="font-size:16px;color:#0F172A;font-weight:bold;margin-bottom:16px;">새로운 상담 신청이 접수되었습니다. 빠른 확인 부탁드립니다.</p>
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;width:120px;">신청 시각</td><td style="padding:8px;border:1px solid #ddd;">${now}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">상담 유형</td><td style="padding:8px;border:1px solid #ddd;">${payload.subType === 'VISIT' ? '방문 상담' : '전화 상담'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">성함</td><td style="padding:8px;border:1px solid #ddd;">${payload.name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">연락처</td><td style="padding:8px;border:1px solid #ddd;color:#C5A059;font-weight:bold;">${payload.phone}</td></tr>
            ${payload.content ? `<tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">상담내용</td><td style="padding:8px;border:1px solid #ddd;">${payload.content}</td></tr>` : ''}
          </table>
          <div style="margin-top:20px;padding:16px;background:#FFF8EE;border-left:4px solid #C5A059;border-radius:4px;">
            <p style="margin:0;font-size:14px;color:#7a6040;">📌 관리자 페이지에서 상세 내용을 확인하고 신속히 연락해 주세요.</p>
          </div>
        </div>
        <div style="padding:16px;background:#0F172A;text-align:center;">
          <p style="color:#C5A059;font-size:12px;margin:0;">법무사 김형근 사무소 | 02-6405-6363</p>
        </div>
      </div>
    `;
    return { subject, html };
  }

  if (payload.type === 'BOARD_QNA') {
    const subject = `[게시판 상담 알림] "${payload.title}" - ${payload.name} 고객`;
    const html = `
      <div style="font-family:'Noto Sans KR',sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0d5c5;border-radius:12px;overflow:hidden;">
        <div style="background:#0F172A;padding:24px;text-align:center;">
          <h2 style="color:#C5A059;margin:0;font-size:20px;">⚖️ 법무사 김형근 사무소</h2>
          <p style="color:#fff;margin:8px 0 0;font-size:14px;">[ 📝 게시판 상담 신청 알림 ]</p>
        </div>
        <div style="padding:24px;background:#fff;">
          <p style="font-size:16px;color:#0F172A;font-weight:bold;margin-bottom:16px;">새로운 게시판 상담 글이 등록되었습니다.</p>
          <table style="width:100%;border-collapse:collapse;font-size:15px;">
            <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;width:120px;">등록 시각</td><td style="padding:8px;border:1px solid #ddd;">${now}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">성함</td><td style="padding:8px;border:1px solid #ddd;">${payload.name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">연락처</td><td style="padding:8px;border:1px solid #ddd;color:#C5A059;font-weight:bold;">${payload.phone}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">제목</td><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">${payload.title || '-'}</td></tr>
            ${payload.content ? `<tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">내용 요약</td><td style="padding:8px;border:1px solid #ddd;">${payload.content.substring(0, 200)}${payload.content.length > 200 ? '...' : ''}</td></tr>` : ''}
          </table>
          <div style="margin-top:20px;padding:16px;background:#FFF8EE;border-left:4px solid #C5A059;border-radius:4px;">
            <p style="margin:0;font-size:14px;color:#7a6040;">📌 관리자 페이지 > 게시판 상담에서 전체 내용을 확인하고 답글을 달아주세요.</p>
          </div>
        </div>
        <div style="padding:16px;background:#0F172A;text-align:center;">
          <p style="color:#C5A059;font-size:12px;margin:0;">법무사 김형근 사무소 | 02-6405-6363</p>
        </div>
      </div>
    `;
    return { subject, html };
  }

  // DIAGNOSIS
  const subject = `[자가진단 알림] 새로운 자격진단 신청 - ${payload.name} 고객`;
  const html = `
    <div style="font-family:'Noto Sans KR',sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0d5c5;border-radius:12px;overflow:hidden;">
      <div style="background:#0F172A;padding:24px;text-align:center;">
        <h2 style="color:#C5A059;margin:0;font-size:20px;">⚖️ 법무사 김형근 사무소</h2>
        <p style="color:#fff;margin:8px 0 0;font-size:14px;">[ 📊 자가진단 신청 알림 ]</p>
      </div>
      <div style="padding:24px;background:#fff;">
        <p style="font-size:16px;color:#0F172A;font-weight:bold;margin-bottom:16px;">자가진단을 완료한 고객이 상담을 신청했습니다. 우선적으로 연락해 주세요!</p>
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;width:120px;">신청 시각</td><td style="padding:8px;border:1px solid #ddd;">${now}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">성함</td><td style="padding:8px;border:1px solid #ddd;">${payload.name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">연락처</td><td style="padding:8px;border:1px solid #ddd;color:#C5A059;font-weight:bold;">${payload.phone}</td></tr>
          ${payload.debtAmount ? `<tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">채무 규모</td><td style="padding:8px;border:1px solid #ddd;font-weight:bold;color:#e74c3c;">${payload.debtAmount}</td></tr>` : ''}
          ${payload.content ? `<tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">추가 정보</td><td style="padding:8px;border:1px solid #ddd;">${payload.content}</td></tr>` : ''}
          ${payload.source ? `<tr><td style="padding:8px;border:1px solid #ddd;background:#f9f9f9;font-weight:bold;">유입 경로</td><td style="padding:8px;border:1px solid #ddd;">${payload.source}</td></tr>` : ''}
        </table>
        <div style="margin-top:20px;padding:16px;background:#FFF8EE;border-left:4px solid #C5A059;border-radius:4px;">
          <p style="margin:0;font-size:14px;color:#7a6040;">📌 관리자 페이지 > 리드 관리에서 상세 진단 내용을 확인하세요.</p>
        </div>
      </div>
      <div style="padding:16px;background:#0F172A;text-align:center;">
        <p style="color:#C5A059;font-size:12px;margin:0;">법무사 김형근 사무소 | 02-6405-6363</p>
      </div>
    </div>
  `;
  return { subject, html };
}

export async function sendAdminNotification(payload: NotifyPayload): Promise<void> {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (!adminEmail || !process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('[Mailer] 이메일 환경변수가 설정되지 않아 알림을 건너뜁니다.');
    return;
  }

  const { subject, html } = getSubjectAndBody(payload);

  try {
    await transporter.sendMail({
      from: `"법무사 김형근 사무소" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject,
      html,
    });
    console.log(`[Mailer] 알림 이메일 발송 성공 → ${adminEmail}`);
  } catch (err) {
    // 이메일 실패가 본 API 응답을 막으면 안 되므로 에러만 로깅
    console.error('[Mailer] 이메일 발송 실패:', err);
  }
}
