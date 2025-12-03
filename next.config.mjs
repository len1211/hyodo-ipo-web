import withPWA from "@ducanh2912/next-pwa";


/** @type {import('next').NextConfig} */
const nextConfig = {
  // capacitor andorid ios 쓸때 쓰는 output 속성 => 빌드 할떄 html을 미리 만들어줌.
  // output: 'export',
  images: {
    unoptimized: true,
  },
  turbopack: {},
}

// PWA 설정
const withPWAConfig = withPWA({
  dest: "public", // 서비스 워커 파일이 저장될 위치
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  // 개발 환경(development)에서는 PWA 기능을 끕니다 (디버깅 방해 방지)
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWAConfig(nextConfig);
