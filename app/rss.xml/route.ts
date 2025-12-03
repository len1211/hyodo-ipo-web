import RSS from 'rss';
import { db } from '@/app/firebase'; // 본인의 firebase 설정 파일 경로
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export async function GET() {
  // 1. RSS 피드 기본 설정
  const feed = new RSS({
    title: '효도 청약 - 시니어를 위한 공모주 알리미',
    description: '복잡한 공모주 정보를 신호등으로 쉽게 알려드립니다.',
    site_url: 'https://hyodo-care.com', // 실제 도메인 입력
    feed_url: 'https://hyodo-care.com/rss.xml',
    language: 'ko',
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Hyodo Care`,
  });

  try {
    console.log("🔥 RSS 생성 시작: DB 조회 시도...");

    // 2. Firebase에서 공모주 데이터 가져오기 (최신순 20개)
    // 'ipo_list'는 실제 공모주 데이터가 들어있는 컬렉션 이름으로 바꾸세요!
    const q = query(
      collection(db, 'ipo_list'), 
      orderBy('startDate', 'desc'), // 청약 시작일 기준 내림차순
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    // console.log(`✅ 가져온 문서 개수: ${querySnapshot.size}개`); // 로그 확인 포인트

    if (querySnapshot.empty) {
        console.error("❌ 데이터가 없습니다. 컬렉션 이름이나 DB를 확인하세요.");
      }

    // 3. 가져온 데이터를 RSS 아이템으로 변환
    querySnapshot.forEach((doc) => {
      const data = doc.data();
    //   console.log("📄 문서 데이터 확인:", data); // 필드명 확인용 로그
    //   console.log("doc Id = ", doc.id);

      feed.item({
        title: data.stockName, // 제목: 종목명 (예: 더본코리아)
        description: `공모가: ${data.price || '미정'}원 | 주관사: ${data.underwriter}`,
        url: `https://hyodo-care.com/ipo/${doc.id}`, // 클릭 시 이동할 상세 페이지 주소
        guid: doc.id,
        date: new Date(data.startDate || Date.now()), // 발행일 (청약 시작일)
        author: 'Hyodo Care',
      });
    });

  } catch (error) {
    console.error('RSS 생성 중 에러 발생:', error);
  }

  // 4. XML로 응답 반환
  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      // 캐시 설정 (선택사항: 1시간 동안 캐시)
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}