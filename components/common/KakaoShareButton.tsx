'use client';

import { useEffect } from 'react';
import Image from 'next/image'; // 카카오 아이콘용 (없으면 텍스트로 대체 가능)

type Props = {
  stockName: string; // 종목명 (예: 더본코리아)
  profit: number;    // 수익금 (예: 20000)
};

export default function KakaoShareButton({ stockName, profit }: Props) {

  // 1. 카카오 SDK 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        // 👇 아까 복사한 본인의 JavaScript 키를 여기에 넣으세요!
        window.Kakao.init('YOUR_JAVASCRIPT_KEY_HERE');
      }
    }
  }, []);

  // 2. 공유하기 함수
  const handleShare = () => {
    if (!window.Kakao) return;

    const chickenCount = Math.floor(profit / 20000); // 치킨 계산 로직 재사용
    const description = chickenCount > 0
      ? `🍗 치킨 ${chickenCount}마리 벌었어요! 효도청약 덕분이네요.`
      : `☕ 커피값 ${profit.toLocaleString()}원 벌었어요! 소소한 행복 ^^`;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `[수익인증] ${stockName} 매도 완료! 📈`,
        description: description,
        imageUrl:
          'https://hyodo-care.com/og-image.png', // 대표 이미지 URL (변경 필요)
        link: {
          mobileWebUrl: `https://hyodo-care.com?utm_source=kakao_share&stock=${encodeURIComponent(stockName)}&profit=${profit}`,
          webUrl: `https://hyodo-care.com?utm_source=kakao_share&stock=${encodeURIComponent(stockName)}&profit=${profit}`,
        },
      },
      buttons: [
        {
          title: '수익 인증 구경가기',
          link: {
            mobileWebUrl: `https://hyodo-care.com?utm_source=kakao_share&stock=${encodeURIComponent(stockName)}&profit=${profit}`,
            webUrl: `https://hyodo-care.com?utm_source=kakao_share&stock=${encodeURIComponent(stockName)}&profit=${profit}`,
          },
        },
      ],
    });
  };

  return (
    <button
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FAE100] py-3 text-[#371D1E] font-bold shadow-sm hover:bg-[#F9E000]/90"
    >
      {/* 아이콘 SVG (카카오톡 로고) */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C6.48 3 2 6.48 2 10.77C2 13.63 3.91 16.15 6.76 17.47L6.09 20.06C6.02 20.33 6.33 20.55 6.57 20.39L9.77 18.25C10.49 18.39 11.23 18.47 12 18.47C17.52 18.47 22 14.99 22 10.77C22 6.48 17.52 3 12 3Z" />
      </svg>
      카카오톡으로 가족에게 자랑하기
    </button>
  );
}