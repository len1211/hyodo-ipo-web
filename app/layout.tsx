import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'
import Footer from '@/components/footer'
import AuthProvider from '@/components/AuthProvider'

import { GoogleAnalytics } from '@next/third-parties/google'

// 👇 [수정] 헤더와 바텀네비게이션 임포트
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#ffffff", // 상단바 흰색으로 깔끔하게 (파란색보다 추천)
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://hyodo-care.com'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  title: {
    template: '%s | 효도 청약',
    default: '효도 청약 - 노인도 쉬운 공모주 필수 앱',
  },
  description: '복잡한 공모주, 신호등으로 쉽게 알려드립니다. 기관경쟁률, 의무보유확약, 상장일 매도 알림까지 한 번에 확인하세요.',
  keywords: ["공모주", "청약", "효도청약", "상장일", "공모주매도", "공모주일정", "비례배정", "균등배정"],
  openGraph: {
    title: '효도 청약 - 오늘의 추천주 신호등',
    description: '오늘 청약 안 하면 손해! 지금 바로 초록불 종목을 확인하세요.',
    url: 'https://hyodo-ipo-web.vercel.app',
    siteName: '효도 청약',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '효도 청약 미리보기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/og-image-192x192.png',
    shortcut: '/og-image-192x192.png',
    apple: '/og-image-192x192.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="dd50cb6de3000b5feb2b795627ab179cc8ff8ac9" />
        <meta name="google-adsense-account" content="ca-pub-9693441631837902" />
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>

      <body className={`${inter.className} font-sans antialiased flex flex-col min-h-screen bg-gray-50`}>
        <AuthProvider>
          
          {/* 1. 전역 헤더 (PC/모바일 모두 상단 고정) */}
          <Header />

          {/* 2. 메인 콘텐츠 
             pb-20: 모바일에서 하단 탭바에 내용이 가려지지 않게 여백 확보 (가장 중요!)
             md:pb-0: PC에서는 하단 탭바가 없으므로 여백 제거
          */}
          <div className="flex-grow pb-20 md:pb-0 max-w-7xl mx-auto w-full">
            {children}
          </div>

          {/* 3. 모바일 전용 하단 탭바 (BottomNav 내부에서 md:hidden 처리됨) */}
          <BottomNav />

          <Analytics />
          
          {/* 푸터는 PC에서만 보이거나, 모바일에서는 맨 밑으로 밀림 */}
          <Footer />

          <GoogleAnalytics gaId="G-KSMPQWSX14" />

        </AuthProvider>
      </body>
    </html>
  )
}