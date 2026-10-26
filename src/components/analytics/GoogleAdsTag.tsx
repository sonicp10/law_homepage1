'use client';

import Script from 'next/script';

export const GOOGLE_ADS_ID = 'AW-18530312690';
export const GOOGLE_ADS_CONVERSION_SEND_TO = 'AW-18530312690/tHP2CO_lvqUdEPLD-INF';

/**
 * Google Ads 전환 추적 이벤트 트리거 (리드 양식 제출 완료 시 호출)
 */
export const reportGoogleAdsConversion = () => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
      value: 1.0,
      currency: 'KRW',
    });
  }
};

export default function GoogleAdsTag() {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        id="google-ads-gtag-base"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script
        id="google-ads-gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `,
        }}
      />
    </>
  );
}
