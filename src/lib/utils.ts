/**
 * 전화번호 자동 하이픈 생성을 위한 유틸리티 함수
 * 010-123-4567 및 010-1234-5678 형식을 모두 지원하며 숫자가 입력될 때마다 실시간으로 변환합니다.
 */
export const formatPhone = (value: string) => {
  if (!value) return value;
  
  // 숫자가 아닌 모든 문자 제거
  const phoneNumber = value.replace(/[^\d]/g, '');
  const len = phoneNumber.length;

  // 11자 초과 시 잘라내기
  const nums = phoneNumber.slice(0, 11);

  if (len < 4) return nums;
  if (len < 8) {
    return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  }
  if (len < 11) {
    // 10자리 (010-123-4567)
    return `${nums.slice(0, 3)}-${nums.slice(3, 6)}-${nums.slice(6)}`;
  }
  // 11자리 (010-1234-5678)
  return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
};

/**
 * 숫자에 콤마를 추가하고 '원' 접미사를 붙이는 유틸리티 함수
 */
export const formatPrice = (value: string) => {
  if (!value) return "";
  const number = value.replace(/[^\d]/g, "");
  if (!number) return "";
  return Number(number).toLocaleString() + "원";
};
