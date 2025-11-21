import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

// 폰트 설정 (변수명 사용을 위해 수정)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ⭐ 여기가 SEO 핵심 수정 부분입니다! ⭐
export const metadata: Metadata = {
  // 1. 검색 결과 제목 (브라우저 탭 이름)
  title: {
    template: '%s | 효도 청약',
    default: '효도 청약 - 노인도 쉬운 공모주 필수 앱', // 기본 제목
  },
  // 2. 검색 결과 설명 (제목 아래 작은 글씨)
  description: '복잡한 공모주, 신호등으로 쉽게 알려드립니다. 기관경쟁률, 의무보유확약, 상장일 매도 알림까지 한 번에 확인하세요.',
  
  // 3. 검색 키워드 (네이버/구글 로봇용)
  keywords: ["공모주", "청약", "효도청약", "상장일", "공모주매도", "공모주일정", "비례배정", "균등배정"],

  // 4. 카톡/문자로 링크 보낼 때 뜨는 미리보기 (Open Graph)
  openGraph: {
    title: '효도 청약 - 오늘의 추천주 신호등',
    description: '오늘 청약 안 하면 손해! 지금 바로 초록불 종목을 확인하세요.',
    url: 'https://hyodo-ipo-web.vercel.app', // (나중에 도메인 사면 여기만 바꾸세요!)
    siteName: '효도 청약',
    images: [
      {
        url: '/og-image.png', // public 폴더에 썸네일 이미지(1200x630)를 넣어두세요
        width: 1200,
        height: 630,
        alt: '효도 청약 미리보기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  // 5. 검색엔진 로봇 수집 허용
  robots: {
    index: true,
    follow: true,
  },

  // 6. 아이콘 (기존 유지)
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 네이버 서치어드바이저 소유권 확인 태그 (필요 시 주석 해제하고 값 입력) */}
        <meta name="naver-site-verification" content="dd50cb6de3000b5feb2b795627ab179cc8ff8ac9" />
        
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      {/* 폰트 적용 */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

