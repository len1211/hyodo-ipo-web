import { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/firebase' // Firebase 설정 파일 경로 확인
import IPODetailContent from '@/components/IPODetailContent' // 아까 만든 알맹이 컴포넌트

type Props = {
  params: { id: string }
}

// ⭐ [핵심] 동적 SEO 메타데이터 생성 함수
// 이 함수는 페이지가 열리기 전에 서버에서 먼저 실행됩니다.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. URL에 있는 id(종목명)를 한글로 변환
  const stockName = decodeURIComponent(params.id);
  
  // 2. 기본값 설정 (데이터가 없을 경우 대비)
  let title = `${stockName} 청약 정보 및 경쟁률 | 효도 청약`;
  let description = '신호등 분석으로 알아보는 공모주 필수 정보. 기관경쟁률, 의무보유확약, 상장일 정보를 확인하세요.';

  try {
    // 3. Firebase에서 해당 종목 데이터 미리 가져오기
    const docRef = doc(db, "ipo_list", stockName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // 4. 데이터를 이용해 매력적인 설명 문구 만들기
      // 예: "[🟢 강력 추천] 에임드바이오 - 기관경쟁률 1500:1, 확약률 30%"
      const signal = data.recommendState ? `[${data.recommendState.split(' ')[0]}]` : ''; // 🟢, 🟡, 🔴 만 추출
      title = `${stockName} 청약 할까? 경쟁률 ${data.competitionRate} 확인하기`;
      description = `${signal} 경쟁률 ${data.competitionRate}, 확약률 ${data.lockupRate}. ${data.reason ? data.reason.substring(0, 60) + "..." : ""}`;
    }
  } catch (e) {
    console.error("SEO 데이터 가져오기 실패:", e);
  }

  // 5. 완성된 메타데이터 반환
  return {
    title: title,
    description: description,
    keywords: [stockName, "공모주", "청약", "상장일", "경쟁률", "효도청약"],
    alternates: {
      canonical: `/ipo/${encodeURIComponent(stockName)}`,
    },
    openGraph: {
      title: `${stockName} 청약 할까 말까? (신호등 분석)`, // 카톡 공유 시 굵은 제목
      description: description, // 카톡 공유 시 작은 설명
      url: `https://hyodo-care.com/ipo/${encodeURIComponent(stockName)}`,
      images: [
        {
          url: '/og-image.png', // 기본 썸네일 (종목별 이미지가 있다면 여기서 교체 가능)
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

// ⭐ 실제 페이지 화면
export default function Page({ params }: Props) {
  // 서버는 껍데기만 제공하고, 실제 화면(알맹이)은 Client Component에게 맡깁니다.
  // URL에서 받은 id만 그대로 넘겨줍니다.
  return <IPODetailContent id={params.id} />
}