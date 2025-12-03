import { Metadata } from 'next'
import PrivacyContent from '@/components/PrivacyContent' // 👈 분리한 컴포넌트 임포트


export const metadata: Metadata = {
  title: '이용약관 및 개인정보처리방침',
  description: '효도 청약 서비스의 이용약관 및 개인정보 처리방침에 대한 안내입니다.',
  
  // 검색엔진이 "이건 정책 문서구나" 하고 이해하기 쉽게 설정
  robots: {
    index: false, // 보통 약관 페이지는 검색 결과에 노출 안 시키는 게 일반적입니다. (선택사항)
    follow: true, 
  },

  openGraph: {
    title: '효도 청약 이용약관',
    description: '서비스 이용약관 및 개인정보처리방침',
    url: '/privacy',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}