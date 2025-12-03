import { Metadata } from 'next'
import ProfitContent from '@/components/ProfitContent' // 👈 컴포넌트 경로 확인해주세요!

// ⭐ 수익 기록장 전용 SEO 설정
export const metadata: Metadata = {
  // 1. 브라우저 탭 제목: 기능 중심 + 브랜드명
  title: '수익 기록장 - 내 공모주 투자 성과 한눈에 보기',
  
  // 2. 설명: "엑셀보다 편하다"는 점과 "재미요소(치킨)" 강조
  description: '공모주 청약으로 번 수익을 쉽고 간편하게 기록하세요. 목표 달성률 그래프와 치킨 지수로 투자의 재미를 더해드립니다.',
  
  // 3. 키워드: 사용자가 검색할만한 단어들
  keywords: ["공모주 수익", "투자 가계부", "주식 매도 기록", "매매일지", "치킨지수", "효도청약", "재테크"],

  // 4. 대표 주소 (Canonical)
  alternates: {
    canonical: '/profit',
  },

  // 5. 카톡/SNS 공유 시 보여줄 미리보기 (OG 태그)
  openGraph: {
    title: '내 공모주 수익은 치킨 몇 마리? 🍗 확인해보기', // 클릭을 유도하는 매력적인 제목
    description: '복잡한 엑셀은 그만! 효도 청약에서 수익을 기록하고 목표 달성률을 확인해보세요.',
    url: '/profit',
    siteName: '효도 청약',
    images: [
      {
        url: '/og-image.png', // 수익 기록장 전용 이미지가 있다면 교체 가능 (예: /profit-og.png)
        width: 1200,
        height: 630,
        alt: '효도 청약 수익 기록장 미리보기',
      },
    ],
    type: 'website', // 기사가 아니라 서비스 도구이므로 website
    locale: 'ko_KR',
  },
  
  // 6. 트위터 카드 (선택사항, 카톡 공유와 비슷하게 설정)
  twitter: {
    card: 'summary_large_image',
    title: '내 공모주 수익 기록장 💰',
    description: '공모주 투자 성과, 이제 쉽고 재미있게 관리하세요.',
  }
}

export default function ProfitPage() {
  // 실제 기능은 클라이언트 컴포넌트에서 동작
  return <ProfitContent />
}