import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/auth';

// 한국 표준시 (KST, UTC+9) 처리 헬퍼
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function toKST(date: Date): Date {
  return new Date(date.getTime() + KST_OFFSET_MS);
}

export function getKSTDateString(date: Date = new Date()): string {
  return toKST(date).toISOString().split('T')[0];
}

export function getKSTStartOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000+09:00`);
}

export function getKSTEndOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999+09:00`);
}

// 검색엔진 크롤러 및 봇 필터링 정규식
const BOT_REGEX = /bot|crawler|spider|googlebot|bingbot|yandex|naverbot|bytespider|headlesschrome|headless|phantomjs|python|axios|curl|wget|lighthouse|mediapartners|adsbot|ads-naver|dataprovider/i;

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_REGEX.test(userAgent);
}

// 유입 출처 스마트 분류 함수
function categorizeReferrer(rawRef: string | null): { name: string; category: string; icon: string } {
  if (!rawRef || rawRef.trim() === '' || rawRef === 'Direct') {
    return { name: '직접 유입 (Direct / 북마크)', category: 'DIRECT', icon: '📌' };
  }

  const lower = rawRef.toLowerCase();

  if (lower.includes('search.naver.com') || lower.includes('m.search.naver.com')) {
    return { name: '네이버 검색 (통합검색)', category: 'SEARCH', icon: '🟢' };
  }
  if (lower.includes('blog.naver.com')) {
    return { name: '네이버 블로그', category: 'BLOG', icon: '🟢' };
  }
  if (lower.includes('cafe.naver.com')) {
    return { name: '네이버 카페', category: 'COMMUNITY', icon: '🟢' };
  }
  if (lower.includes('naver.com')) {
    return { name: '네이버 (기타 서비스)', category: 'PORTAL', icon: '🟢' };
  }
  if (lower.includes('google.co') || lower.includes('google.com')) {
    return { name: '구글 검색 (Google)', category: 'SEARCH', icon: '🔵' };
  }
  if (lower.includes('daum.net') || lower.includes('search.daum.net')) {
    return { name: '다음 검색 (Daum)', category: 'SEARCH', icon: '🟡' };
  }
  if (lower.includes('kakao.com')) {
    return { name: '카카오톡 / 카카오 채널', category: 'SNS', icon: '🟡' };
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return { name: '유튜브 (YouTube)', category: 'VIDEO', icon: '🔴' };
  }
  if (lower.includes('instagram.com')) {
    return { name: '인스타그램 (Instagram)', category: 'SNS', icon: '🟣' };
  }
  if (lower.includes('facebook.com')) {
    return { name: '페이스북 (Facebook)', category: 'SNS', icon: '🔵' };
  }
  if (lower.includes('daangn.com')) {
    return { name: '당근마켓 (Daangn)', category: 'LOCAL', icon: '🟠' };
  }

  try {
    const url = new URL(rawRef.startsWith('http') ? rawRef : `https://${rawRef}`);
    return { name: url.hostname, category: 'REFERRAL', icon: '🌐' };
  } catch {
    return { name: rawRef.slice(0, 30), category: 'REFERRAL', icon: '🌐' };
  }
}

// 검색어(Keyword) 스마트 추출 함수
function extractSearchKeyword(path: string, referrer: string | null): string | null {
  // 1. path 내의 쿼리스트링 파싱 (utm_term, keyword, query, q 등)
  try {
    if (path.includes('?')) {
      const searchStr = path.split('?')[1];
      const params = new URLSearchParams(searchStr);
      const kw = params.get('utm_term') || params.get('keyword') || params.get('query') || params.get('q') || params.get('n_keyword');
      if (kw && kw.trim()) return decodeURIComponent(kw.trim());
    }
  } catch (e) {}

  // 2. referrer URL 내의 검색어 파라미터 파싱
  if (referrer) {
    try {
      const refUrl = new URL(referrer.startsWith('http') ? referrer : `https://${referrer}`);
      const kw = refUrl.searchParams.get('query') || 
                 refUrl.searchParams.get('n_keyword') || 
                 refUrl.searchParams.get('n_query') || 
                 refUrl.searchParams.get('q') || 
                 refUrl.searchParams.get('utm_term');
      if (kw && kw.trim()) return decodeURIComponent(kw.trim());
    } catch (e) {}
  }

  return null;
}

