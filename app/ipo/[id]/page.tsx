import { Metadata } from 'next'
import IPODetailContent from '@/components/IPODetailContent'
import { getIpoData } from '@/utils/ipo-fetch' // ⭐ 1단계에서 만든 파일 경로 확인!

type Props = {
  params: { id: string }
}

// 1. 서버 사이드 메타데이터 생성 (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // ✅ 여기서 데이터 호출 (캐싱됨)
  const data = await getIpoData(params.id);

  // 데이터가 없을 때 기본값 처리
  if (!data) {
    return {
      title: '정보를 찾을 수 없습니다 | 효도 청약',
      description: '요청하신 공모주 정보를 찾을 수 없습니다.',
    }
  }

  // ✅ 데이터가 있으므로 여기서 바로 변수 할당
  const stockName = data.stockName;
  const signal = data.recommendState ? `[${data.recommendState.split(' ')[0]}]` : '';
  
  // 제목 및 설명 구성
  const title = `${stockName} 청약 할까? 경쟁률 ${data.competitionRate} 확인하기`;
  const description = `${signal} 경쟁률 ${data.competitionRate}, 확약률 ${data.lockupRate}. ${data.reason ? data.reason.substring(0, 60) + "..." : ""}`;

  return {
    title: title,
    description: description,
    keywords: [stockName, "공모주", "청약", "상장일", "경쟁률", "효도청약"],
    alternates: {
      canonical: `/ipo/${encodeURIComponent(stockName)}`,
    },
    openGraph: {
      title: `${stockName} 청약 할까 말까? (신호등 분석)`,
      description: description,
      url: `https://hyodo-care.com/ipo/${encodeURIComponent(stockName)}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${stockName} 분석 결과`,
        },
      ],
      locale: 'ko_KR',
      type: 'article',
    },
  }
}

// 2. 실제 페이지 화면 (서버 컴포넌트)
export default async function Page({ params }: Props) {
  // ✅ 여기서도 똑같은 함수 호출!
  // React cache 덕분에 위에서 부른 데이터(generateMetadata)를 그대로 씁니다. (비용 0, 속도 Fast)
  const data = await getIpoData(params.id);

  // ✅ Client Component에 데이터를 'initialData'로 넘겨줍니다.
  return <IPODetailContent id={params.id} initialData={data} />
}