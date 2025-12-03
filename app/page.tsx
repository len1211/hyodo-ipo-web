import { Metadata } from 'next'
import HomeContent from '@/components/HomeContent' // 👈 방금 만든 알맹이 불러오기

// ⭐ 메인 페이지 전용 SEO 설정 ⭐
export const metadata: Metadata = {
  title: '효도 청약 - 노인도 쉬운 공모주 필수 앱',
  description: '복잡한 공모주, 신호등으로 쉽게 알려드립니다. 기관경쟁률, 의무보유확약, 상장일 매도 알림까지 한 번에 확인하세요.',
  keywords: ["공모주", "청약", "효도청약", "상장일", "공모주매도", "비례배정", "균등배정", "IPO"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '효도 청약 - 오늘의 추천주 신호등',
    description: '오늘 청약 안 하면 손해! 지금 바로 초록불 종목을 확인하세요.',
    url: '/', // 본인 도메인 확인
    siteName: '효도 청약',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '효도 청약 미리보기',
      },
    ],
    type: 'website',
    locale: 'ko_KR',
  },
}

// ⭐ 실제 화면은 HomeContent(클라이언트 컴포넌트)가 그립니다.
export default function HomePage() {
  return <HomeContent />
}