// 캠페인 / 유입 매체 파싱 함수
function extractCampaign(path: string): string | null {
  try {
    if (path.includes('?')) {
      const params = new URLSearchParams(path.split('?')[1]);
      const campaign = params.get('utm_campaign');
      if (campaign && campaign.trim()) return campaign.trim();
      if (params.has('gclid')) return '구글 광고 (Google Ads)';
    }
  } catch (e) {}
  return null;
}

// 모바일 및 디바이스 상세 기종 분류 함수
function parseDetailedDevice(userAgent: string | null): { type: 'MOBILE' | 'DESKTOP' | 'TABLET' | 'OTHER'; name: string; icon: string } {
  if (!userAgent) return { type: 'OTHER', name: '기타 (Unknown)', icon: '❓' };
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|kindle/.test(ua)) {
    return { type: 'TABLET', name: '태블릿 (iPad / Galaxy Tab)', icon: '📱' };
  }
  if (/iphone/.test(ua)) {
    return { type: 'MOBILE', name: 'Apple iPhone (iOS)', icon: '🍎' };
  }
  if (/android/.test(ua) && /mobile/.test(ua)) {
    return { type: 'MOBILE', name: 'Samsung Galaxy / Android', icon: '🤖' };
  }
  if (/macintosh|mac os x/.test(ua)) {
    return { type: 'DESKTOP', name: 'Apple Mac (macOS)', icon: '🍏' };
  }
  if (/windows/.test(ua)) {
    return { type: 'DESKTOP', name: 'Windows PC (Desktop)', icon: '💻' };
  }
  if (/linux/.test(ua)) {
    return { type: 'DESKTOP', name: 'Linux PC', icon: '🐧' };
  }
  return { type: 'OTHER', name: '기타 기기', icon: '🌐' };
}

