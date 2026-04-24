import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import "./globals.css";

export const metadata = {
  title: "법무사 김형근 사무소 | 개인회생·파산 전문",
  description: "당신의 새로운 시작을 돕는 따뜻한 법률 파트너, 김형근 법무사 사무소입니다.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-outfit">
        <AnalyticsTracker />
        <PublicLayoutWrapper>
          {children}
        </PublicLayoutWrapper>
      </body>
    </html>
  );
}

