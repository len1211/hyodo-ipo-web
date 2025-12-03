import { MetadataRoute } from 'next'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/app/firebase' // 경로 확인 (@ 사용 추천)

type FirebaseIPO = {
  stockName: string;
  updatedAt?: number; // DB에 이 필드가 있다면 활용
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hyodo-care.com'

  // 1. 정적 페이지 (빈도 조절로 크롤링 효율 높이기)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily', // 메인은 자주 바뀜 -> daily
      priority: 1,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly', // 가이드는 가끔 바뀜 -> weekly
      priority: 0.8,
    },
    // 👇 [추가] 수익 기록장 페이지 등록!
    {
      url: `${baseUrl}/profit`, 
      lastModified: new Date(),
      changeFrequency: 'weekly', // 도구 페이지는 매일 바뀌진 않으므로 weekly 적당
      priority: 0.9, // 꽤 중요한 메인 기능이므로 0.9 (가이드보다 높게)
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // 약관은 거의 안 바뀜 -> monthly
      priority: 0.3, // 중요도 낮음
    },
  ]

  // 2. 동적 페이지 (Firebase)
  let dynamicRoutes: MetadataRoute.Sitemap = []
  
  try {
    // 최신순으로 정렬해서 가져오면 봇이 최신 글을 먼저 봅니다.
    // (데이터가 너무 많아지면 limit(1000) 등을 붙여야 빌드 시간이 줄어듭니다)
    const q = query(collection(db, 'ipo_list')); // 필요하면 orderBy 추가
    const snapshot = await getDocs(q);

    dynamicRoutes = snapshot.docs.map((doc) => {
      const data = doc.data() as FirebaseIPO
      
      // updatedAt이 있으면 그걸 쓰고, 없으면 현재 시간
      const lastModified = data.updatedAt ? new Date(data.updatedAt) : new Date()
      
      return {
        // ⭐ [핵심 수정] data.stockName 대신 doc.id 사용 권장
        // Firebase 문서 ID가 곧 종목명(URL)이라면 doc.id가 가장 정확합니다.
        url: `${baseUrl}/ipo/${encodeURIComponent(doc.id)}`, 
        lastModified: lastModified,
        changeFrequency: 'daily', 
        priority: 0.7,
      }
    })
  } catch (error) {
    console.error('Sitemap generation failed:', error)
  }

  // 3. 합쳐서 반환
  return [...staticRoutes, ...dynamicRoutes]
}