export async function GET(request: Request) {
  // 관리자 권한 확인
  const session = await requireAdminAuth(request);
  if (!session) {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    // 현재 접속한 관리자의 IP 추출
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const currentAdminIp = rawIp.split(',')[0].trim();

    // 관리자 테스트 유입 제외 필터 (관리자 경로 + 관리자 IP)
    const excludedIps = ['127.0.0.1', '::1'];
    if (currentAdminIp) {
      excludedIps.push(currentAdminIp);
    }

    const adminFilter = {
      path: { not: { startsWith: '/admin' } },
      ...(excludedIps.length > 0 ? { ip: { notIn: excludedIps } } : {}),
    };

    let startDate: Date;
    let endDate: Date;

    const todayKstStr = getKSTDateString(new Date());

    if (startParam && endParam) {
      startDate = getKSTStartOfDay(startParam);
      endDate = getKSTEndOfDay(endParam);
    } else {
      endDate = getKSTEndOfDay(todayKstStr);
      switch (period) {
        case 'day': {
          startDate = getKSTStartOfDay(todayKstStr);
          break;
        }
        case 'week': {
          const d = toKST(new Date());
          d.setUTCDate(d.getUTCDate() - 7);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        case 'month': {
          const d = toKST(new Date());
          d.setUTCMonth(d.getUTCMonth() - 1);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        case 'quarter':
        case '3m': {
          const d = toKST(new Date());
          d.setUTCMonth(d.getUTCMonth() - 3);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        case '6m': {
          const d = toKST(new Date());
          d.setUTCMonth(d.getUTCMonth() - 6);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        case '1y': {
          const d = toKST(new Date());
          d.setUTCFullYear(d.getUTCFullYear() - 1);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
          break;
        }
        default: {
          const d = toKST(new Date());
          d.setUTCMonth(d.getUTCMonth() - 1);
          startDate = getKSTStartOfDay(d.toISOString().split('T')[0]);
        }
      }
    }
    // 1-1. 이전 기간 계산용 타임스탬프
    const duration = endDate.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - duration - 1000);
    const prevEndDate = new Date(startDate.getTime() - 1);

    // 1-2. 현재 기간 및 이전 기간 데이터 집계 (단일 병렬 쿼리로 DB 부하 최소화)
    const [currentRawLogs, prevRawLogs, currentLeads, currentConsultations, qnaCount, prevLeadC, prevConsultC, prevQnaC] = await Promise.all([
      prisma.analytics.findMany({
        where: { ...adminFilter, createdAt: { gte: startDate, lte: endDate } },
        select: { id: true, createdAt: true, ip: true, path: true, referrer: true, userAgent: true },
      }),
      prisma.analytics.findMany({
        where: { ...adminFilter, createdAt: { gte: prevStartDate, lte: prevEndDate } },
        select: { id: true, ip: true, userAgent: true },
      }),
      prisma.lead.findMany({ 
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { debtAmount: true, preferredType: true, location: true, extraInfo: true, source: true } 
      }),
      prisma.consultation.findMany({ 
        where: { createdAt: { gte: startDate, lte: endDate } },
        select: { category: true, type: true, location: true } 
      }),
      prisma.boardQna.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
      prisma.lead.count({ where: { createdAt: { gte: prevStartDate, lte: prevEndDate } } }),
      prisma.consultation.count({ where: { createdAt: { gte: prevStartDate, lte: prevEndDate } } }),
      prisma.boardQna.count({ where: { createdAt: { gte: prevStartDate, lte: prevEndDate } } }),
    ]);

    // 1-3. 봇/크롤러 허수 트래픽 필터링 (순수 사람 의뢰인 데이터만 정제)
    const currentLogs = currentRawLogs.filter(r => !isBot(r.userAgent));
    const prevLogs = prevRawLogs.filter(r => !isBot(r.userAgent));
    const botVisitsFiltered = currentRawLogs.length - currentLogs.length;

    const totalViews = currentLogs.length;
    const uniqueVisitors = new Set(currentLogs.map(r => r.ip).filter(Boolean)).size;

    const prevViews = prevLogs.length;
    const prevVisitors = new Set(prevLogs.map(r => r.ip).filter(Boolean)).size;

    const leadCount = currentLeads.length;
    const consultCount = currentConsultations.length;
    const totalLeads = leadCount + consultCount + qnaCount;
    const conversionRate = uniqueVisitors > 0 
      ? Number(((totalLeads / uniqueVisitors) * 100).toFixed(1)) 
      : 0;

    const prevLeads = prevLeadC + prevConsultC + prevQnaC;
    const prevConvRate = prevVisitors > 0 ? (prevLeads / prevVisitors) * 100 : 0;

    const calcTrend = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    const trends = {
      viewsTrend: calcTrend(totalViews, prevViews),
      visitorsTrend: calcTrend(uniqueVisitors, prevVisitors),
      leadTrend: calcTrend(totalLeads, prevLeads),
      rateTrend: calcTrend(conversionRate, prevConvRate),
    };

    // 2. 스마트 유입 경로 통계 (순수 사람 기준)
    const smartReferrerMap: { [key: string]: { name: string; count: number; icon: string; category: string } } = {};
    currentLogs.forEach(item => {
      const cat = categorizeReferrer(item.referrer);
      if (!smartReferrerMap[cat.name]) {
        smartReferrerMap[cat.name] = { name: cat.name, count: 0, icon: cat.icon, category: cat.category };
      }
      smartReferrerMap[cat.name].count += 1;
    });

    const referrers = Object.values(smartReferrerMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 2-1. 유입 검색어(Keyword) & 광고 캠페인 통계
    const keywordMap: { [kw: string]: number } = {};
    const campaignMap: { [cp: string]: number } = {};

    currentLogs.forEach(item => {
      const kw = extractSearchKeyword(item.path, item.referrer);
      if (kw) {
        keywordMap[kw] = (keywordMap[kw] || 0) + 1;
      }
      const cp = extractCampaign(item.path);
      if (cp) {
        campaignMap[cp] = (campaignMap[cp] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(keywordMap)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const campaignStats = Object.entries(campaignMap)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count);

    // 3. 인기 페이지 통계 (순수 사람 기준)
    const pageCounts: { [path: string]: number } = {};
    currentLogs.forEach(item => {
      pageCounts[item.path] = (pageCounts[item.path] || 0) + 1;
    });
    const popularPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, _count: { path: count } }))
      .sort((a, b) => b._count.path - a._count.path)
      .slice(0, 10);

    // 4. 날짜별 추이 데이터 (KST 기준)
    const processedTrend: { [key: string]: number } = {};
    currentLogs.forEach(item => {
      const kstTime = toKST(item.createdAt);
      const dateStr = kstTime.toISOString().split('T')[0];
      processedTrend[dateStr] = (processedTrend[dateStr] || 0) + 1;
    });

    const chartData = Object.entries(processedTrend)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 5. 시간대별 분석 (24시간, KST 기준 00:00 ~ 23:00)
    const hourlyBreakdown: { [key: string]: number } = {};
    for (let i = 0; i < 24; i++) {
      hourlyBreakdown[String(i).padStart(2, '0')] = 0;
    }
    currentLogs.forEach(item => {
      const kstTime = toKST(item.createdAt);
      const hour = String(kstTime.getUTCHours()).padStart(2, '0');
      hourlyBreakdown[hour] = (hourlyBreakdown[hour] || 0) + 1;
    });

    const hourlyChart = Object.entries(hourlyBreakdown)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    const sortedHours = [...hourlyChart].sort((a, b) => b.count - a.count);
    const peakHours = sortedHours
      .filter(h => h.count > 0)
      .slice(0, 2)
      .map(h => h.hour);

    // 6. 디바이스/브라우저 상세 분석 (모바일 기종 세분화)
    const detailedDeviceMap: { [name: string]: { name: string; count: number; icon: string; type: string } } = {};
    const browserDistribution: { [key: string]: number } = {};
    let mobileCount = 0;
    let desktopCount = 0;
    let tabletCount = 0;

    const parseBrowser = (userAgent: string | null) => {
      if (!userAgent) return '기타 (Other)';
      const ua = userAgent;
      if (/kakaotalk/i.test(ua)) return '카카오톡 인앱';
      if (/naver/i.test(ua)) return '네이버 인앱';
      if (/edg/i.test(ua)) return 'Edge';
      if (/chrome/i.test(ua) && !/edg/i.test(ua)) return 'Chrome';
      if (/safari/i.test(ua) && !/chrome/i.test(ua)) return 'Safari';
      if (/firefox/i.test(ua)) return 'Firefox';
      return '기타 브라우저';
    };

    currentLogs.forEach(item => {
      const dev = parseDetailedDevice(item.userAgent);
      if (dev.type === 'MOBILE') mobileCount++;
      else if (dev.type === 'DESKTOP') desktopCount++;
      else if (dev.type === 'TABLET') tabletCount++;

      if (!detailedDeviceMap[dev.name]) {
        detailedDeviceMap[dev.name] = { name: dev.name, count: 0, icon: dev.icon, type: dev.type };
      }
      detailedDeviceMap[dev.name].count += 1;

      const browser = parseBrowser(item.userAgent);
      browserDistribution[browser] = (browserDistribution[browser] || 0) + 1;
    });

    const totalLogs = currentLogs.length || 1;

    const detailedDeviceChart = Object.values(detailedDeviceMap)
      .map(d => ({ 
        ...d, 
        percentage: Number(((d.count / totalLogs) * 100).toFixed(1)) 
      }))
      .sort((a, b) => b.count - a.count);

    const deviceOverview = {
      mobile: mobileCount,
      desktop: desktopCount,
      tablet: tabletCount,
      mobilePercentage: Number(((mobileCount / totalLogs) * 100).toFixed(1)),
      desktopPercentage: Number(((desktopCount / totalLogs) * 100).toFixed(1)),
    };

    const browserChart = Object.entries(browserDistribution)
      .map(([browser, count]) => ({ 
        browser, 
        count, 
        percentage: Number(((count / totalLogs) * 100).toFixed(1)) 
      }))
      .sort((a, b) => b.count - a.count);

    // 7. 요일별 분석 (KST 기준 요일)
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayAnalytics: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    currentLogs.forEach(item => {
      const kstTime = toKST(item.createdAt);
      const day = kstTime.getUTCDay();
      dayAnalytics[day] = (dayAnalytics[day] || 0) + 1;
    });

    const dayChart = dayNames.map((name, idx) => ({
      day: name,
      count: dayAnalytics[idx] || 0,
    }));

    // 8. 의뢰인 인구통계 및 프로필 분석 (채무 규모, 절차 선호도, 지역 분포)
    const debtMap: { [key: string]: number } = {};
    const procedureMap: { [key: string]: number } = { '개인회생': 0, '개인파산': 0 };
    const regionMap: { [key: string]: number } = {};

    currentLeads.forEach(l => {
      if (l.debtAmount) debtMap[l.debtAmount] = (debtMap[l.debtAmount] || 0) + 1;
      if (l.preferredType) {
        if (l.preferredType.includes('회생')) procedureMap['개인회생']++;
        else if (l.preferredType.includes('파산')) procedureMap['개인파산']++;
      }
      if (l.location) regionMap[l.location] = (regionMap[l.location] || 0) + 1;
    });

    currentConsultations.forEach(c => {
      if (c.category) {
        if (c.category.includes('회생')) procedureMap['개인회생']++;
        else if (c.category.includes('파산')) procedureMap['개인파산']++;
      }
      if (c.location) regionMap[c.location] = (regionMap[c.location] || 0) + 1;
    });

    const debtDistribution = Object.entries(debtMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    const procedureDistribution = Object.entries(procedureMap)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({ name, count }));

    const regionDistribution = Object.entries(regionMap)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 9. 세부 상담 창구별 전환 리포트
    const consultationBreakdown = [
      { name: '온라인 자가진단 (Lead)', count: leadCount, percentage: totalLeads > 0 ? Number(((leadCount / totalLeads) * 100).toFixed(1)) : 0, color: '#A67C52' },
      { name: '전화 / 방문 상담 예약', count: consultCount, percentage: totalLeads > 0 ? Number(((consultCount / totalLeads) * 100).toFixed(1)) : 0, color: '#3B82F6' },
      { name: '게시판 1:1 상담 문의', count: qnaCount, percentage: totalLeads > 0 ? Number(((qnaCount / totalLeads) * 100).toFixed(1)) : 0, color: '#10B981' },
    ];

    return NextResponse.json({
      summary: {
        totalViews,
        uniqueVisitors,
        leadCount: totalLeads,
        conversionRate,
        consultationBreakdown,
        trends,
        peakHours,
        botVisitsFiltered,
        deviceOverview,
      },
      referrers,
      topKeywords,
      campaignStats,
      popularPages,
      chartData,
      hourlyChart,
      deviceChart: detailedDeviceChart,
      detailedDeviceChart,
      browserChart,
      dayChart,
      debtDistribution,
      procedureDistribution,
      regionDistribution,
      adminName: session.name || '대표 관리자',
      currentAdminIp: currentAdminIp || '확인됨',
      excludedAdminIps: excludedIps,
    });
  } catch (error) {
    console.error('Failed to fetch analytics stats:', error);
    return NextResponse.json({ error: '통계 데이터를 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

// DELETE /api/admin/analytics/stats - 현재 관리자 IP 또는 테스트 방문 로그 영구 정리
export async function DELETE(request: Request) {
  const session = await requireAdminAuth(request);
  if (!session) {
    return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 401 });
  }

  try {
    const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const currentAdminIp = rawIp.split(',')[0].trim();

    const targets: any[] = [
      { path: { startsWith: '/admin' } },
      { ip: '127.0.0.1' },
      { ip: '::1' },
    ];

    if (currentAdminIp) {
      targets.push({ ip: currentAdminIp });
    }

    const deleteResult = await prisma.analytics.deleteMany({
      where: {
        OR: targets,
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      message: `관리자 테스트 방문 로그 ${deleteResult.count}건이 통계 DB에서 완전히 정리되었습니다.`,
    });
  } catch (error) {
    console.error('Failed to cleanup admin test analytics:', error);
    return NextResponse.json({ error: '관리자 테스트 로그 정리에 실패했습니다.' }, { status: 500 });
  }
}
