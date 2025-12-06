import { Metadata } from 'next'
import IPODetailContent from '@/components/IPODetailContent'
import { getIpoData } from '@/utils/ipo-fetch'

type Props = {
  params: { id: string }
}

// 1. 서버 사이드 메타데이터 생성 (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 💡 한글 URL 디코딩 (안전장치)
  const id = decodeURIComponent(params.id);
  const data = await getIpoData(id);

  if (!data) {
    return {
      title: '정보를 찾을 수 없습니다 | 효도 청약',
      description: '요청하신 공모주 정보를 찾을 수 없습니다.',
    }
  }

  const stockName = data.stockName;
  const signal = data.recommendState ? `[${data.recommendState.split(' ')[0]}]` : '';
  
  const title = `${stockName} 청약 할까? 경쟁률 ${data.competitionRate} 확인하기`;
  const description = `${signal} 경쟁률 ${data.competitionRate}, 확약률 ${data.lockupRate}. ${data.reason ? data.reason.substring(0, 60) + "..." : ""}`;

  return {
    title: title,
    description: description,
    keywords: [stockName, "공모주", "청약", "상장일", "경쟁률", "효도청약"],
    alternates: {
      canonical: `/ipo/${id}`, // 인코딩된 문자열보다는 한글 그대로 혹은 디코딩된 값 추천 (상황에 따라 다름)
    },
    openGraph: {
      title: `${stockName} 청약 할까 말까? (신호등 분석)`,
      description: description,
      url: `https://hyodo-care.com/ipo/${encodeURIComponent(stockName)}`,
      images: [
        {
          url: '/og-image.png', // 팁: 나중에 동적 이미지(OG Image Generation)로 바꾸면 클릭률 대박 납니다.
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
  const id = decodeURIComponent(params.id); // 💡 여기도 디코딩
  const data = await getIpoData(id);

  if (!data) {
    return <div className="py-20 text-center text-gray-500">데이터를 불러올 수 없습니다.</div>
  }

  // 🔥 [SEO 치트키] 검색 엔진용 구조화 데이터 (JSON-LD)
  // 구글이 이 페이지를 "기사(Article)"나 "금융정보"로 명확히 인식하게 만듭니다.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${data.stockName} 공모주 청약 정보`,
    datePublished: new Date().toISOString(), // 데이터에 날짜가 없다면 오늘 날짜
    author: {
      '@type': 'Organization',
      name: '효도청약',
      url: 'https://hyodo-care.com'
    },
    description: `${data.stockName}의 청약 경쟁률, 일정, 매도 전략 분석`,
  };

  return (
    <>
      {/* 구조화 데이터 삽입 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 클라이언트 컴포넌트 */}
      <IPODetailContent id={id} initialData={data} />
    </>
  )
}