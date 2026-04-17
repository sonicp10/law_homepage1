import { redirect } from 'next/navigation';

export default function StoryPage() {
  // '전체보기' 삭제 요청에 따라 기본 성공사례 메인 접속 시 '개인회생' 사례로 리다이렉트합니다.
  redirect('/s_story/rehab');
  return null;
}
