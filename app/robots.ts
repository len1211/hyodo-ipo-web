import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hyodo-care.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      
      // 👇 [수정] 검색엔진이 굳이 안 봐도 되는 곳들은 막아줍니다.
      disallow: [
        // '/privacy',    // 이용약관/개인정보 페이지 (검색 결과에 나와봤자 클릭률 낮음)
        '/api/',       // API 라우트 (데이터 통신용이라 검색 불필요)
        '/admin/',     // 관리자 페이지 (혹시 나중에 만드신다면)
      ],
    },
    
    // 👇 [팁] RSS 주소도 같이 알려주면 봇들이 좋아합니다. (배열로 여러 개 가능)
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/rss.xml`, 
    ],
  }
}