import { MetadataRoute } from 'next'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'

// Firebase 데이터 타입
type FirebaseIPO = {
  stockName: string;
  updatedAt?: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hyodo-care.com' // 승환님의 도메인

  // 1. 정적 페이지들 (고정된 주소)
  const staticRoutes = [
    '',          // 메인 페이지
    '/guide',    // 가이드 페이지
    '/privacy',  // 약관 페이지
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. 동적 페이지들 (Firebase에서 가져오기)
  // 공모주 상세 페이지 (/ipo/종목명)를 자동으로 지도에 추가합니다.
  let dynamicRoutes: MetadataRoute.Sitemap = []
  
  try {
    const snapshot = await getDocs(collection(db, 'ipo_list'))
    dynamicRoutes = snapshot.docs.map((doc) => {
      const data = doc.data() as FirebaseIPO
      const lastModified = data.updatedAt ? new Date(data.updatedAt) : new Date()
      
      return {
        url: `${baseUrl}/ipo/${encodeURIComponent(data.stockName)}`,
        lastModified: lastModified,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }
    })
  } catch (error) {
    console.error('Sitemap generation failed:', error)
  }

  // 3. 합쳐서 반환
  return [...staticRoutes, ...dynamicRoutes]
}