import { Metadata } from 'next'
import GuideContent from '@/components/GuideContent' // 👈 아까 만든 알맹이 불러오기

// ⭐ 가이드 페이지 전용 SEO 설정 (서버 컴포넌트라 가능!)
export const metadata: Metadata = {
  title: '노인도 쉬운 공모주 청약 방법 및 균등배정 꿀팁', // 브라우저 탭에 "공모주 투자 가이드 | 효도 청약" 으로 뜸
  description: '초보자도 3분이면 이해하는 공모주 투자 필승 전략과 필수 용어 정리. 비례배정, 균등배정, 따상, 증거금 계산법을 쉽게 알려드립니다.',
  openGraph: {
    title: '공모주 투자 가이드 - 실패 없는 투자의 시작',
    description: '초보자도 3분이면 이해하는 공모주 투자 필승 전략! 지금 바로 확인하세요.',
    url: 'https://hyodo-care.com/guide',
    siteName: '효도 청약',
    images: [
      {
        url: '/og-image.png', // 썸네일은 메인과 같은 걸 써도 되고, 가이드 전용을 따로 만들어도 됩니다.
        width: 1200,
        height: 630,
        alt: '공모주 투자 가이드 미리보기',
      },
    ],
    type: 'article', // 글 형식의 페이지라 'article'로 설정
  },
}

export default function GuidePage() {
  // 실제 화면 내용은 클라이언트 컴포넌트인 GuideContent가 담당합니다.
  return <GuideContent />
}